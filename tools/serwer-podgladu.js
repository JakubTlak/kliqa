/**
 * Lokalny podgląd wersji z katalogu deploy/ — odwzorowuje zachowanie hostingu:
 * katalog serwowany przez index.html i strona błędu z prawdziwym kodem 404.
 * Bez tego adresy w trybie „path” i strona 404 nie dają się sprawdzić przed wdrożeniem.
 *
 *   node tools/build.js deploy && node tools/serwer-podgladu.js
 *   → http://localhost:4173
 *
 * Formularz kontaktowy tu nie zadziała: kontakt.php wymaga PHP, a to jest zwykły
 * serwer plików. Na stronie zadziała wtedy zapasowe „otwórz program pocztowy”.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const KATALOG = path.join(__dirname, '..', 'deploy');
const PORT = Number(process.env.PORT) || 4173;

const TYPY = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

if (!fs.existsSync(path.join(KATALOG, 'index.html'))) {
  console.error('Brak deploy/index.html — najpierw: node tools/build.js deploy');
  process.exit(1);
}

http.createServer((req, res) => {
  const adres = decodeURIComponent(req.url.split('?')[0]);
  let plik = path.join(KATALOG, adres);

  // Katalog bez ukośnika: przekierowanie 301, dokładnie jak DirectorySlash na serwerze
  if (fs.existsSync(plik) && fs.statSync(plik).isDirectory() && !adres.endsWith('/')) {
    res.writeHead(301, { Location: adres + '/' });
    return res.end();
  }
  if (adres.endsWith('/')) plik = path.join(plik, 'index.html');

  if (!fs.existsSync(plik) || !fs.statSync(plik).isFile()) {
    res.writeHead(404, { 'Content-Type': TYPY['.html'] });
    return res.end(fs.readFileSync(path.join(KATALOG, '404.html')));
  }
  res.writeHead(200, { 'Content-Type': TYPY[path.extname(plik)] || 'application/octet-stream' });
  fs.createReadStream(plik).pipe(res);
}).listen(PORT, () => {
  console.log('podgląd wersji na hosting: http://localhost:' + PORT);
});
