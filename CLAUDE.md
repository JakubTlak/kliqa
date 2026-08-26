# Kliqa — kontekst projektu

Serwis agencji marketingowej Kliqa. Produkcja: **https://kliqa.pl** (hosting SeoHost, DirectAdmin).
Repozytorium: `JakubTlak/kliqa`. Językiem projektu — kodu, komentarzy, commitów i treści — jest **polski**.

Ten plik jest streszczeniem, które ma wystarczyć do pracy bez historii rozmowy.
Szczegóły techniczne: [PLAN.md](PLAN.md), instrukcja uruchomienia: [README.md](README.md).

---

## 1. Zasady pracy (najważniejsze)

1. **Nie wypychaj zmian na GitHuba bez wyraźnej prośby.** Push na `main` uruchamia GitHub Actions,
   który natychmiast wdraża serwis na kliqa.pl. Edycje i commity lokalne — swobodnie.
2. **Landing ma ściśle ograniczony zakres.** Strona główna to: slogan + globus → przejście scrollem
   do drugiego sloganu z CTA → segmenty usług → droga współpracy → formularz. Nic więcej.
   Nowe obszary treści dostają **własne podstrony**, nie doklejamy ich do landingu.
3. **Do podglądu służy Artifact**, nie produkcja. Publikacja podglądowa nie dotyka kliqa.pl.
4. **Weryfikuj, zanim powiesz, że działa.** Twierdzenia typu „gotowe” bez sprawdzenia były w tym
   projekcie źródłem realnych błędów (patrz sekcja 9).
5. Treści marketingowe zawierają obietnice operacyjne (48 h na audyt, cykl 14 dni, zero raportów PDF).
   To deklaracje właściciela — nie wymyślaj nowych liczb ani referencji.

---

## 2. Biznes

Kliqa to agencja marketingowa dla firm, które chcą wiedzieć, za co dokładnie płacą.
Pozycjonowanie: **technologiczne i analityczne podejście** — agencja pracuje jak zespół produktowy
(hipoteza → wdrożenie → pomiar → decyzja), a nie jak dom mediowy z raportem na koniec miesiąca.

Ton komunikacji: rzeczowy, konkretny, bez marketingowej waty. Zdania krótkie, liczby zamiast
przymiotników, gotowość do powiedzenia „nie umiemy”. Kontakt: `biuro@kliqa.pl`.

Motyw przewodni marki: **kliknięcie** — najmniejsza mierzalna jednostka marketingu i pierwsze miejsce,
w którym zaczyna się przeciek. Stąd nazwa, logo (K z kursorem i iskrą), globus z „kliknięciami”
w hero i iskra przy każdym kliknięciu na stronie.

### Świadczone usługi (sześć, każda z własnym wskaźnikiem rozliczenia)

| # | Usługa | Rozliczenie |
|---|---|---|
| 01 | Performance marketing (Google, Meta, TikTok) | CAC i ROAS przyrostowy, przegląd co 14 dni |
| 02 | Strony internetowe i sklepy (Next.js, headless) | współczynnik konwersji i czas ładowania |
| 03 | SEO i widoczność w wyszukiwarkach AI | ruch i konwersje z kanału organicznego |
| 04 | Automatyzacja procesów marketingowych (n8n, Make, CRM) | godziny odzyskane w miesiącu |
| 05 | Wdrożenia AI (LLM, RAG, agenci) | koszt procesu przed vs. po |
| 06 | Social media | koszt kreacji i wynik kampanii wspartych organiką |

---

## 3. Architektura serwisu

