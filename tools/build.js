/**
 * Buduje serwis z części w katalogu prototyp/.
 *
 *   node tools/build.js preview   -> kliqa-landing.html  (jeden plik, trasy na hashach, formularz przez mailto)
 *   node tools/build.js deploy    -> deploy/             (osobny plik i adres na każdą podstronę, formularz przez kontakt.php)
 *
 * Różnice między wersjami sprowadzają się do czterech znaczników podmienianych w kodzie:
 *   __ASSETS__       definicje zmiennych CSS z logo i ziarnem (data URI albo pliki)
 *   __TERRAIN__      dane terenu wklejone w stronę (tylko podgląd)
 *   __TERRAIN_URL__  adres pliku z danymi terenu (tylko hosting)
 *   __ROUTE_MODE__   'hash' albo 'path'
 *   __MAIL_ENDPOINT__ adres skryptu wysyłającego formularz ('' = tylko mailto)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'prototyp');
const SITE = 'https://kliqa.pl';

const read = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const parts = {
  style1: read('01-style-podstawy.html'),
  style2: read('02-style-sekcje.html'),
  home: read('03-strona-glowna.html'),
  pages: read('04-podstrony.html'),
  script1: read('05-skrypt-globus.html'),
  script2: read('06-skrypt-tresc.html'),
};
const terrain = read('terrain.b64.txt').trim();
const noise = read('noise.b64.txt').trim();
const logo = read('logo.b64.txt').trim();

const mode = process.argv[2] === 'deploy' ? 'deploy' : 'preview';

/** Nagłówek strony z części 01 — w wersji na hosting head budujemy sami. */
function splitHead(style1) {
  const at = style1.indexOf('<style>');
  return { meta: style1.slice(0, at), css: style1.slice(at) };
}

function fill(text, map) {
  return Object.keys(map).reduce((s, k) => s.split(k).join(map[k]), text);
}

/* ------------------------------------------------------------------ PODGLĄD */
if (mode === 'preview') {
  const map = {
    __ASSETS__: `:root{--logo:url("data:image/png;base64,${logo}");--noise:url("data:image/png;base64,${noise}")}`,
    __TERRAIN__: terrain,
    __TERRAIN_URL__: '',
    __ROUTE_MODE__: 'hash',
    __MAIL_ENDPOINT__: '',
  };
  const html = fill(
    [parts.style1, parts.style2, parts.home, parts.pages, parts.script1, parts.script2].join('\n'),
    map
  );
  const out = path.join(ROOT, 'kliqa-landing.html');
  fs.writeFileSync(out, html);
  fs.writeFileSync(path.join(ROOT, 'website', 'public', 'prototype.html'), html);
  console.log('podgląd:', out, (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB');
  if (/__[A-Z_]+__/.test(html)) throw new Error('został niepodmieniony znacznik');
  process.exit(0);
}

/* ------------------------------------------------------------------ HOSTING */
const OUT = path.join(ROOT, 'deploy');

// Tytuły i opisy podstron — to one trafiają do wyników wyszukiwania.
const ROUTES = [
  {
    route: '/', file: 'index.html',
    title: 'Kliqa — zmieniamy kliknięcia w przychód | agencja marketingowa',
    desc: 'Performance marketing w Google, Meta i TikTok, strony internetowe, SEO, automatyzacja procesów, wdrożenia AI i social media. Agencja, która zaczyna od pomiaru, nie od moodboardu.',
  },
  {
    route: '/uslugi', file: 'uslugi/index.html',
    title: 'Usługi — performance, strony, SEO, automatyzacja, AI, social | Kliqa',
    desc: 'Sześć usług opisanych tak, jak je rozliczamy: zakres prac, konkretne rezultaty i wskaźnik. Przy każdej działający model do poklikania.',
  },
  {
    route: '/o-nas', file: 'o-nas/index.html',
    title: 'O nas — agencja, która zaczyna od arkusza | Kliqa',
    desc: 'Jak pracujemy: cykle dwutygodniowe, hipoteza zamiast opinii, wszystkie konta po stronie klienta. Zasady, granice i stack technologiczny agencji Kliqa.',
  },
  {
    route: '/edukacja', file: 'edukacja/index.html',
    title: 'Edukacja — dziesięć raportów, na których pracujemy | Kliqa',
    desc: 'Opracowania raportów o performance marketingu, SEO, AI i pomiarze — z konkretnymi liczbami, wnioskami i linkiem do źródła.',
  },
  {
    route: '/kontakt', file: 'kontakt/index.html',
    title: 'Kontakt — bezpłatny audyt konta w 48 godzin | Kliqa',
    desc: 'Napisz na biuro@kliqa.pl albo wypełnij formularz. Odpowiadamy w jeden dzień roboczy, a przegląd konta i pomiaru robimy przed jakąkolwiek umową.',
  },
];

// Materiały edukacyjne wyciągane wprost ze źródła, żeby lista nie rozjechała się z treścią.
const eduRe = /slug:'([^']+)',\s*cat:'[^']*',\s*badge:'([^']*)',\s*year:'([^']*)',\s*\n\s*title:'([^']+)',\s*source:'([^']+)',[\s\S]*?lead:'([^']+)'/g;
let m, eduCount = 0;
while ((m = eduRe.exec(parts.script2)) !== null) {
  eduCount++;
  ROUTES.push({
    route: '/edukacja/' + m[1],
    file: 'edukacja/' + m[1] + '/index.html',
    title: m[4] + ' — omówienie | Kliqa',
    desc: m[6].length > 300 ? m[6].slice(0, 297) + '…' : m[6],
  });
}
if (eduCount !== 10) throw new Error('spodziewano się 10 materiałów edukacyjnych, znaleziono ' + eduCount);

