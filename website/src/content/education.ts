/**
 * Sekcja „Edukacja” — dziesięć materiałów źródłowych z konkretną liczbą i linkiem
 * do autora. Wszystkie dane pochodzą z publikacji zewnętrznych; przy aktualizacji
 * sprawdź, czy liczba nadal zgadza się ze źródłem, i podnieś `checkedAt`.
 */

export type Resource = {
  category: "paid" | "seo" | "ai" | "data";
  badge: string;
  year: string;
  title: string;
  takeaway: string;
  source: string;
  url: string;
};

export const checkedAt = "2026-08-21";

export const filters = [
  { id: "all", label: "Wszystko" },
  { id: "paid", label: "Płatne media" },
  { id: "seo", label: "SEO i WWW" },
  { id: "ai", label: "AI i automatyzacja" },
  { id: "data", label: "Dane i pomiar" },
] as const;

export const resources: Resource[] = [
  {
    category: "paid",
    badge: "Płatne media",
    year: "2026",
    title: "Google Ads Benchmarks 2026",
    takeaway:
      "Średni koszt kliknięcia w sieci wyszukiwania wzrósł o 12% rok do roku, do 2,96 USD — najostrzejsza podwyżka od 2021 r. Rozpiętość między branżami jest ogromna: usługi prawne przekraczają 6 USD, e-commerce zostaje poniżej 1,2 USD.",
    source: "WordStream",
    url: "https://www.wordstream.com/blog/2026-google-ads-benchmarks",
  },
  {
    category: "paid",
    badge: "Płatne media",
    year: "2026",
    title: "Paid Social Playbook — era Andromedy",
    takeaway:
      "Po zmianie silnika rekomendacji Meta liczy się różnorodność kreacji, nie liczba zestawów reklam. Jeden zestaw z 25 różnymi kreacjami pobił układ 5×5 o 17% konwersji przy 16% niższym koszcie.",
    source: "Logical Position",
    url: "https://www.logicalposition.com/blog/the-2026-paid-social-playbook",
  },
  {
    category: "paid",
    badge: "Social",
    year: "2026",
    title: "TikTok Next 2026 — trendy dla marketerów",
    takeaway:
      "Szósta edycja prognozy TikToka pod hasłem „Irreplaceable Instinct”: koniec biernej konsumpcji, przewagę zdobywają marki pokazujące proces i ludzi zamiast dopracowanej perfekcji.",
    source: "TikTok for Business",
    url: "https://ads.tiktok.com/business/en/next",
  },
  {
    category: "seo",
    badge: "SEO",
    year: "2025–26",
    title: "AI Overviews a klikalność wyników",
    takeaway:
      "Na próbie setek tysięcy słów kluczowych obecność odpowiedzi AI oznacza o 58% niższy CTR dla strony z pierwszej pozycji. Zapytania informacyjne tracą najwięcej, transakcyjne poniżej 10%.",
    source: "Ahrefs",
    url: "https://ahrefs.com/blog/ai-overviews-reduce-clicks-update",
  },
  {
    category: "seo",
    badge: "WWW",
    year: "Google",
    title: "Core Web Vitals — LCP, INP, CLS",
    takeaway:
      "Oficjalna dokumentacja progów: LCP poniżej 2,5 s, INP poniżej 200 ms, CLS poniżej 0,1. INP zastąpił FID i mierzy realną responsywność interfejsu.",
    source: "web.dev / Google",
    url: "https://web.dev/articles/vitals",
  },
  {
    category: "ai",
    badge: "AI",
    year: "2026",
    title: "State of Marketing 2026",
    takeaway:
      "Badanie na ponad 1500 marketerach: 86,4% korzysta już z narzędzi AI (dwa lata wcześniej 41%), a największym wyzwaniem pozostaje pomiar zwrotu z marketingu — wskazuje go 33% zespołów.",
    source: "HubSpot",
    url: "https://blog.hubspot.com/marketing/hubspot-blog-marketing-industry-trends-report",
  },
  {
    category: "ai",
    badge: "AI",
    year: "2025–26",
    title: "The State of AI — agenci w firmach",
    takeaway:
      "Tylko 23% organizacji skaluje agentów AI w co najmniej jednej funkcji, a 39% dopiero eksperymentuje. Bariery są organizacyjne, nie technologiczne.",
    source: "McKinsey & Company",
    url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
  },
  {
    category: "ai",
    badge: "Automatyzacja",
    year: "2026",
    title: "Benchmarki e-mail i automatyzacji",
    takeaway:
      "Wiadomości automatyczne konwertują kilkanaście razy lepiej niż zwykłe kampanie (1,49% vs 0,08%), a porzucony koszyk i sekwencja powitalna odpowiadają za ok. 76% zamówień generowanych przez automaty.",
    source: "Omnisend",
    url: "https://www.omnisend.com/blog/email-marketing-benchmarks/",
  },
  {
    category: "data",
    badge: "Pomiar",
    year: "2026",
    title: "Consent Mode v2 i pomiar serwerowy",
    takeaway:
      "Konta bez poprawnej konfiguracji tracą od 15 do 40% mierzalnych konwersji w Europie, a tych danych nie da się odzyskać wstecznie.",
    source: "Stape",
    url: "https://stape.io/blog/google-consent-mode-v2",
  },
  {
    category: "data",
    badge: "Rynek PL",
    year: "2026",
    title: "Omni-commerce. Kupuję wygodnie 2026",
    takeaway:
      "93% polskich internautów kupuje online, a udział osób robiących zakupy transgraniczne co najmniej raz w tygodniu wzrósł z 10% do 17%. Dwie trzecie klientów kupuje te same marki online i offline.",
    source: "Izba Gospodarki Elektronicznej",
    url: "https://eizba.pl/2026-rok-intensyfikacji-zakupow-cyfrowych-i-inteligentnych/",
  },
];