| Adres | Zawartość |
|---|---|
| `/` | slogan + globus, drugi slogan z CTA, segmenty usług, droga współpracy, formularz |
| `/uslugi/` | sześć usług: zakres, rezultaty, wskaźnik + interaktywny widget przy każdej |
| `/o-nas/` | historia, zasady, granice („czego nie robimy”), stack |
| `/edukacja/` | lista dziesięciu opracowań z filtrami |
| `/edukacja/{slug}/` | omówienie materiału: sekcje, kluczowe liczby, wnioski, link do oryginału |
| `/kontakt/` | formularz, dane, lista dostępów do audytu, trzy kroki startu |
| `/polityka-prywatnosci/` | jedenaście sekcji RODO: dane z formularza, podstawy, terminy, kategorie zgód |
| `/regulamin/` | świadczenie usług drogą elektroniczną — **odnośnik wyłącznie w stopce**, nie w nawigacji |
| `404.html` | strona błędu z prawdziwym kodem 404, `noindex`; nie ma jej w mapie serwisu |

**Adresy kończą się ukośnikiem.** Tak serwuje je hosting (katalog + `index.html`) i tak brzmią
`canonical` oraz wpisy w `sitemap.xml`. Próba trzymania adresów bez ukośnika kończy się pętlą
przekierowań z `DirectorySlash`.

Router ma dwa tryby, ustawiane przy budowaniu:
- `path` (hosting) — każda podstrona to osobny plik, nawigacja przez History API,
- `hash` (podgląd bez serwera) — te same trasy jako `#/uslugi`.

Podstrony materiałów edukacyjnych powstają leniwie, przy pierwszym wejściu na trasę.

---

## 4. Design

Źródło: `materiały/DESIGN.md` (styl „encrypted terminal / editorial broadsheet”). Zasady, których
nie łamiemy:

**Kolor.** Paleta jest monochromatyczna: `#060606` (tło), `#1f1f1f` (karty), `#252525` (ramki),
`#313131` (hover), szarości `#525252` → `#e5e5e5`, biel `#ffffff`.
Jedyny kolor chromatyczny to **limonka `#c5ff4a`** i pojawia się wyłącznie w rolach:
wypełniony CTA, świecąca ramka, jedno kursywne słowo w nagłówku, pasek z hasłami, akcenty w danych.
**Nigdy w tekście ciągłym.**

**Typografia.**
- Nagłówki: **Source Serif 4, waga 300** (PT Serif z DESIGN.md nie istnieje w tej wadze — to jest
  podstawienie wskazane wprost w dokumencie). Ujemny tracking, ciasna interlinia.
- Interfejs i tekst: **Inter Tight** 400/500/600. Etykiety wersalikami ze światłem 0.18–0.26em.
- Dane, kod, metadane: **JetBrains Mono** 400/500.

Wszystkie trzy kroje **stoją na naszym serwerze** (`prototyp/assets/fonts/`), w wariantach zmiennych
ograniczonych do znaków faktycznie występujących w serwisie: 191 KB w czterech plikach zamiast
~660 KB pełnych subsetów z Google. Odwiedzający nie wysyła zapytania do Google i jego adres IP
nie opuszcza serwera — to samo mówi polityka prywatności, więc **nie wolno wrócić do `fonts.googleapis.com`**.
Zestaw znaków jest w `prototyp/assets/fonts/znaki.txt`; po dopisaniu do treści nowego symbolu
(np. innej strzałki) kroje trzeba pobrać ponownie z rozszerzonym zestawem, inaczej znak
wyświetli się krojem systemowym.

**Forma.** Karty 0 px zaokrąglenia, przyciski 4 px, tagi 2 px. Głębia z warstw i włosowych ramek,
nie z cieni — jedyny cień w systemie to limonkowa poświata pod CTA.

**Tło nigdy nie jest płaskie**: ciemna baza + dwie słabe plamy światła + ziarno (`grain.png`,
krycie 5%, bez `mix-blend-mode`). Obie warstwy są `position: fixed` — nie `background-attachment`.

**Logotyp**: sam znak „K” z kursorem i iskrą, jako maska CSS (bierze kolor tekstu). Bez dopisków.
W nawigacji przy lewej krawędzi, CTA przy prawej, pasek pełnej szerokości.