const { css } = splitHead(parts.style1);
const body = [parts.home, parts.pages].join('\n');
const scripts = [parts.script1, parts.script2].join('\n');

const map = {
  __ASSETS__: ':root{--logo:url("/assets/logo-mask.png");--noise:url("/assets/grain.png")}',
  __TERRAIN__: '',
  __TERRAIN_URL__: '/assets/terrain.b64.txt',
  __ROUTE_MODE__: 'path',
  __MAIL_ENDPOINT__: '/kontakt.php',
};
const cssOut = fill(css, map);
const bodyOut = fill(body, map);
const scriptsOut = fill(scripts, map);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Adres kanoniczny z ukośnikiem na końcu — dokładnie taki, jaki serwuje hosting. */
function pageUrl(route) {
  return SITE + (route === '/' ? '/' : route + '/');
}

function page({ route, title, desc }) {
  const url = pageUrl(route);
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#060606">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:locale" content="pl_PL">
<meta property="og:site_name" content="Kliqa">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/favicon-64.png" sizes="64x64" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="fetch" href="/assets/terrain.b64.txt" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;1,8..60,300&display=swap">
${route === '/' ? organizationJsonLd() : ''}${cssOut}
${fill(parts.style2, map)}
</head>
<body>
${bodyOut}
${scriptsOut}
</body>
</html>
`;
}

function organizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Kliqa',
    url: SITE,
    email: 'biuro@kliqa.pl',
    image: SITE + '/assets/og-image.png',
    description:
      'Agencja marketingowa: performance marketing w Google, Meta i TikTok, strony internetowe, SEO, automatyzacja procesów, wdrożenia AI i social media.',
    areaServed: 'PL',
    knowsLanguage: ['pl'],
    serviceType: [
      'Performance marketing', 'Strony internetowe', 'SEO',
      'Automatyzacja procesów marketingowych', 'Wdrożenia AI', 'Social media',
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

// --- zapis stron ---
fs.rmSync(path.join(OUT), { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
let total = 0;
for (const r of ROUTES) {
  const dest = path.join(OUT, r.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const html = page(r);
  if (/__[A-Z_]+__/.test(html)) throw new Error('został niepodmieniony znacznik w ' + r.file);
  fs.writeFileSync(dest, html);
  total += Buffer.byteLength(html);
}

// --- zasoby ---
const assets = path.join(OUT, 'assets');
fs.mkdirSync(assets, { recursive: true });
fs.writeFileSync(path.join(assets, 'terrain.b64.txt'), terrain);
fs.writeFileSync(path.join(assets, 'grain.png'), Buffer.from(noise, 'base64'));
fs.writeFileSync(path.join(assets, 'logo-mask.png'), Buffer.from(logo, 'base64'));
for (const f of ['favicon-32.png', 'favicon-64.png', 'apple-touch-icon.png', 'og-image.png']) {
  const src = path.join(SRC, 'assets', f);
  if (!fs.existsSync(src)) throw new Error('brak ikony ' + f + ' — uruchom: node tools/deploy-assets.js');
  fs.copyFileSync(src, path.join(assets, f));
}

// --- pliki towarzyszące ---
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ROUTES.map((r) => {
    const url = pageUrl(r.route);
    const prio = r.route === '/' ? '1.0' : (r.route.indexOf('/edukacja/') === 0 ? '0.6' : '0.8');
    return `  <url><loc>${url}</loc><lastmod>${today}</lastmod><priority>${prio}</priority></url>`;
  }).join('\n') +
  '\n</urlset>\n');

// Uwaga: w tym samym katalogu stoi WordPress. Ten plik nadpisuje ewentualny robots.txt
// sklepu — jeśli WordPress miał własne reguły, trzeba je tu dopisać.
fs.writeFileSync(path.join(OUT, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

for (const f of ['.htaccess', 'kontakt.php']) {
  fs.copyFileSync(path.join(ROOT, 'tools', 'hosting', f), path.join(OUT, f));
}

console.log('hosting:', OUT);
console.log('  stron:', ROUTES.length, '· HTML łącznie', (total / 1024).toFixed(0) + ' KB',
  '· jedna strona ~' + (total / ROUTES.length / 1024).toFixed(0) + ' KB');
console.log('  teren (wspólny, cache):', (Buffer.byteLength(terrain) / 1024).toFixed(0) + ' KB');
