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
   projekcie źródłem realnych błędów (patrz sekcja 8).
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
node tools/build.js deploy     # deploy/ — 15 podstron, tryb path, formularz przez kontakt.php
node tools/deploy-assets.js    # favicony i obrazek OG z logo
```

Źródłem serwisu jest **`prototyp/`** (sześć części: dwa arkusze stylów, znaczniki strony głównej,
znaczniki podstron, dwa skrypty). Build podmienia pięć znaczników: `__ASSETS__`, `__TERRAIN__`,
`__TERRAIN_URL__`, `__ROUTE_MODE__`, `__MAIL_ENDPOINT__`.

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

## 7. Projekt Next.js (`website/`)

Równoległa implementacja produkcyjna: Next.js 16 + TypeScript + Tailwind 4, endpoint `/api/contact`
na Resend, treść w `src/content/`. Jest **o etap za prototypem** — brakuje choreografii globusa,
widgetów w usługach i podstron materiałów. To etap 2 z PLAN.md. Serwis na kliqa.pl nie korzysta
z tego projektu; obecnie działa wersja statyczna z `prototyp/`.

---

## 8. Pułapki, które już nas kosztowały czas

- **Kolejność warstw w hero.** `.stage-bg` musi leżeć POD płótnem globusa. Nieprzezroczysty gradient
  nad płótnem zasłaniał cały teren — kontynent był rysowany, ale niewidoczny.
- **`putImageData` nadpisuje piksele.** Satelity rysowane przed wgraniem warstwy punktów znikały.
  Wszystko, co ma być widoczne, rysuje się PO `putImageData`; tło dokładamy przez `destination-over`.
- **`DirectorySlash` kontra własne reguły.** Serwer dodaje ukośnik, reguła go zdejmowała → pętla 301.
- **`mbstring` bywa wyłączony.** `mb_strlen` w skrypcie formularza kończyło się błędem krytycznym
  i utratą zgłoszenia. Wykrył to dopiero test na realnym PHP, nie kontrola składni.
- **Treść żyje też w meta description.** Usunięcie zdania ze strony nie usuwa go z opisu w wynikach
  wyszukiwania — opisy podstron są w `tools/build.js`.
- **Kosztowne efekty malowania**: `background-attachment: fixed`, `mix-blend-mode` na pełnoekranowej
  warstwie, `backdrop-filter` w nawigacji, filtr `drop-shadow` na SVG. Wszystkie usunięte.
- **SeoHost limituje zapytania.** Serie curla pod rząd zwracają `429 Too Many Requests` — przy
  weryfikacji produkcji rób odstępy kilku sekund.
- Panel przeglądarki w tym środowisku **nie kompozytuje klatek**: `requestAnimationFrame`, zdarzenia
  scrolla, `IntersectionObserver`, przejścia CSS i `ResizeObserver` nie działają. Testy scrolla
  wymagają podmiany `requestAnimationFrame` na `setTimeout` i ręcznego `dispatchEvent(new Event('scroll'))`.
  Renderu nie da się zobaczyć — weryfikuj przez odczyt pikseli z `canvas` i wartości obliczone z DOM.

---

## 9. Do uzupełnienia przez właściciela

1. Dane rejestrowe w stopce (nazwa, adres, NIP).
2. Polityka prywatności i regulamin.
3. Weryfikacja obietnic operacyjnych w treści (48 h, 14 dni, zero raportów PDF).
4. Profile w social media do stopki.
5. Wektorowa wersja logo (dziś maska PNG 76×88, wystarcza do ~40 px).
6. Baner zgód (Consent Mode v2) i GA4 przed uruchomieniem kampanii — etap 3 z PLAN.md.
