/**
 * Buduje serwis z części w katalogu prototyp/.
 *
 *   node tools/build.js preview   -> kliqa-landing.html  (jeden plik, trasy na hashach, formularz przez mailto)
 *   node tools/build.js deploy    -> deploy/             (osobny plik i adres na każdą podstronę, formularz przez kontakt.php)
 *
 * Różnice między wersjami sprowadzają się do znaczników podmienianych w kodzie:
 *   __ASSETS__        definicje zmiennych CSS z logo i ziarnem (data URI albo pliki)
 *   __FONTS__         reguły @font-face (kroje wklejone w stronę albo pliki .woff2)
 *   __ZGODY_HEAD__    domyślny stan Consent Mode v2 (tylko podgląd — w wersji na hosting
 *                     nagłówek budujemy tutaj i wstawiamy go wprost)
 *   __TERRAIN__       dane terenu wklejone w stronę (tylko podgląd)
 *   __TERRAIN_URL__   adres pliku z danymi terenu (tylko hosting)
 *   __ROUTE_MODE__    'hash' albo 'path'
 *   __MAIL_ENDPOINT__ adres skryptu wysyłającego formularz ('' = tylko mailto)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
  script3: read('07-skrypt-zgody.html'),
};
const terrain = read('terrain.b64.txt').trim();
const noise = read('noise.b64.txt').trim();
const logo = read('logo.b64.txt').trim();

const mode = process.argv[2] === 'deploy' ? 'deploy' : 'preview';

/* ------------------------------------------------------------------- KROJE */
/* Kroje pisma trzymamy u siebie, w wariantach zmiennych ograniczonych do znaków, które
   w serwisie faktycznie występują (łacinka z polskimi znakami, interpunkcja, strzałki).
   Efekt: 191 KB zamiast ~660 KB pełnych subsetów, zero zapytań do Google i zero
   przekazywania adresu IP odwiedzającego poza nasz serwer. */
const FONTY = [
  { plik: 'inter-tight.woff2',           rodzina: 'Inter Tight',    styl: 'normal', waga: '400 600', wstepnie: true },
  { plik: 'source-serif-4.woff2',        rodzina: 'Source Serif 4', styl: 'normal', waga: '300',     wstepnie: true },
  { plik: 'jetbrains-mono.woff2',        rodzina: 'JetBrains Mono', styl: 'normal', waga: '400 500', wstepnie: false },
  { plik: 'source-serif-4-italic.woff2', rodzina: 'Source Serif 4', styl: 'italic', waga: '300',     wstepnie: false },
];
const FONT_DIR = path.join(SRC, 'assets', 'fonts');
for (const f of FONTY) {
  const p = path.join(FONT_DIR, f.plik);
  if (!fs.existsSync(p)) throw new Error('brak kroju ' + f.plik + ' w prototyp/assets/fonts/');
  f.bajty = fs.readFileSync(p);
}
function fontFace(zrodlo) {
  return FONTY.map((f) =>
    `@font-face{font-family:'${f.rodzina}';font-style:${f.styl};font-weight:${f.waga};` +
    `font-display:swap;src:url(${zrodlo(f)}) format('woff2')}`
  ).join('\n');
}

/* ------------------------------------------------------------------- ZGODY */
/* Consent Mode v2 musi znać stan przed jakimkolwiek tagiem pomiarowym, więc domyślną
   odmowę ustawiamy w nagłówku, a nie w module zgód na końcu strony. Zapisaną decyzję
   odczytujemy tu ponownie, żeby po powrocie na stronę pomiar nie czekał na moduł. */
