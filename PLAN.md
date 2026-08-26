# Kliqa — plan działania i stack technologiczny

Dokument roboczy zespołu. Opisuje, co już stoi, czym to zbudowaliśmy i w jakiej kolejności
dowozimy resztę. Aktualizowany razem z kodem — jeśli coś tu nie zgadza się z repo, wygrywa repo.

---

## 1. Architektura serwisu

Kliqa to **aplikacja wielostronicowa**, nie one-page. Podział jest sztywny:

| Strona | Zawartość |
|---|---|
| `/` — strona główna | Slogan + interaktywny globus, przejście scrollem do drugiego sloganu z CTA „Porozmawiajmy”, segmenty „czym się zajmujemy”, droga współpracy, formularz kontaktowy |
| `/uslugi` | Pełne opisy sześciu usług: zakres prac, rezultaty, wskaźnik rozliczenia |
| `/o-nas` | Historia agencji, zasady, granice („czego nie robimy”), stack |
| `/edukacja` | Lista dziesięciu opracowań z filtrami kategorii |
| `/edukacja/{slug}` | Osobna podstrona każdego materiału: omówienie, kluczowe liczby, wnioski, link do oryginału |
| `/kontakt` | Dedykowana podstrona kontaktu: formularz, dane, lista dostępów do audytu, trzy kroki startu |

Strona główna ma pozostać krótka i prowadzić jednym ciągiem do kontaktu. Nowe obszary treści
(case studies, blog, kariera) dostają **własne podstrony** — nie doklejamy ich do landingu.
Przycisk „Kontakt” w nawigacji prowadzi na podstronę `/kontakt`, nie do sekcji na landingu.

---

## 2. Co już jest

| Element | Status | Gdzie |
|---|---|---|
| Prototyp całej aplikacji (jeden plik HTML, router na hashach, wszystkie podstrony) | gotowy | `kliqa-landing.html`, kopia w `website/public/prototype.html` |
| Publikacja podglądowa (Artifact) | gotowa | link w historii rozmowy / galeria artefaktów |
| Globus z terenem: 7 kontynentów, siatka topograficzna, losowanie przy każdym zjeździe | gotowy w prototypie | `kliqa-landing.html` |
| Projekt Next.js: cztery trasy, tokeny, fonty, treść, ziarno tła, znak marki | gotowy do rozwoju | `website/` |
| Formularz kontaktowy na produkcji (PHP na hostingu) | działa, potwierdzone próbną wysyłką | `tools/hosting/kontakt.php` |
| Certyfikat SSL dla kliqa.pl | włączony | DirectAdmin / Let's Encrypt |
| Formularz w projekcie Next.js (Resend) | gotowy, czeka na klucz API | `website/src/app/api/contact/route.ts` |
| Dane terenu (globalna chmura + siatki kontynentów) | gotowe | `website/public/terrain.b64.txt` |

Prototyp jest źródłem prawdy dla wyglądu i interakcji. Projekt Next.js jest źródłem prawdy dla
kodu produkcyjnego. Etap 2 domyka różnicę między nimi.

---

## 3. Stack — co wybraliśmy i dlaczego

**Zainstalowane w `website/` (Node 24, npm 11):**

| Technologia | Wersja | Po co |
|---|---|---|
| Next.js (App Router, Turbopack) | 16.3 | Statyczne renderowanie stron marketingowych + endpoint serwerowy do formularza w jednym projekcie. |
| React | 19.2 | Wymóg Next.js 16. |
| TypeScript | 5.x | Treść w typowanych plikach — literówka w danych wywala się na buildzie, nie na produkcji. |
| Tailwind CSS | 4.x | Tokeny designu wchodzą do `@theme` i stają się klasami (`bg-carbon`, `text-lime`). |
| motion (Framer Motion) | 13.x | Animacje wejścia sekcji i choreografia hero. |
| lenis | 1.3 | Wygładzony scroll — bez niego przejścia sterowane przewijaniem szarpią na Windowsie. |
| resend | 6.x | Wysyłka maila z formularza. |
| zod | 4.x | Walidacja po stronie serwera. |

Do dołożenia później: `next-sitemap` (lub natywne `sitemap.ts`), `@next/third-parties` (GTM),
MDX albo lekki CMS pod rozbudowę Edukacji, `@vercel/analytics` do Core Web Vitals z realnego ruchu.

**Hosting:** Vercel. Domena `kliqa.pl` z rekordami do Vercela, poczta osobno — patrz punkt 6.

---

## 4. Plan działania

### Etap 1 — fundament (zrobione)
Prototyp aplikacji z podziałem na podstrony, system designu, treść wszystkich sekcji, globus
z terenem, projekt Next.js z czterema trasami, endpoint formularza.

