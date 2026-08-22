/**
 * Buduje dane terenu dla globusa:
 *  - globalna chmura punktów lądu (widok kuli) z wysokością,
 *  - siedem siatek topograficznych, po jednej na kontynent (widok po zbliżeniu).
 *
 * Wejście: dem4096.bin (Web Mercator z kafli terrarium) + ne50.json (granice państw z polem CONTINENT).
 * Wyjście: terrain.bin.gz.b64 — jeden blob gzip zakodowany base64, rozpakowywany w przeglądarce
 * przez DecompressionStream.
 */
const fs = require('fs');
const zlib = require('zlib');

const SIZE = 4096;
const dem = new Int16Array(fs.readFileSync('dem4096.bin').buffer);

function demAt(lon, lat) {
  // Web Mercator obsługuje |lat| < 85.05 — poniżej tego progu (wnętrze Antarktydy)
  // przyklejamy wartość z ostatniego dostępnego równoleżnika: to płaskowyż o w miarę stałej wysokości.
  const la = Math.max(-84.8, Math.min(84.8, lat));
  const x = ((lon + 180) / 360) * SIZE;
  const s = Math.sin((la * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * SIZE;
  const xi = Math.max(0, Math.min(SIZE - 1, Math.round(x)));
  const yi = Math.max(0, Math.min(SIZE - 1, Math.round(y)));
  return dem[yi * SIZE + xi];
}

/** Uśrednienie z okna 3x3 — zbija szum pojedynczych pikseli, zachowuje kształt grzbietów. */
function demSmooth(lon, lat, stepDeg) {
  let sum = 0, n = 0, max = -32768;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const v = demAt(lon + dx * stepDeg * 0.4, lat + dy * stepDeg * 0.4);
      sum += v; n++;
      if (v > max) max = v;
    }
  }
  // Lekkie przechylenie w stronę maksimum, żeby grzbiety górskie nie rozmyły się w średniej.
  return sum / n * 0.65 + max * 0.35;
}

/** 0 = poza lądem, 1..255 = wysokość (krzywa pierwiastkowa daje więcej rozdzielczości nizinom). */
function encodeElev(h) {
  if (h < 0) h = 0;
  const t = Math.min(1, h / 6200);
  return Math.max(1, Math.min(255, Math.round(1 + 254 * Math.pow(t, 0.62))));
}

// ---------- kontynenty ----------
const gj = JSON.parse(fs.readFileSync('ne50.json', 'utf8'));

/**
 * Kadry dobrane ręcznie. Automatyczny bbox z geometrii psują terytoria zamorskie
 * (Gujana Francuska w „Europie”) i przecięcie 180. południka (Rosja, Oceania).
 */
const CONTINENTS = [
  { key: 'europa',   ne: 'Europe',        pl: 'Europa',              lon0: -11, lon1: 42,  lat0: 35,  lat1: 71,  step: 0.24 },
  { key: 'afryka',   ne: 'Africa',        pl: 'Afryka',              lon0: -18, lon1: 52,  lat0: -35, lat1: 38,  step: 0.36 },
  { key: 'azja',     ne: 'Asia',          pl: 'Azja',                lon0: 26,  lon1: 146, lat0: 2,   lat1: 76,  step: 0.44 },
  { key: 'ampn',     ne: 'North America', pl: 'Ameryka Północna',    lon0: -168, lon1: -52, lat0: 7,  lat1: 72,  step: 0.42 },
  { key: 'ampd',     ne: 'South America', pl: 'Ameryka Południowa',  lon0: -82, lon1: -34, lat0: -56, lat1: 13,  step: 0.3 },
  { key: 'oceania',  ne: 'Oceania',       pl: 'Australia i Oceania', lon0: 112, lon1: 179, lat0: -47, lat1: -9,  step: 0.28 },
  { key: 'antark',   ne: 'Antarctica',    pl: 'Antarktyda',          lon0: -180, lon1: 180, lat0: -89, lat1: -61, step: 0.38 },
];

const polysByContinent = {};
for (const f of gj.features) {
  const c = f.properties.CONTINENT;
  if (!c || c === 'Seven seas (open ocean)') continue;
  const add = (coords) => {
    const outer = coords[0];
    let minx = 180, miny = 90, maxx = -180, maxy = -90;
    for (const [x, y] of outer) {
      if (x < minx) minx = x; if (x > maxx) maxx = x;
      if (y < miny) miny = y; if (y > maxy) maxy = y;
    }
    (polysByContinent[c] ||= []).push({ outer, holes: coords.slice(1), bbox: [minx, miny, maxx, maxy] });
  };
  const g = f.geometry;
  if (!g) continue;
  if (g.type === 'Polygon') add(g.coordinates);
  else if (g.type === 'MultiPolygon') g.coordinates.forEach(add);
}