const ZGODY_HEAD = `<script>
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent','default',{
    ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
    analytics_storage:'denied', functionality_storage:'granted', security_storage:'granted',
    wait_for_update: 500
  });
  try{
    var s = JSON.parse(localStorage.getItem('kliqa-zgody') || 'null');
    if(s && s.v === 1) gtag('consent','update',{
      analytics_storage:  s.statystyka ? 'granted':'denied',
      ad_storage:         s.marketing  ? 'granted':'denied',
      ad_user_data:       s.marketing  ? 'granted':'denied',
      ad_personalization: s.marketing  ? 'granted':'denied'
    });
  }catch(e){}
})();
</script>`;

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
    __FONTS__: fontFace((f) => `"data:font/woff2;base64,${f.bajty.toString('base64')}"`),
    __ZGODY_HEAD__: ZGODY_HEAD,
    __TERRAIN__: terrain,
    __TERRAIN_URL__: '',
    __ROUTE_MODE__: 'hash',
    __MAIL_ENDPOINT__: '',
  };
  const html = fill(
    [parts.style1, parts.style2, parts.home, parts.pages, parts.script1, parts.script2, parts.script3].join('\n'),
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

/* Tytuły i opisy podstron — to one trafiają do wyników wyszukiwania. Tytuł do 60 znaków,
   opis do 160: dłuższe Google i tak ucina w połowie zdania. Każdy opis mówi, co konkretnie
   jest na stronie, i zawiera jeden powód, żeby w nią kliknąć. */
const ROUTES = [
  {
    route: '/', file: 'index.html', priorytet: '1.0',
    title: 'Kliqa — agencja marketingowa oparta na danych',
    desc: 'Performance marketing, strony i sklepy, SEO, automatyzacja i wdrożenia AI. Rozliczamy się z CAC i ROAS, nie z liczby slajdów. Audyt konta w 48 godzin.',
  },
  {
    route: '/uslugi', file: 'uslugi/index.html', priorytet: '0.9',
    title: 'Usługi — performance, strony, SEO, AI | Kliqa',
    desc: 'Sześć usług, przy każdej zakres prac, konkretne rezultaty i wskaźnik rozliczenia: performance marketing, strony i sklepy, SEO, automatyzacja, AI, social media.',
  },
  {
    route: '/o-nas', file: 'o-nas/index.html', priorytet: '0.7',
    title: 'O nas — jak pracujemy i czego nie robimy | Kliqa',
    desc: 'Cykle dwutygodniowe, hipoteza zamiast opinii, wszystkie konta po stronie klienta. Zasady, granice i stack technologiczny agencji Kliqa.',
  },
  {
    route: '/edukacja', file: 'edukacja/index.html', priorytet: '0.8',
    title: 'Edukacja — dziesięć raportów w opracowaniu | Kliqa',
    desc: 'Opracowania raportów o performance marketingu, SEO, AI i pomiarze: kluczowe liczby, wnioski do wdrożenia i odnośnik do oryginału. Bez rejestracji.',
  },
  {
    route: '/kontakt', file: 'kontakt/index.html', priorytet: '0.9',
    title: 'Kontakt — bezpłatny audyt konta w 48 h | Kliqa',
    desc: 'Napisz na biuro@kliqa.pl albo wypełnij formularz. Odpowiadamy w jeden dzień roboczy, a przegląd konta i pomiaru robimy przed jakąkolwiek umową.',
  },
  {
    route: '/polityka-prywatnosci', file: 'polityka-prywatnosci/index.html', priorytet: '0.3',
    title: 'Polityka prywatności | Kliqa',
    desc: 'Jakie dane zbieramy przez formularz, na jakiej podstawie i jak długo je trzymamy. Kategorie zgód, prawa z RODO i kontakt w sprawie danych.',
  },
  {
    route: '/regulamin', file: 'regulamin/index.html', priorytet: '0.3',
    title: 'Regulamin serwisu | Kliqa',
    desc: 'Zasady korzystania z kliqa.pl: zakres usług świadczonych drogą elektroniczną, warunki techniczne, reklamacje w 14 dni i prawa własności intelektualnej.',
  },
];

// Materiały edukacyjne wyciągane wprost ze źródła, żeby lista nie rozjechała się z treścią.
const eduRe = /slug:'([^']+)',\s*cat:'[^']*',\s*badge:'([^']*)',\s*year:'([^']*)',\s*\n\s*title:'([^']+)',\s*source:'([^']+)',[\s\S]*?lead:'([^']+)'/g;
/** Przycięcie do pełnego słowa — opis urwany w połowie wyrazu wygląda w wynikach na błąd. */
function doDlugosci(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const spacja = cut.lastIndexOf(' ');
  return (spacja > max * 0.6 ? cut.slice(0, spacja) : cut).replace(/[\s,.;:—-]+$/, '') + '…';
}
let m, eduCount = 0;
while ((m = eduRe.exec(parts.script2)) !== null) {
  eduCount++;
  ROUTES.push({
    route: '/edukacja/' + m[1],
    file: 'edukacja/' + m[1] + '/index.html',
    priorytet: '0.6',
    title: doDlugosci(m[4], 44) + ' — omówienie | Kliqa',
    desc: doDlugosci(m[6], 158),
  });
}
if (eduCount !== 10) throw new Error('spodziewano się 10 materiałów edukacyjnych, znaleziono ' + eduCount);

