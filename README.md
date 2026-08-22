# Kliqa

Serwis agencji marketingowej Kliqa — performance marketing (Google, Meta, TikTok), strony
internetowe, SEO, automatyzacja procesów, wdrożenia AI i social media.

Produkcja: **[kliqa.pl](https://kliqa.pl)** (hosting SeoHost, DirectAdmin)

## Struktura repozytorium

```
kliqa/
├─ prototyp/               # ŹRÓDŁO serwisu: style, treść i skrypty w częściach
│  ├─ 01-style-podstawy.html   tokeny, typografia, nawigacja, hero
│  ├─ 02-style-sekcje.html     sekcje, widgety, formularz, stopka
│  ├─ 03-strona-glowna.html    znaczniki strony głównej
│  ├─ 04-podstrony.html        usługi, o nas, edukacja, kontakt
│  ├─ 05-skrypt-globus.html    router, globus, satelity, choreografia scrolla
│  ├─ 06-skrypt-tresc.html     droga współpracy, widgety, materiały, formularz
│  ├─ assets/                  ikony i obrazek do udostępnień (generowane)
│  └─ *.b64.txt                dane terenu, ziarno tła, maska logo
├─ tools/
│  ├─ build.js             # buduje wersję podglądową i wersję na hosting
│  ├─ deploy-assets.js     # generuje favicony i obrazek OG z logo
│  ├─ hosting/             # .htaccess i kontakt.php wgrywane razem z serwisem
│  ├─ fetch-dem.js         # pobiera kafle wysokościowe (regeneracja terenu)
│  └─ build-terrain.js     # z kafli robi chmurę punktów i siatki kontynentów
├─ kliqa-landing.html      # wersja podglądowa: cały serwis w jednym pliku
├─ deploy/                 # wynik builda na hosting (poza repozytorium)
├─ materiały/              # logo źródłowe
├─ PLAN.md                 # architektura, stack, etapy, budżety wydajności
└─ website/                # równoległy projekt Next.js (etap 2 z planu)
```

## Budowanie

```bash
node tools/build.js preview    # kliqa-landing.html — jeden plik, trasy na hashach
node tools/build.js deploy     # deploy/ — osobny adres i plik na każdą podstronę
```

Wersja `deploy` generuje 15 podstron (strona główna, usługi, o nas, edukacja, kontakt
i dziesięć materiałów edukacyjnych), każdą z własnym tytułem, opisem i adresem kanonicznym.
Dane terenu (138 KB) leżą w osobnym pliku, więc przeglądarka pobiera je raz na cały serwis.

## Wdrożenie na kliqa.pl

### Pierwszy raz — ręcznie

1. `node tools/build.js deploy`
2. Zaloguj się do DirectAdmin w SeoHost → **Menedżer plików** (albo połącz się FileZillą).
3. Wejdź do `domains/kliqa.pl/public_html` i wgraj **całą zawartość** katalogu `deploy/`
   (razem z ukrytym plikiem `.htaccess` — w FileZilli włącz pokazywanie plików ukrytych).
4. W DirectAdmin wystaw certyfikat **Let's Encrypt** dla `kliqa.pl` i `www.kliqa.pl`.
   Dopiero po tym `.htaccess` może przekierowywać na HTTPS.
5. Utwórz skrzynkę **formularz@kliqa.pl** — z tego adresu wychodzą zgłoszenia z formularza.
6. Sprawdź: `https://kliqa.pl/uslugi` ma się otworzyć bez `index.html` w adresie,
   a formularz na `/kontakt` ma wysłać wiadomość na `biuro@kliqa.pl`.

### Kolejne wdrożenia — automatycznie

Workflow `.github/workflows/deploy.yml` buduje serwis i wysyła go na FTP po każdym pushu
na `main`. Ustaw wcześniej sekrety w **Settings → Secrets and variables → Actions**:

| Sekret | Wartość |
|---|---|
| `FTP_SERVER` | host FTP z panelu SeoHost, np. `ftp.kliqa.pl` |
| `FTP_USERNAME` | login konta FTP |
| `FTP_PASSWORD` | hasło konta FTP |
| `FTP_DIR` | `/domains/kliqa.pl/public_html/` |

Hasło wpisujesz wyłącznie w sekretach GitHuba — nigdy w plikach repozytorium.

### Formularz kontaktowy

`tools/hosting/kontakt.php` przyjmuje zgłoszenie JSON-em i wysyła je funkcją `mail()`
na adres z pola `ODBIORCA`. Ma pułapkę na boty, limit pięciu zgłoszeń na godzinę z jednego
adresu IP i zabezpieczenie przed wstrzyknięciem nagłówków. Jeśli serwer pocztowy odmówi,
strona sama przechodzi na tryb „otwórz program pocztowy z gotową treścią”, więc kontakt
nigdy nie znika.

## Projekt Next.js

`website/` to równoległa implementacja produkcyjna (Next.js 16 + Tailwind 4) z endpointem
`/api/contact` opartym o Resend. Jest o etap za prototypem — brakuje w niej choreografii
globusa, widgetów w usługach i podstron materiałów. Szczegóły w [PLAN.md](PLAN.md), etap 2.

```bash
cd website
npm install
npm run dev
```

## Zanim strona pójdzie szerzej

Lista rzeczy do uzupełnienia (dane rejestrowe, polityka prywatności, weryfikacja obietnic
operacyjnych) znajduje się w [PLAN.md](PLAN.md), sekcja 9.