### Etap 2 — port prototypu do komponentów (3–4 dni robocze)
1. **Globus z terenem** jako komponent React: wczytanie `terrain.b64.txt`, rozpakowanie przez
   `DecompressionStream`, rysowanie w Canvas 2D, zbliżenie do losowego kontynentu sterowane scrollem.
   Logika jest gotowa w prototypie — chodzi o przeniesienie jej do `src/components/Globe.tsx`.
2. **Choreografia hero**: sekcja ~360vh, scena `sticky`, jeden handler scrolla ustawiający zmienne CSS
   (`--s1o`, `--s2o`, `--bgo`, `--mq`) i parametry kamery.
3. **Droga współpracy na scrollu**: pionowy zygzak z kropek rysowany postępem przewijania, karty naprzemiennie po obu stronach, wersja jednokolumnowa poniżej 900 px.
4. Pasek z hasłami marketingowymi (marquee), karuzela klientów, sześć widgetów w usługach i podstrony materiałów edukacyjnych.
5. Bezwzględnie: `prefers-reduced-motion` wyłącza wszystkie powyższe i pokazuje treść statycznie.

### Etap 3 — pomiar i zgody (1–2 dni)
1. Baner zgód (CMP) zgodny z Consent Mode v2 — bez tego tracimy 15–40% mierzalnych konwersji w EOG.
2. GTM + GA4, zdarzenia: `form_start`, `form_submit`, `globe_click`, `service_view`, `resource_click`.
3. Wersja serwerowa GTM (subdomena `sgtm.kliqa.pl`).
4. Dashboard w Looker Studio: źródła leadów, koszt kontaktu, ścieżki wejścia.

### Etap 4 — SEO i treść (ciągłe)
1. `sitemap.ts`, `robots.ts`, dane strukturalne `Organization` + `ProfessionalService` + `FAQPage`.
2. Rozbicie `/uslugi` na osobne podstrony usługowe, gdy treść urośnie — jedna strona = jedna intencja zakupowa.
3. Edukacja jako blog z własnymi analizami — to ona buduje cytowalność w odpowiedziach AI.
4. Wersja EN przy wejściu na rynki zagraniczne (`next-intl`, `hreflang`).

### Etap 5 — start (1 dzień)
Podmiana logotypów klientów na realne (za zgodą), dane rejestrowe w stopce, polityka prywatności,
test formularza na produkcji, Lighthouse ≥ 95 na mobile, wpięcie Search Console.

---

## 5. Globus i teren

Hero opiera się na jednym elemencie: kuli z punktów, która przy przewijaniu zbliża się do
**losowo wybranego kontynentu** (za każdym zjazdem innego) i pokazuje jego rzeźbę terenu.

**Skąd dane.** Kafle wysokościowe „terrarium” z AWS Open Data (zoom 4, 256 kafli PNG) sklejone
w globalny raster 4096×4096 w odwzorowaniu Web Mercator. Dekoder PNG napisany ręcznie na `zlib`,
bez zewnętrznych bibliotek. Wysokość: `(R * 256 + G + B / 256) - 32768`.

**Co z tego powstaje.**
- Globalna chmura ~7 400 punktów lądu do widoku kuli (siatka Fibonacciego + test punkt-w-wielokącie
  na granicach z Natural Earth 50m).
- Siedem siatek kontynentów (~83 000 punktów łącznie): wiersze o stałym kroku w szerokości,
  liczba kolumn skalowana przez `cos(lat)`, żeby odstęp punktów był stały na powierzchni kuli.
  Każdy punkt to jeden bajt wysokości (0 = poza lądem).
- Całość: 230 KB surowo → 103 KB po gzipie → 138 KB w base64, rozpakowywane w przeglądarce
  przez `DecompressionStream`. Bez tego API strona pokazuje samą kulę bez terenu i działa dalej.

**Satelity.** Wokół kuli krąży osiemnaście satelitów na własnych orbitach (promień, nachylenie, węzeł,
tempo), część z nich ciągnie wiązkę do powierzchni — to wypełnia kadr przed scrollem i tłumaczy motyw
zbierania danych. Przy zbliżeniu satelity odlatują na zewnątrz i gasną, żeby nie zaśmiecać widoku terenu.

**Uwaga na kolejność warstw.** Warstwa tła sceny (`.stage-bg`) musi leżeć POD płótnem globusa.
W wersji 2 miała nieprzezroczysty gradient nad płótnem i przy pełnym zbliżeniu zasłaniała cały teren —
kontynent był rysowany, ale niewidoczny. Kolejność malowania: tło → płótno → winieta → treść.

