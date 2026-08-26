/**
 * Generuje ikony serwisu z oryginalnego logo: favicon, ikonę na ekran główny
 * i obrazek do udostępnień w social mediach. Wszystko na czystym Node — bez bibliotek.
 *
 * Uruchomienie:  node tools/deploy-assets.js  (z katalogu głównego repozytorium)
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SRC = path.join(__dirname, '..', 'materiały', 'logo.png');
const OUT = path.join(__dirname, '..', 'prototyp', 'assets');

const CARBON = [6, 6, 6];
const LIME = [197, 255, 74];

// ---------- PNG ----------
function crc32(buf) {
  let c, t = [];
  for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  let crc = 0xffffffff;
  for (const b of buf) crc = t[(crc ^ b) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, c]);
}
function encodePNG(w, h, rgb) {
  const rows = [];
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(w * 3 + 1);
    row[0] = 0;
    rgb.copy(row, 1, y * w * 3, (y + 1) * w * 3);
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
function decodePNG(buf) {
  let off = 8, w = 0, h = 0, ct = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); ct = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = { 0: 1, 2: 3, 4: 2, 6: 4 }[ct];
  if (!bpp) throw new Error('nieobsługiwany typ koloru PNG: ' + ct);
  const stride = w * bpp, out = Buffer.alloc(h * stride);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[pos++];
    const line = raw.subarray(pos, pos + stride); pos += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0, b = prev ? prev[x] : 0, c = prev && x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      cur[x] = v & 255;
    }
  }
  return { w, h, bpp, data: out };
}

// ---------- rysowanie ----------
const src = decodePNG(fs.readFileSync(SRC));
/** Jasność piksela źródła jako maska znaku (logo to biały kształt na ciemnym tle). */
function markAlpha(sx, sy) {
  const i = (sy * src.w + sx) * src.bpp;
  const lum = src.bpp >= 3
    ? src.data[i] * 0.299 + src.data[i + 1] * 0.587 + src.data[i + 2] * 0.114
    : src.data[i];
  return Math.max(0, Math.min(1, (lum - 26) / 190));
}
/** Wkleja znak w podanym prostokącie, uśredniając piksele źródła (box filter). */
function drawMark(rgb, W, H, box, color) {
  const [bx, by, bw, bh] = box;
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const x0 = Math.floor(x * src.w / bw), x1 = Math.max(x0 + 1, Math.floor((x + 1) * src.w / bw));
      const y0 = Math.floor(y * src.h / bh), y1 = Math.max(y0 + 1, Math.floor((y + 1) * src.h / bh));
      let sum = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) for (let sx = x0; sx < x1; sx++) { sum += markAlpha(sx, sy); n++; }
      const a = sum / n;
      if (a <= 0.004) continue;
      const px = bx + x, py = by + y;
      if (px < 0 || px >= W || py < 0 || py >= H) continue;
      const o = (py * W + px) * 3;
      for (let ch = 0; ch < 3; ch++) rgb[o + ch] = Math.round(rgb[o + ch] * (1 - a) + color[ch] * a);
    }
  }
}
function canvas(W, H, bg) {
  const rgb = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) { rgb[i * 3] = bg[0]; rgb[i * 3 + 1] = bg[1]; rgb[i * 3 + 2] = bg[2]; }
  return rgb;
}

fs.mkdirSync(OUT, { recursive: true });

// favicon 16, 32 i 64 — znak wypełnia niemal cały kwadrat, bo w karcie liczy się czytelność
const kwadraty = {};
for (const size of [16, 32, 64]) {
  const rgb = canvas(size, size, CARBON);
  const h = Math.round(size * 0.82), w = Math.round(h * src.w / src.h);
  drawMark(rgb, size, size, [Math.round((size - w) / 2), Math.round((size - h) / 2), w, h], [255, 255, 255]);
  const png = encodePNG(size, size, rgb);
  kwadraty[size] = png;
  if (size > 16) fs.writeFileSync(path.join(OUT, `favicon-${size}.png`), png);
}