// Kontrola długości przy budowaniu: przydługi opis nie ma prawa dojechać na produkcję.
for (const r of ROUTES) {
  if (r.title.length > 62) throw new Error(`tytuł ${r.route} ma ${r.title.length} znaków (limit 62)`);
  if (r.desc.length > 160) throw new Error(`opis ${r.route} ma ${r.desc.length} znaków (limit 160)`);
  if (r.desc.length < 70) throw new Error(`opis ${r.route} ma tylko ${r.desc.length} znaków — za krótki`);
}

const { css } = splitHead(parts.style1);
const body = [parts.home, parts.pages].join('\n');
const scripts = [parts.script1, parts.script2, parts.script3].join('\n');

const map = {
  __ASSETS__: ':root{--logo:url("/assets/logo-mask.png");--noise:url("/assets/grain.png")}',
  __FONTS__: fontFace((f) => '/assets/fonts/' + f.plik),
  __ZGODY_HEAD__: '',
  __TERRAIN__: '',
  __TERRAIN_URL__: '/assets/terrain.b64.txt',
  __ROUTE_MODE__: 'path',
  __MAIL_ENDPOINT__: '/kontakt.php',
};
const cssOut = fill(css, map);
const bodyOut = fill(body, map);
const style2Out = fill(parts.style2, map);

/* Arkusz zostaje w stronie: 9 KB po kompresji, za to pierwszy render nie czeka na
   dodatkowe zapytanie. Skrypty wędrują do wspólnego pliku — są identyczne na każdej
   z osiemnastu podstron, więc wklejone w każdą kosztowały 95 KB do pobrania i
   skompilowania przy każdym wejściu z wyszukiwarki. Jako osobny plik pobierają się raz
   i wracają z pamięci podręcznej razem z gotowym kodem bajtowym. Atrybut defer
   zachowuje kolejność wykonania i odpala kod po zbudowaniu drzewa — dokładnie tak,
   jak działało to wcześniej na końcu body. */
const scriptsOut = fill(scripts, map)
  .replace(/<script>\n?/g, '')
  .replace(/<\/script>\n?/g, '\n');
const skryptHash = crypto.createHash('sha1').update(scriptsOut).digest('hex').slice(0, 8);
const SKRYPT_URL = '/assets/kliqa.js?v=' + skryptHash;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Adres kanoniczny z ukośnikiem na końcu — dokładnie taki, jaki serwuje hosting. */
function pageUrl(route) {
  return SITE + (route === '/' ? '/' : route + '/');
}

/* Wczytanie kroju blokuje pierwszy render tekstu, więc dwa najważniejsze pobieramy
   równolegle z arkuszem. Atrybut crossorigin jest przy krojach obowiązkowy — bez niego
   przeglądarka pobiera plik drugi raz. */
const PRELOAD_FONTY = FONTY.filter((f) => f.wstepnie)
  .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/${f.plik}" crossorigin>`)
  .join('\n');