**Jak to wygląda.** Punkty są wypychane promieniowo proporcjonalnie do wysokości (przewyższenie 2,6%),
jasność i wielkość rosną z wysokością, a punkty w pasmach co 400 m dostają dodatkową jasność —
stąd efekt warstwic. Kadr dla każdego kontynentu liczony jest z 96. percentyla promienia kątowego
od środka masy lądu; bez tego Antarktyda i Oceania (przecięcie 180. południka) kadrują się źle.

**Antarktyda.** Web Mercator kończy się na 85° szerokości, więc wnętrze kontynentu bierzemy
z ostatniego dostępnego równoleżnika — to płaskowyż o w miarę stałej wysokości, więc uproszczenie
jest wizualnie uczciwe.

**Regeneracja:** pobierz kafle skryptem `fetch-dem.js`, uruchom `build-terrain.js` ze zmienionym
krokiem siatki (`step` per kontynent), podmień `terrain.b64.txt`.

---

## 5a. Widgety w usługach

Każda z sześciu usług ma na podstronie `/uslugi` własny model do poklikania — pokazuje sposób myślenia,
nie tylko listę zadań. Wszystkie liczą się w przeglądarce, bez API, i są oznaczone etykietą „symulacja”:

| Usługa | Widget | Co pokazuje |
|---|---|---|
| Performance | Alokacja budżetu | Malejący zwrot z każdej kolejnej złotówki w kanale — 100% budżetu w jeden kanał obniża wynik |
| Strony i sklepy | Core Web Vitals | Jak poszczególne decyzje techniczne przesuwają LCP, INP, CLS i konwersję |
| SEO | Wyniki wyszukiwania | Ten sam SERP z odpowiedzią AI i bez — spadek klikalności pierwszej pozycji |
| Automatyzacja | Scenariusz leada | Sześć kroków obiegu i różnica między czasem ręcznym a automatycznym |
| Wdrożenia AI | Generator opisów | Wejście, wyjście i koszt na 1000 SKU — składanie offline, bez modelu |
| Social media | Test hooków | Zatrzymanie kciuka i różnorodność wariantów w jednym zestawie |

## 5b. Wdrożenie na kliqa.pl

Serwis jedzie na hostingu SeoHost (DirectAdmin) jako **statyczne pliki**: `node tools/build.js deploy`
generuje katalog `deploy/` z piętnastoma podstronami, z których każda ma własny adres
(`kliqa.pl/uslugi`, `kliqa.pl/edukacja/consent-mode-v2`), własny tytuł, opis i canonical —
dzięki temu Google indeksuje je osobno. Nawigacja wewnątrz serwisu idzie przez History API,
więc przechodzenie między podstronami nie przeładowuje strony.

Formularz obsługuje `kontakt.php` na tym samym serwerze (funkcja `mail()`, pułapka na boty,
limit zgłoszeń na IP). Gdy poczta odmówi, strona przechodzi na tryb mailto — kontakt nie znika.

Kolejne wdrożenia robi workflow GitHub Actions po pushu na `main`; dane FTP siedzą w sekretach
repozytorium. Instrukcja pierwszego wgrania, SSL i skrzynki nadawczej: README.md.

## 6. Poczta i formularz

Formularz wysyła `POST /api/contact`, serwer waliduje dane (zod) i wysyła maila przez Resend na
`biuro@kliqa.pl` z `replyTo` ustawionym na adres nadawcy.

Do uruchomienia (`website/.env.local`, wzór w `.env.example`):
1. Konto w resend.com i domena `kliqa.pl` z potwierdzonymi rekordami SPF i DKIM.
2. `RESEND_API_KEY`.
3. `CONTACT_FROM` na zweryfikowanej domenie (np. `formularz@kliqa.pl`).

Bez klucza endpoint zwraca czytelny błąd i podpowiada adres mailowy — strona nie „udaje”, że wysłała
wiadomość. W prototypie HTML (bez serwera) formularz składa gotową treść i otwiera program pocztowy,
z kopiowaniem treści jako wyjściem awaryjnym.

Alternatywy: Postmark (dostarczalność), AWS SES (koszt przy dużym wolumenie), Formspree (bez backendu).

---

## 7. System designu

Źródło: `materiały/DESIGN.md` + `tokens.json` / `variables.css`. Tokeny żyją w
`website/src/app/globals.css` w bloku `@theme`.

Zasady, których nie łamiemy:
- **Jeden kolor chromatyczny.** `#c5ff4a` tylko jako: wypełniony CTA, świecąca ramka, jedno kursywne
  słowo w nagłówku, pasek z hasłami. Nigdy w tekście ciągłym.
