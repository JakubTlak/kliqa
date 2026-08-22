# Kliqa

Strona agencji marketingowej Kliqa — performance marketing (Google, Meta, TikTok), strony
internetowe, SEO, automatyzacja procesów, wdrożenia AI i social media.

## Struktura repozytorium

```
kliqa/
├─ kliqa-landing.html      # prototyp całej aplikacji w jednym pliku, bez zależności
├─ PLAN.md                 # plan działania, stack, etapy wdrożenia, budżety wydajności
├─ tools/                  # skrypty budujące dane terenu i assety
│  ├─ fetch-dem.js         # pobiera kafle wysokościowe i skleja raster 4096×4096
│  ├─ build-terrain.js     # z rastra robi chmurę punktów i siatki 7 kontynentów
│  └─ assets.js            # ziarno tła + maska logo
├─ materiały/
│  ├─ logo.png             # znak marki (K + kursor + iskra kliknięcia)
│  └─ logo-mask.png        # ten sam znak jako maska alfa (1,5 KB)
└─ website/                # projekt produkcyjny (Next.js 16 + TypeScript + Tailwind 4)
   ├─ src/app/             # / , /uslugi, /o-nas, /edukacja, /api/contact
   ├─ src/components/      # Globe, HeroStage, ContactForm, EducationGrid, nagłówek i stopka
   ├─ src/content/         # treść: usługi, proces, edukacja, klienci
   └─ public/              # prototype.html, terrain.b64.txt, grain.png, logo-mask.png
```

## Uruchomienie

```bash
cd website
npm install
npm run dev
```

Strona: `http://localhost:3000` (trasy: `/`, `/uslugi`, `/o-nas`, `/edukacja`).
Prototyp: `http://localhost:3000/prototype.html`.

## Formularz kontaktowy

Zgłoszenia trafiają na `biuro@kliqa.pl` przez Resend. Skopiuj `website/.env.example` do
`website/.env.local` i uzupełnij `RESEND_API_KEY` oraz `CONTACT_FROM` (adres z domeny
zweryfikowanej w Resend). Bez klucza endpoint zwraca czytelny błąd zamiast udawać wysyłkę.

## Zanim strona pójdzie na produkcję

Lista rzeczy do uzupełnienia (logotypy klientów, dane rejestrowe, polityka prywatności,
wektorowe logo) znajduje się w [PLAN.md](PLAN.md), sekcja 8.
