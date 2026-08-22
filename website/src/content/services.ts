/**
 * Treść sekcji „Usługi”. Trzymana osobno od komponentów, żeby copywriting dało się
 * zmieniać bez dotykania layoutu — i żeby dało się to później przenieść do CMS
 * bez przepisywania widoków.
 */

export type Service = {
  id: string;
  index: string;
  title: string;
  lead: string;
  /** Krótki opis do kafelka w sekcji „Czym się zajmujemy”. */
  short: string;
  tags: string[];
  work: string[];
  deliverables: string[];
  /** Zdanie rozliczeniowe — wskaźnik, rytm, własność zasobów. */
  billing: string;
};

export const services: Service[] = [
  {
    id: "performance",
    index: "U 01",
    title: "Performance marketing — Google, Meta, TikTok",
    lead: "Kampanie prowadzone jak portfel inwestycyjny: alokacja budżetu według krańcowego zwrotu, nie według przyzwyczajenia.",
    short:
      "Google, Meta i TikTok prowadzone jak jeden system, a nie trzy osobne panele. Budżet płynie tam, gdzie jest realna marża.",
    tags: ["Google Ads", "Meta Ads", "TikTok Ads", "PMax"],
    work: [
      "Audyt struktury kont, wykluczeń, feedu produktowego i historii zmian.",
      "Przebudowa kampanii pod sygnały konwersji o wysokiej jakości (nie pod kliknięcia).",
      "Google: Search, Performance Max, Demand Gen, YouTube, kampanie na feedzie.",
      "Meta: konsolidacja zestawów, Advantage+, testy kreacji w seriach po kilkanaście wariantów.",
      "TikTok: Spark Ads i kreacje natywne produkowane w rytmie tygodniowym.",
      "Testy przyrostowe (holdout / lift), żeby odróżnić sprzedaż od jej przypisania.",
    ],
    deliverables: [
      "Plan kont i budżetów na kwartał z progami skalowania.",
      "Bibliotekę kreacji z oceną skuteczności każdego hooka.",
      "Dashboard z kosztem pozyskania w podziale na kanał, kampanię i produkt.",
      "Cotygodniową notatkę decyzyjną: co włączamy, co gasimy, dlaczego.",
    ],
    billing:
      "Rozliczenie: CAC / ROAS przyrostowy · przegląd co 14 dni · pełen dostęp do kont po Twojej stronie",
  },
  {
    id: "www",
    index: "U 02",
    title: "Strony internetowe i sklepy",
    lead: "Strona to nie wizytówka, tylko najdroższy element lejka. Budujemy ją pod prędkość, konwersję i pomiar.",
    short:
      "Szybkie strony i sklepy pisane pod konwersję i Core Web Vitals. Bez ciężkich page builderów.",
    tags: ["Next.js", "Headless", "CRO", "Web Vitals"],
    work: [
      "Projekt UX oparty na nagraniach sesji, mapach kliknięć i danych z wyszukiwarki.",
      "Wdrożenie w Next.js lub na headless commerce (Shopify, WooCommerce jako backend).",
      "Optymalizacja Core Web Vitals: LCP, INP i CLS traktowane jako budżet, nie jako życzenie.",
      "Landing page'e kampanijne z wariantami A/B pod konkretne grupy odbiorców.",
      "Pomiar od pierwszego dnia: GA4, GTM server-side, zdarzenia e-commerce, zgody.",
    ],
    deliverables: [
      "Repozytorium z kodem i dokumentacją — bez uzależnienia od agencji.",
      "Panel do samodzielnej edycji treści i sekcji strony.",
      "Raport wydajności przed / po z danymi z rzeczywistego ruchu (CrUX).",
      "Plan testów CRO na pierwsze 90 dni po starcie.",
    ],
    billing:
      "Rozliczenie: współczynnik konwersji i czas ładowania · projekt 4–10 tygodni · hosting po Twojej stronie",
  },
  {
    id: "seo",
    index: "U 03",
    title: "SEO i widoczność w wyszukiwarkach AI",
    lead: "Klasyczny ranking to dziś połowa gry. Druga połowa to bycie źródłem, które cytuje model.",
    short:
      "Techniczne SEO, treści i architektura informacji — dziś także pod odpowiedzi AI. Walczymy o cytowanie.",
    tags: ["SEO tech", "Content", "AI Overviews", "Linki"],
    work: [
      "Audyt techniczny: indeksacja, renderowanie, kanibalizacja, dane strukturalne.",
      "Architektura treści oparta na realnych intencjach i lukach względem konkurencji.",
      "Treści pisane przez ludzi, przyspieszane przez AI — z redakcją i weryfikacją źródeł.",
      "Optymalizacja pod odpowiedzi generatywne: fragmenty cytowalne, encje, FAQ, schema.",
      "Pozyskiwanie linków w oparciu o dane i publikacje branżowe, bez farm linkowych.",
    ],
    deliverables: [
      "Roadmapę treści na 2 kwartały z priorytetem według potencjału sprzedażowego.",
      "Monitoring widoczności w Google i w odpowiedziach AI (udział cytowań).",
      "Listę poprawek technicznych gotową do wdrożenia przez dowolny zespół.",
      "Comiesięczną analizę zapytań, które realnie kończą się konwersją.",
    ],
    billing:
      "Rozliczenie: ruch i konwersje z kanału organicznego · pierwsze efekty 3–6 miesięcy · bez gwarancji „pozycji nr 1”",
  },
  {
    id: "automatyzacja",
    index: "U 04",
    title: "Automatyzacja procesów marketingowych",
    lead: "Każda czynność powtarzana ręcznie co tydzień jest kandydatem do usunięcia z Twojego kalendarza.",
    short:
      "Lead trafia do CRM, handlowiec dostaje powiadomienie, klient dostaje sekwencję — bez człowieka klikającego w arkusz.",
    tags: ["n8n", "Make", "CRM", "API"],
    work: [
      "Mapowanie procesu: od źródła leada, przez kwalifikację, po domknięcie sprzedaży.",
      "Integracje formularzy, CRM, kalendarzy, płatności i komunikatorów (n8n, Make, API).",
      "Scenariusze e-mail i SMS: powitanie, porzucony koszyk, odzyskiwanie, win-back.",
      "Automatyczne raportowanie do arkusza lub hurtowni — koniec z ręcznym zbieraniem danych.",
      "Alerty operacyjne: spadek konwersji, wyczerpany budżet, błąd pomiaru.",
    ],
    deliverables: [
      "Diagram procesu „przed i po” z policzonym czasem pracy.",
      "Działające scenariusze na Twoich kontach, z dokumentacją i planem awaryjnym.",
      "Szkolenie zespołu, żeby drobne zmiany robiliście bez nas.",
      "Miesięczny przegląd błędów i kolejki automatyzacji do wdrożenia.",
    ],
    billing:
      "Rozliczenie: godziny odzyskane / miesiąc · wdrożenie 2–6 tygodni · scenariusze zostają Twoją własnością",
  },
  {
    id: "ai",
    index: "U 05",
    title: "Wdrożenia AI w marketingu i sprzedaży",
    lead: "Nie „wdrażamy AI”. Wskazujemy trzy miejsca, w których model zarabia lub oszczędza, i tam go wpinamy.",
    short:
      "Modele językowe wpięte w Twoje dane i procesy: opisy produktów, kwalifikacja leadów, analiza kampanii.",
    tags: ["LLM", "RAG", "Agenci", "Feed AI"],
    work: [
      "Warsztat: lista procesów z policzonym czasem, kosztem i ryzykiem błędu.",
      "Asystenci oparci na Twojej wiedzy (RAG): oferty, dokumentacja, baza produktów.",
      "Generowanie i tłumaczenie opisów produktów w skali tysięcy SKU, z kontrolą jakości.",
      "Kwalifikacja i wzbogacanie leadów, streszczenia rozmów, propozycje kolejnego kroku.",
      "Analiza kampanii i kreacji przez model — z człowiekiem podejmującym decyzję.",
    ],
    deliverables: [
      "Prototyp na Twoich danych w 2–3 tygodnie, zanim podejmiesz decyzję o skali.",
      "Ocenę jakości odpowiedzi na zestawie testowym, a nie wrażenie „działa fajnie”.",
      "Politykę użycia danych i kosztu tokenów — wiesz, za co płacisz co miesiąc.",
      "Dokumentację promptów i procesów, z możliwością przejęcia przez Twój zespół.",
    ],
    billing:
      "Rozliczenie: koszt procesu przed vs. po · pilotaż 3 tygodnie · dane nie trafiają do trenowania modeli",
  },
  {
    id: "social",
    index: "U 06",
    title: "Obsługa social mediów",
    lead: "Profil to nie kalendarz publikacji, tylko laboratorium kreacji, które zasila kampanie płatne.",
    short:
      "Produkcja kreacji dla algorytmu: dużo wariantów, szybka rotacja hooków, wnioski wracające do kampanii płatnych.",
    tags: ["Strategia", "Kreacje", "UGC", "Community"],
    work: [
      "Strategia komunikacji oparta na tym, o co klienci realnie pytają przed zakupem.",
      "Produkcja materiałów: krótkie wideo, karuzele, statyki, formaty UGC.",
      "Testowanie hooków w organiku i przenoszenie zwycięzców do kampanii płatnych.",
      "Moderacja i odpowiadanie na wiadomości w ustalonym czasie reakcji.",
      "Współpraca z twórcami: dobór, brief, rozliczenie efektu.",
    ],
    deliverables: [
      "Kwartalną strategię z filarami treści i podziałem formatów.",
      "Stały strumień kreacji gotowych do użycia także w reklamie.",
      "Raport skuteczności hooków i tematów, nie tylko liczby obserwujących.",
      "Bibliotekę materiałów w Twoim dysku, z prawami do dalszego użycia.",
    ],
    billing:
      "Rozliczenie: zasięg płatny wsparty organiką + koszt kreacji · rytm tygodniowy · prawa do materiałów po Twojej stronie",
  },
];