// Ikony na ekran główny Androida. 512 z zapasem na maskę — system potrafi wyciąć z niej
// koło albo kwadrat z zaokrągleniem, więc znak nie może dotykać krawędzi.
for (const [size, udzial] of [[192, 0.62], [512, 0.52]]) {
  const rgb = canvas(size, size, CARBON);
  const h = Math.round(size * udzial), w = Math.round(h * src.w / src.h);
  drawMark(rgb, size, size, [Math.round((size - w) / 2), Math.round((size - h) / 2), w, h], [255, 255, 255]);
  fs.writeFileSync(path.join(OUT, `icon-${size}.png`), encodePNG(size, size, rgb));
}

// favicon.ico — przeglądarki i roboty pytają o /favicon.ico niezależnie od znaczników
// w nagłówku. Bez tego pliku zapytanie trafiłoby na stronę błędu albo na starego WordPressa.
{
  const rozmiary = [16, 32, 64];
  const naglowek = Buffer.alloc(6 + 16 * rozmiary.length);
  naglowek.writeUInt16LE(0, 0); naglowek.writeUInt16LE(1, 2); naglowek.writeUInt16LE(rozmiary.length, 4);
  let offset = naglowek.length;
  rozmiary.forEach((size, i) => {
    const png = kwadraty[size];
    const at = 6 + i * 16;
    naglowek[at] = size >= 256 ? 0 : size;
    naglowek[at + 1] = size >= 256 ? 0 : size;
    naglowek[at + 2] = 0; naglowek[at + 3] = 0;
    naglowek.writeUInt16LE(1, at + 4);
    naglowek.writeUInt16LE(32, at + 6);
    naglowek.writeUInt32LE(png.length, at + 8);
    naglowek.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), Buffer.concat([naglowek, ...rozmiary.map((r) => kwadraty[r])]));
}

// ikona na ekran główny (iOS wymaga tła, nie lubi przezroczystości)
{
  const S = 180;
  const rgb = canvas(S, S, CARBON);
  const h = Math.round(S * 0.62), w = Math.round(h * src.w / src.h);
  drawMark(rgb, S, S, [Math.round((S - w) / 2), Math.round((S - h) / 2), w, h], [255, 255, 255]);
  fs.writeFileSync(path.join(OUT, 'apple-touch-icon.png'), encodePNG(S, S, rgb));
}

// obrazek do udostępnień: znak na ciemnym tle z limonkowym paskiem u dołu
{
  const W = 1200, H = 630;
  const rgb = canvas(W, H, CARBON);
  // delikatna poświata z lewej, jak na stronie
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = (x - W * 0.12) / (W * 0.5), dy = (y - H * 0.1) / (H * 0.7);
      const g = Math.max(0, 1 - (dx * dx + dy * dy)) * 0.16;
      if (g <= 0) continue;
      const o = (y * W + x) * 3;
      rgb[o] = Math.round(rgb[o] * (1 - g) + 89 * g);
      rgb[o + 1] = Math.round(rgb[o + 1] * (1 - g) + 115 * g);
      rgb[o + 2] = Math.round(rgb[o + 2] * (1 - g) + 33 * g);
    }
  }
  const h = Math.round(H * 0.46), w = Math.round(h * src.w / src.h);
  drawMark(rgb, W, H, [Math.round((W - w) / 2), Math.round(H * 0.24), w, h], [255, 255, 255]);
  for (let y = H - 14; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 3;
      rgb[o] = LIME[0]; rgb[o + 1] = LIME[1]; rgb[o + 2] = LIME[2];
    }
  }
  fs.writeFileSync(path.join(OUT, 'og-image.png'), encodePNG(W, H, rgb));
}

console.log('ikony gotowe w', OUT);
for (const f of fs.readdirSync(OUT)) {
  console.log('  ' + f, (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(1) + ' KB');
}