**Ruch.** `prefers-reduced-motion` wyłącza globus, choreografię scrolla, marquee i animacje wejścia.

---

## 5. Hero i globus (najbardziej złożony element)

Kula z punktów lądu, wokół niej osiemnaście satelitów na własnych orbitach. Przy przewijaniu kamera
zbliża się do **losowo wybranego kontynentu** (za każdym zjazdem innego), pokazując jego rzeźbę terenu
jako siatkę topograficzną; satelity odlatują poza kadr, tło rozjaśnia się w stronę oliwki, wjeżdża
drugi slogan i limonkowy pasek z hasłami.

- Dane: kafle wysokościowe terrarium (AWS Open Data, zoom 4) → globalna chmura ~7 400 punktów
  + siedem siatek kontynentów (~83 000 punktów). Całość 138 KB base64 (gzip + `DecompressionStream`).
- Kadr liczony z **96. percentyla promienia kątowego** od środka masy lądu — bez tego Antarktyda
  i Oceania (przecięcie 180. południka) kadrują się źle.
- Punkty rysowane **przez bufor pikseli** (`ImageData` + jedno `putImageData`), nie ścieżkami Canvas.
  To dało p90 blokady wątku 20,1 ms → 5,3 ms.
- Kliknięcia (pingi) lecą tam, gdzie patrzy kamera: na kulę albo na wybrany kontynent.

Regeneracja danych: `tools/fetch-dem.js` → `tools/build-terrain.js`.

---

## 6. Budowanie i wdrożenie

```bash
node tools/build.js preview    # kliqa-landing.html — jeden plik, tryb hash, formularz przez mailto
node tools/build.js deploy     # deploy/ — 17 podstron + strona błędu, tryb path, formularz przez kontakt.php
node tools/deploy-assets.js    # favicony i obrazek OG z logo
```

Źródłem serwisu jest **`prototyp/`** (siedem części: dwa arkusze stylów, znaczniki strony głównej,
znaczniki podstron, trzy skrypty — globus z routerem, treść, zgody). Build podmienia siedem znaczników:
`__ASSETS__`, `__FONTS__`, `__ZGODY_HEAD__`, `__TERRAIN__`, `__TERRAIN_URL__`, `__ROUTE_MODE__`,
`__MAIL_ENDPOINT__`.

W wersji na hosting build wypuszcza jeszcze: `robots.txt` (z odcięciem resztek WordPressa),
`sitemap.xml` (17 adresów, bez strony błędu), `site.webmanifest`, `favicon.ico` w katalogu głównym
oraz **wspólny `assets/kliqa.js`** — skrypty nie są już wklejane w każdą stronę. Adres tego pliku
ma w zapytaniu skrót treści, więc nowa wersja unieważnia pamięć podręczną sama z siebie.

Tytuły i opisy podstron są w `tools/build.js`; build **przerywa się**, gdy tytuł przekroczy 62 znaki
albo opis wyjdzie poza 70–160 znaków. Ikony (favicon, `favicon.ico`, ikony 192/512, obrazek OG)
generuje `tools/deploy-assets.js` z `materiały/logo.png`.

Wersję na hosting da się obejrzeć lokalnie — z prawdziwymi adresami i stroną błędu:

```bash
node tools/build.js deploy && node tools/serwer-podgladu.js   # http://localhost:4173
```

**Wdrożenie:** push na `main` → GitHub Actions (`.github/workflows/deploy.yml`) buduje i wysyła
katalog `deploy/` po **FTPS** do `public_html`. Dane FTP w sekretach repozytorium.
Krok kontrolny sprawdza liczbę podstron, obecność zasobów i wzorce adresów kanonicznych.

**Formularz** (`tools/hosting/kontakt.php`): JSON → `mail()` na `biuro@kliqa.pl`, nadawca
`formularz@kliqa.pl`. Pułapka na boty, limit pięciu zgłoszeń na godzinę z jednego IP, ochrona przed
wstrzyknięciem nagłówków, brak zależności od `mbstring`. Gdy poczta odmówi, strona przechodzi na tryb
„otwórz program pocztowy z gotową treścią”. **Status: działa na produkcji, SSL włączony.**