function inRing(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function hit(polys, lon, lat) {
  for (const p of polys) {
    const b = p.bbox;
    if (lon < b[0] || lon > b[2] || lat < b[1] || lat > b[3]) continue;
    if (inRing(p.outer, lon, lat)) {
      let inHole = false;
      for (const h of p.holes) if (inRing(h, lon, lat)) { inHole = true; break; }
      if (!inHole) return true;
    }
  }
  return false;
}

// ---------- 1. globalna chmura punktów (widok kuli) ----------
const allPolys = Object.values(polysByContinent).flat();
const globalPts = [];
{
  const N = 26000;
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const lat = (Math.asin(y) * 180) / Math.PI;
    let lon = ((GA * i * 180) / Math.PI) % 360;
    if (lon > 180) lon -= 360;
    if (!hit(allPolys, lon, lat)) continue;
    const u = Math.round(((lon + 180) / 360) * 4095);
    const v = Math.round(((lat + 90) / 180) * 4095);
    globalPts.push(u >> 4, ((u & 15) << 4) | (v >> 8), v & 255, encodeElev(demSmooth(lon, lat, 0.5)));
  }
}
console.log('punkty globalne:', globalPts.length / 4);

// ---------- 2. siatki kontynentów ----------
// Wiersze o stałym kroku w szerokości; liczba kolumn w wierszu skalowana przez cos(lat),
// żeby odstęp między punktami był mniej więcej stały na powierzchni kuli (a nie zbiegał się przy biegunach).
const meta = [];
const gridChunks = [];
for (const c of CONTINENTS) {
  const polys = polysByContinent[c.ne] || [];
  const rows = Math.round((c.lat1 - c.lat0) / c.step);
  const rowMeta = [];
  const bytes = [];
  let land = 0;
  for (let r = 0; r < rows; r++) {
    const lat = c.lat0 + r * c.step;
    const cosl = Math.max(0.12, Math.cos((lat * Math.PI) / 180));
    const dLon = c.step / cosl;
    const cols = Math.max(1, Math.round((c.lon1 - c.lon0) / dLon));
    rowMeta.push(cols);
    for (let i = 0; i < cols; i++) {
      const lon = c.lon0 + i * dLon;
      const lonN = ((lon + 180) % 360 + 360) % 360 - 180;
      if (!hit(polys, lonN, lat)) { bytes.push(0); continue; }
      bytes.push(encodeElev(demSmooth(lonN, lat, c.step)));
      land++;
    }
  }
  meta.push({
    key: c.key, pl: c.pl, lon0: c.lon0, lon1: c.lon1, lat0: c.lat0, lat1: c.lat1,
    step: c.step, rows, rowMeta, cells: bytes.length, land,
  });
  gridChunks.push(Buffer.from(Uint8Array.from(bytes)));
  console.log(`${c.pl}: ${rows} wierszy, ${bytes.length} komórek, ${land} na lądzie`);
}

// ---------- 3. serializacja ----------
const header = JSON.stringify({
  version: 2,
  globalCount: globalPts.length / 4,
  continents: meta.map((m) => ({
    key: m.key, pl: m.pl, lon0: m.lon0, lon1: m.lon1, lat0: m.lat0, lat1: m.lat1,
    step: m.step, rows: m.rows, cols: m.rowMeta, cells: m.cells,
  })),
});
const headerBuf = Buffer.from(header, 'utf8');
const lenBuf = Buffer.alloc(4);
lenBuf.writeUInt32LE(headerBuf.length, 0);

const blob = Buffer.concat([lenBuf, headerBuf, Buffer.from(Uint8Array.from(globalPts)), ...gridChunks]);
const gz = zlib.gzipSync(blob, { level: 9 });
fs.writeFileSync('terrain.b64.txt', gz.toString('base64'));
console.log(
  'blob:', (blob.length / 1024).toFixed(0), 'KB ->',
  'gzip:', (gz.length / 1024).toFixed(0), 'KB ->',
  'base64:', (gz.toString('base64').length / 1024).toFixed(0), 'KB',
);
