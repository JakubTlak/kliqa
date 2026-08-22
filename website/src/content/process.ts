/** Ścieżka współpracy — sześć kroków sterowanych scrollem w sekcji „Proces”. */

export type Step = {
  slug: string;
  label: string;
  meta: string;
  title: string;
  description: string;
  outcomes: string[];
};

export const steps: Step[] = [
  {
    slug: "kontakt",
    label: "Kontakt",
    meta: "Krok 01 · dzień 0 · 30 minut",
    title: "Kontakt",
    description:
      "Rozmowa bez prezentacji. Pytamy o marże, sezonowość, pojemność produkcji i o to, co już nie zadziałało. Jeśli widzimy, że nie jesteśmy właściwym partnerem — mówimy to na tej rozmowie, a nie po trzech miesiącach umowy.",
    outcomes: [
      "Ustalony cel biznesowy wyrażony liczbą, nie przymiotnikiem.",
      "Lista dostępów potrzebnych do audytu.",
      "Szczera ocena, czy warto zaczynać teraz.",
    ],
  },
  {
    slug: "audyt",
    label: "Audyt",
    meta: "Krok 02 · 48 godzin",
    title: "Audyt",
    description:
      "Wchodzimy w konta reklamowe, analitykę, stronę i dane sprzedażowe. Sprawdzamy, czy pomiar w ogóle mówi prawdę — bo zwykle to tu leży pierwszy problem. Wynikiem jest lista znalezisk uszeregowana według pieniędzy, nie według trudności.",
    outcomes: [
      "Raport znalezisk z oszacowanym wpływem finansowym.",
      "Weryfikacja pomiaru: zdarzenia, zgody, duplikaty konwersji.",
      "Szybkie poprawki możliwe do wdrożenia od razu.",
    ],
  },
  {
    slug: "strategia",
    label: "Strategia",
    meta: "Krok 03 · tydzień 1–2",
    title: "Strategia",
    description:
      "Zamieniamy znaleziska w plan: kanały, budżety, komunikaty, kolejność wdrożeń i progi decyzyjne. Każda hipoteza ma spodziewany efekt i sposób pomiaru, więc po fakcie da się uczciwie powiedzieć, czy zadziałała.",
    outcomes: [
      "Plan na 90 dni z podziałem budżetu i odpowiedzialnościami.",
      "Mapa komunikatów dopasowana do etapów decyzji zakupowej.",
      "Zdefiniowane progi: co uznajemy za sukces, a co za stop.",
    ],
  },
  {
    slug: "wdrozenie",
    label: "Wdrożenie",
    meta: "Krok 04 · tydzień 2–6",
    title: "Wdrożenie",
    description:
      "Budujemy: kampanie, strony docelowe, kreacje, automatyzacje i pomiar serwerowy. Pracujemy na wspólnej tablicy zadań, więc w każdej chwili widzisz, co jest w toku i co czeka na Twoją decyzję. Bez etapu „prosimy o cierpliwość”.",
    outcomes: [
      "Uruchomione kampanie i strony podpięte pod poprawny pomiar.",
      "Działające scenariusze automatyzacji i powiadomień.",
      "Dashboard startowy z linią bazową do porównań.",
    ],
  },
  {
    slug: "optymalizacja",
    label: "Optymalizacja",
    meta: "Krok 05 · cykl 14-dniowy",
    title: "Optymalizacja",
    description:
      "Tu dzieje się większość pracy. Testujemy kreacje, strony, struktury kampanii i grupy odbiorców — seriami, nie pojedynczo. Wyłączamy to, co nie zarabia, nawet jeśli komuś się podoba. Raz na kwartał sprawdzamy przyrostowość, żeby nie płacić za sprzedaż, która i tak by nastąpiła.",
    outcomes: [
      "Rejestr testów: hipoteza, wynik, decyzja.",
      "Stabilny koszt pozyskania przy rosnącym wolumenie.",
      "Notatka decyzyjna co dwa tygodnie, bez lania wody.",
    ],
  },
  {
    slug: "skalowanie",
    label: "Skalowanie",
    meta: "Krok 06 · kwartał 2 i dalej",
    title: "Skalowanie",
    description:
      "Kiedy jednostkowa ekonomia się spina, dokładamy paliwo: nowe rynki, nowe kanały, wyższe budżety i automatyzacje, które utrzymują jakość obsługi przy większym wolumenie. Skalujemy tylko to, co przeszło etap dowodu — i pilnujemy, żeby wzrost nie zjadł marży.",
    outcomes: [
      "Plan wejścia na kolejne rynki lub kanały.",
      "Prognoza budżetu i marży przy wyższym wolumenie.",
      "Procesy i automatyzacje odporne na wzrost liczby zamówień.",
    ],
  },
];