**Uwaga o WordPressie.** W `public_html` leżą jeszcze pliki starego WordPressa z WooCommerce.
Serwis go ignoruje: `DirectoryIndex index.html index.php` daje pierwszeństwo naszej stronie, a reguły
WP są w `.htaccess` zakomentowane (nic nie usunięto, `/wp-admin/` nadal działa).

---

## 7. Zgody na cookies i wydajność

**Zgody** (`prototyp/07-skrypt-zgody.html`). Serwis nie ustawia żadnego cookie z własnej woli.
Decyzja odwiedzającego trafia do `localStorage` pod kluczem `kliqa-zgody` (`{v, data, statystyka,
marketing}`, ważna 12 miesięcy). Trzy kategorie: niezbędne (bez wyłącznika), statystyka, marketing.
Domyślną odmowę dla Consent Mode v2 ustawia skrypt **w nagłówku strony**, przed jakimkolwiek tagiem —
moduł na dole strony tylko ją aktualizuje. Wejścia dla przyszłego GA4: `KLIQA.zgody.stan()`,
`KLIQA.zgody.otworz()` i zdarzenie `kliqa:zgody` na dokumencie. Dowolny element z atrybutem
`data-zgody="otworz"` otwiera okno ustawień — tak działa odnośnik w stopce.
Podniesienie `WERSJA` w module powoduje ponowne zapytanie wszystkich odwiedzających.

**Wydajność.** Scena hero dobiera jakość do urządzenia (obiekt `Q` w skrypcie globusa): skala bufora
1,5 na biurku, 1,25 na telefonie i 1,0 na słabszym, co N-ty punkt lądu zamiast każdego, mniej satelitów
i krótsze smugi. Do tego pilnuje własnego kosztu — jeśli klatka przekracza 9 ms, sama się rozrzedza,
a gdy schodzi poniżej 3,5 ms, wraca do gęstości z profilu. Punkty trafiają do bufora pikseli, z którego
na płótno wgrywany jest **tylko prostokąt faktycznie zapisany w tej klatce**, nie całe okno.
Pętla `requestAnimationFrame` jest zatrzymywana, gdy płótno wyjdzie z kadru albo karta zejdzie w tło.
Dane terenu (138 KB) pobierają się dopiero przy wejściu na stronę główną, nie na podstronach.
Zmierzone przy pełnym zbliżeniu na kontynent: p90 2,8 ms i p99 4,0 ms na klatkę (wcześniej 5,3 i 14,4).

Wysokość hero to 380vh na biurku i **260vh na telefonie** — ta sama sekwencja przy krótszej drodze
przewijania.

## 8. Projekt Next.js (`website/`)

Równoległa implementacja produkcyjna: Next.js 16 + TypeScript + Tailwind 4, endpoint `/api/contact`
na Resend, treść w `src/content/`. Jest **o etap za prototypem** — brakuje choreografii globusa,
widgetów w usługach i podstron materiałów. To etap 2 z PLAN.md. Serwis na kliqa.pl nie korzysta
z tego projektu; obecnie działa wersja statyczna z `prototyp/`.

---

## 9. Pułapki, które już nas kosztowały czas

- **Kolejność warstw w hero.** `.stage-bg` musi leżeć POD płótnem globusa. Nieprzezroczysty gradient
  nad płótnem zasłaniał cały teren — kontynent był rysowany, ale niewidoczny.
- **`putImageData` nadpisuje piksele.** Satelity rysowane przed wgraniem warstwy punktów znikały.
  Wszystko, co ma być widoczne, rysuje się PO `putImageData`; tło dokładamy przez `destination-over`.