function page({ route, title, desc, robots, trasa }) {
  const url = pageUrl(route);
  const indeks = robots || 'index, follow, max-image-preview:large';
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#060606">
<meta name="robots" content="${indeks}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pl_PL">
<meta property="og:site_name" content="Kliqa">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Znak Kliqa na ciemnym tle">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/favicon-64.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${PRELOAD_FONTY}
${route === '/' ? '<link rel="preload" as="fetch" href="/assets/terrain.b64.txt">\n' : ''}${ZGODY_HEAD}
${route === '/' ? organizationJsonLd() : ''}${cssOut}
${style2Out}
</head>
<body${trasa ? ` data-trasa="${trasa}"` : ''}>
${bodyOut}
<script src="${SKRYPT_URL}" defer></script>
</body>
</html>
`;
}

function organizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': SITE + '/#organizacja',
        name: 'Kliqa',
        url: SITE,
        email: 'biuro@kliqa.pl',
        image: SITE + '/assets/og-image.png',
        logo: SITE + '/assets/icon-512.png',
        description:
          'Agencja marketingowa: performance marketing w Google, Meta i TikTok, strony internetowe, SEO, automatyzacja procesów, wdrożenia AI i social media.',
        areaServed: 'PL',
        knowsLanguage: ['pl'],
        serviceType: [
          'Performance marketing', 'Strony internetowe', 'SEO',
          'Automatyzacja procesów marketingowych', 'Wdrożenia AI', 'Social media',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': SITE + '/#serwis',
        url: SITE,
        name: 'Kliqa',
        inLanguage: 'pl-PL',
        publisher: { '@id': SITE + '/#organizacja' },
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

// --- zapis stron ---
fs.rmSync(path.join(OUT), { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
let total = 0;
function zapisz(plik, dane) {
  const dest = path.join(OUT, plik);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (/__[A-Z_]+__/.test(dane)) throw new Error('został niepodmieniony znacznik w ' + plik);
  fs.writeFileSync(dest, dane);
  total += Buffer.byteLength(dane);
}
for (const r of ROUTES) zapisz(r.file, page(r));

/* Strona błędu. Serwer podstawia ten plik pod dowolny nieistniejący adres, więc ścieżka
   w pasku nie mówi routerowi, co pokazać — rozstrzyga to atrybut data-trasa na <body>.
   Adres kanoniczny wskazuje stronę główną, a robots wyklucza indeksowanie. */
zapisz('404.html', page({
  route: '/',
  title: 'Nie znaleziono strony (404) | Kliqa',
  desc: 'Pod tym adresem nic nie ma. Sprawdź adres albo przejdź do usług, materiałów edukacyjnych lub kontaktu — wszystko jest o jedno kliknięcie stąd.',
  robots: 'noindex, follow',
  trasa: '/404',
}));

// --- zasoby ---
const assets = path.join(OUT, 'assets');
fs.mkdirSync(path.join(assets, 'fonts'), { recursive: true });
fs.writeFileSync(path.join(assets, 'terrain.b64.txt'), terrain);
fs.writeFileSync(path.join(assets, 'grain.png'), Buffer.from(noise, 'base64'));
fs.writeFileSync(path.join(assets, 'logo-mask.png'), Buffer.from(logo, 'base64'));
for (const f of FONTY) fs.writeFileSync(path.join(assets, 'fonts', f.plik), f.bajty);
fs.writeFileSync(path.join(assets, 'kliqa.js'), scriptsOut);
const IKONY = ['favicon-32.png', 'favicon-64.png', 'apple-touch-icon.png', 'og-image.png', 'icon-192.png', 'icon-512.png'];
for (const f of IKONY) {
  const src = path.join(SRC, 'assets', f);
  if (!fs.existsSync(src)) throw new Error('brak ikony ' + f + ' — uruchom: node tools/deploy-assets.js');
  fs.copyFileSync(src, path.join(assets, f));
}
// /favicon.ico przeglądarki pytają wprost, bez zaglądania w nagłówek strony
fs.copyFileSync(path.join(SRC, 'assets', 'favicon.ico'), path.join(OUT, 'favicon.ico'));

// --- pliki towarzyszące ---
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ROUTES.map((r) =>
    `  <url><loc>${pageUrl(r.route)}</loc><lastmod>${today}</lastmod><changefreq>${r.priorytet >= '0.8' ? 'weekly' : 'monthly'}</changefreq><priority>${r.priorytet}</priority></url>`
  ).join('\n') +
  '\n</urlset>\n');

/* W tym samym katalogu stoi stary WordPress. Ten plik nadpisuje jego robots.txt, więc
   zamykamy roboty w naszym serwisie i odcinamy je od resztek starej instalacji —
   pliki, które fizycznie istnieją (np. wgrane obrazy), serwer wciąż by im podał. */
fs.writeFileSync(path.join(OUT, 'robots.txt'),
  `User-agent: *
Allow: /

# resztki starej instalacji WordPressa w tym samym katalogu
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /wp-content/
Disallow: /wp-login.php
Disallow: /xmlrpc.php
Disallow: /kontakt.php

Sitemap: ${SITE}/sitemap.xml
`);

fs.writeFileSync(path.join(OUT, 'site.webmanifest'), JSON.stringify({
  name: 'Kliqa',
  short_name: 'Kliqa',
  lang: 'pl',
  start_url: '/',
  display: 'browser',
  background_color: '#060606',
  theme_color: '#060606',
  icons: [
    { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n');

for (const f of ['.htaccess', 'kontakt.php']) {
  fs.copyFileSync(path.join(ROOT, 'tools', 'hosting', f), path.join(OUT, f));
}

const wagaFontow = FONTY.reduce((s, f) => s + f.bajty.length, 0);
console.log('hosting:', OUT);
console.log('  stron:', ROUTES.length, '(+ strona błędu) · HTML łącznie', (total / 1024).toFixed(0) + ' KB',
  '· jedna strona ~' + (total / (ROUTES.length + 1) / 1024).toFixed(0) + ' KB');
console.log('  skrypt (wspólny, cache):', (Buffer.byteLength(scriptsOut) / 1024).toFixed(0) + ' KB ·', SKRYPT_URL);
console.log('  kroje (wspólne, cache):', (wagaFontow / 1024).toFixed(0) + ' KB w', FONTY.length, 'plikach');
console.log('  teren (wspólny, cache):', (Buffer.byteLength(terrain) / 1024).toFixed(0) + ' KB');