- **Waga 300 w nagłówkach.** PT Serif z DESIGN.md nie istnieje w wadze 300 (Google daje 400 i 700),
  więc używamy **Source Serif 4** — podstawienia wskazanego wprost w DESIGN.md.
- **Głębia z warstw, nie z cieni.** `#060606` → `#1f1f1f` → `#252525` → `#313131` + włosowa ramka.
  Jedyny cień w systemie to poświata pod CTA.
- **Ostre narożniki.** Karty 0 px, przyciski 4 px, tagi 2 px.
- **Tło nigdy nie jest płaskie.** Ciemna baza, dwie bardzo słabe plamy światła i ziarno
  (`public/grain.png`, 6% krycia, tryb `overlay`).
- **Sygnatura marki.** Znak (K z kursorem i iskrą) jako maska CSS — bierze kolor tekstu, więc da się go
  podświetlić. Wordmark: Inter Tight 600, wersaliki, światło 0.3em — ten sam język co etykiety interfejsu.

---

## 7a. Wydajność — co już zrobione

Zacinanie przy przewijaniu hero miało dwie przyczyny i obie są usunięte:

1. **Rysowanie punktów.** Kilka tysięcy wywołań `rect()` + `fill()` na klatkę kosztowało kilkanaście
   milisekund. Punkty lądu trafiają teraz wprost do bufora `ImageData` i lądują na płótnie jednym
   `putImageData`; tło kuli dorysowujemy pod spodem przez `destination-over`.
   Pomiar w tym samym stanie (pełne zbliżenie na kontynent): **p90 blokady wątku 20,1 ms → 5,3 ms,
   p99 34,3 ms → 14,4 ms**.
2. **Kosztowne efekty malowania.** Zniknęły: `background-attachment: fixed`, `mix-blend-mode` na
   pełnoekranowej warstwie ziarna, `backdrop-filter` w pasku nawigacji, filtr `drop-shadow` na
   ścieżce SVG i podwójny wielki `text-shadow` w nagłówku. Każdy z nich przemalowuje cały ekran
   przy każdym przewinięciu.

Dodatkowo: gęstość płótna ograniczona do 1,5× (zamiast 2×), rozmiary kropek przeliczane raz na zmianę
rozmiaru płótna, podstrony artykułów budowane leniwie przy pierwszym wejściu, cięższe bloki usług
z `content-visibility: auto`, mniej wariantów fontów w zapytaniu do Google Fonts.

Scena hero wchodzi pod pasek nawigacji (`margin-top: -70px`), więc przyklejona sekcja od pierwszej
klatki pokrywa się dokładnie z oknem — nic nie wystaje poniżej krawędzi i nie trzeba nigdzie podjeżdżać.
Środek kuli siedzi na 45% wysokości sceny, czyli wyraźnie powyżej środka widocznego obszaru.

## 8. Budżety i kryteria odbioru

- LCP < 2,5 s, INP < 200 ms, CLS < 0,1 na danych z realnego ruchu.
- Waga strony głównej < 400 KB przy pierwszym wejściu (dane terenu doczytywane osobno).
- Formularz działa na tyle bez JavaScriptu, żeby dało się skopiować adres e-mail.
- Pełna obsługa klawiatury: widoczny focus, menu mobilne zamykane Esc.
- `prefers-reduced-motion` wyłącza globus, choreografię scrolla, marquee i karuzelę.

---

## 9. Do uzupełnienia po stronie klienta

1. Realne logotypy klientów i zgody na publikację (teraz są nazwy poglądowe — `website/src/content/clients.ts`,
   flaga `clientsArePlaceholders`).
2. Dane rejestrowe do stopki: pełna nazwa, adres, NIP, KRS.
3. Polityka prywatności i regulamin (prawnik, nie agencja).
4. Weryfikacja liczb w sekcji „Jak to wygląda w praktyce” (48 h, 14 dni, 0 raportów PDF) —
   to obietnice operacyjne, muszą być prawdziwe.
5. Profile w social media do stopki.
6. Wektorowa wersja logo (SVG) — dziś używamy maski PNG 76×88 px, co wystarcza do 24 px wysokości.

---

## 10. Komendy

```bash
cd website
npm run dev      # serwer deweloperski na http://localhost:3000
npm run build    # build produkcyjny + kontrola typów
npm run lint     # ESLint
```

Prototyp bez budowania: otwórz `kliqa-landing.html` w przeglądarce albo wejdź na
`http://localhost:3000/prototype.html` przy uruchomionym serwerze deweloperskim.