- **`DirectorySlash` kontra własne reguły.** Serwer dodaje ukośnik, reguła go zdejmowała → pętla 301.
- **`mbstring` bywa wyłączony.** `mb_strlen` w skrypcie formularza kończyło się błędem krytycznym
  i utratą zgłoszenia. Wykrył to dopiero test na realnym PHP, nie kontrola składni.
- **Treść żyje też w meta description.** Usunięcie zdania ze strony nie usuwa go z opisu w wynikach
  wyszukiwania — opisy podstron są w `tools/build.js`.
- **`flex-basis` w kolumnie to wysokość.** Pasek zgód miał `flex:1 1 380px` na bloku tekstu;
  po przełączeniu na `flex-direction:column` na telefonie 380px stało się wysokością i pasek
  zajmował dwie trzecie ekranu.
- **Strona błędu nie może czytać trasy z adresu.** Serwer podstawia `404.html` pod dowolny
  nieistniejący adres, więc router rozpoznaje ją po `data-trasa="/404"` na `<body>`. Wymuszenia
  nie wolno kasować przy nawigacji — inaczej przycisk „wstecz” pokazuje pod błędnym adresem
  stronę główną, czyli miękki 404 gotowy do zaindeksowania.
- **`rel=preload as=fetch` z `crossorigin`** nie pasuje do zwykłego `fetch()` tego samego pochodzenia:
  przeglądarka pobiera plik drugi raz. Przy krojach jest odwrotnie — tam `crossorigin` jest obowiązkowy.
- **Kosztowne efekty malowania**: `background-attachment: fixed`, `mix-blend-mode` na pełnoekranowej
  warstwie, `backdrop-filter` w nawigacji, filtr `drop-shadow` na SVG. Wszystkie usunięte.
- **SeoHost limituje zapytania.** Serie curla pod rząd zwracają `429 Too Many Requests` — przy
  weryfikacji produkcji rób odstępy kilku sekund.
- Panel przeglądarki w tym środowisku **nie kompozytuje klatek**: `requestAnimationFrame`, zdarzenia
  scrolla, `IntersectionObserver`, przejścia CSS i `ResizeObserver` nie działają. Testy scrolla
  wymagają podmiany `requestAnimationFrame` na `setTimeout` i ręcznego `dispatchEvent(new Event('scroll'))`.
  Renderu nie da się zobaczyć — weryfikuj przez odczyt pikseli z `canvas` i wartości obliczone z DOM.

---

## 10. Do uzupełnienia przez właściciela

1. **Dane rejestrowe w dokumentach.** Polityka prywatności i regulamin wskazują dziś administratora
   ogólnie: „Kliqa — agencja marketingowa prowadząca ten serwis", z adresem `biuro@kliqa.pl` i zdaniem,
   że pełne dane rejestrowe przekazujemy na żądanie. Hostingodawca jest opisany kategorią, nie nazwą.
   Gdy dane firmy będą gotowe, trzeba je wstawić w trzech miejscach w `prototyp/04-podstrony.html`:
   sekcja 01 polityki, sekcja 05 polityki (odbiorcy danych) i sekcja 01 regulaminu.
2. **Przegląd prawny obu dokumentów.** Są napisane pod ten konkretny serwis (formularz, brak sprzedaży,
   zgody) i działają na produkcji, ale to nie jest opinia prawna — warto dać je radcy do przeczytania.
3. Dane rejestrowe w stopce (nazwa, adres, NIP) — dziś stopka ich nie zawiera.
4. Weryfikacja obietnic operacyjnych w treści (48 h, 14 dni, zero raportów PDF).
5. Profile w social media do stopki.
6. Wektorowa wersja logo (dziś maska PNG 76×88, wystarcza do ~40 px).
7. GA4 przed uruchomieniem kampanii — mechanizm zgód jest gotowy i czeka na tag: wystarczy wczytać
   gtag.js po zdarzeniu `kliqa:zgody` albo sprawdzić `KLIQA.zgody.stan()`. Etap 3 z PLAN.md.
