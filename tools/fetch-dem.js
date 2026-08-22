// Pobiera kafle terrarium (AWS Open Data) na zoomie 4 i skleja globalny raster wysokości.
// Terrarium: elevation = (R * 256 + G + B / 256) - 32768
const https = require('https');
const fs = require('fs');
const zlib = require('zlib');

const Z = 4, N = 1 << Z, TS = 256;
const SIZE = N * TS; // 4096
const elev = new Int16Array(SIZE * SIZE);

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, r => {
      if (r.statusCode !== 200) { r.resume(); return rej(new Error(url + ' -> ' + r.statusCode)); }
      const chunks = [];
      r.on('data', c => chunks.push(c));
      r.on('end', () => res(Buffer.concat(chunks)));
    }).on('error', rej);
  });
}

// Minimalny dekoder PNG: tylko 8-bit RGB/RGBA, bez przeplotu — tyle wystarcza dla terrarium.
function decodePNG(buf) {
  let off = 8, w = 0, h = 0, ct = 0, bd = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      bd = data[8]; ct = data[9];
      if (bd !== 8 || (ct !== 2 && ct !== 6)) throw new Error('PNG ' + bd + '/' + ct + ' nieobsługiwany');
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = ct === 6 ? 4 : 3;
  const stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[pos++];
    const line = raw.subarray(pos, pos + stride); pos += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      cur[x] = v & 255;
    }
  }
  return { w, h, bpp, data: out };
}

async function tile(tx, ty) {
  const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const png = decodePNG(await get(url));
      for (let y = 0; y < TS; y++) {
        for (let x = 0; x < TS; x++) {
          const i = (y * png.w + x) * png.bpp;
          const e = (png.data[i] * 256 + png.data[i + 1] + png.data[i + 2] / 256) - 32768;
          elev[(ty * TS + y) * SIZE + (tx * TS + x)] = Math.max(-500, Math.min(9000, Math.round(e)));
        }
      }
      return;
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise(r => setTimeout(r, 600));
    }
  }
}

(async () => {
  const jobs = [];
  for (let tx = 0; tx < N; tx++) for (let ty = 0; ty < N; ty++) jobs.push([tx, ty]);
  let done = 0;
  const CONC = 8;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (jobs.length) {
      const j = jobs.pop();
      await tile(j[0], j[1]);
      if (++done % 64 === 0) console.log('kafle:', done, '/', N * N);
    }
  }));
  fs.writeFileSync('dem4096.bin', Buffer.from(elev.buffer));
  console.log('zapisano dem4096.bin', (elev.byteLength / 1048576).toFixed(1), 'MB');
})();
