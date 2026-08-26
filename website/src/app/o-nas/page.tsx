import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Kliqa pracuje jak zespół produktowy: hipoteza, wdrożenie, pomiar, decyzja. Zasady, granice i stack agencji.",
};

const wrap = "mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter)]";
const section = "py-[var(--section-gap)]";

const RULES = [
  ["01", "Pomiar przed budżetem", "Nie uruchamiamy kampanii na koncie, które nie mierzy poprawnie konwersji. To nie jest opóźnienie startu — to warunek, żeby cokolwiek z tego wynikało."],
  ["02", "Hipoteza zamiast opinii", "„Wydaje mi się, że ta grafika jest lepsza” nie jest argumentem. Argumentem jest test z zapisaną hipotezą i progiem istotności."],
  ["03", "Wszystko na Twoich kontach", "Konta reklamowe, analityka, domena, automatyzacje i kreacje są Twoje. Nie budujemy uzależnienia od agencji jako modelu biznesowego."],
  ["04", "Gasimy to, co nie zarabia", "Także wtedy, gdy kampania jest efektowna, a klientowi się podoba. Utrzymywanie ładnych, nierentownych działań to najdroższa uprzejmość w tej branży."],
  ["05", "Mówimy „nie umiemy”", "Jeśli problem leży poza naszymi kompetencjami albo poza marketingiem — powiemy to wprost i wskażemy kogoś lepszego. Wolimy stracić zlecenie, niż wziąć pieniądze za coś, czego nie dowieziemy."],
  ["06", "Bez prowizji od budżetu", "Nasze wynagrodzenie nie jest procentem od tego, ile wydasz na reklamę. Nie mamy więc żadnego powodu, żeby podbijać budżet bez uzasadnienia w liczbach."],
];

const FACTS = [
  ["48h", "Pierwszy audyt", "Tyle zajmuje nam przegląd konta i pomiaru, zanim w ogóle porozmawiamy o umowie."],
  ["14 dni", "Długość cyklu", "Hipoteza → wdrożenie → pomiar → decyzja o skalowaniu lub wyłączeniu."],
  ["0", "Raportów PDF", "Dostajesz dashboard z dostępem 24/7 i komentarz od człowieka."],
  ["100%", "Twoje konta", "Reklamy, analityka, domena i automatyzacje należą do Ciebie."],
];

const NOPE = [
  ["Nie sprzedajemy pakietów godzin.", "Rozliczamy się z zakresu i wskaźnika, a nie z tego, ile czasu ktoś spędził w panelu."],
  ["Nie obiecujemy pozycji nr 1.", "Nikt nie kontroluje rankingu Google, a agencja, która to gwarantuje, sprzedaje Ci loterię."],
  ["Nie kupujemy ruchu z farm.", "Wykres pójdzie w górę, sprzedaż nie. Widzieliśmy to wystarczająco wiele razy."],
  ["Nie raportujemy „zasięgów” jako wyniku.", "Zasięg jest kosztem dotarcia, nie efektem biznesowym."],
  ["Nie wdrażamy AI dla samego wdrożenia.", "Jeśli model nie skraca procesu ani nie obniża kosztu, to jest to droga zabawka."],
  ["Nie zaczynamy od redesignu strony.", "Najpierw sprawdzamy, czy obecna strona faktycznie jest wąskim gardłem. Zwykle nie jest."],
];

const STACK = [
  ["Pomiar i dane", ["GA4", "GTM", "GTM Server-side", "BigQuery", "Looker Studio", "Consent Mode v2"]],
  ["Reklama", ["Google Ads", "Performance Max", "Meta Ads", "TikTok Ads", "Merchant Center", "Demand Gen"]],
  ["Web", ["Next.js", "TypeScript", "Shopify", "WooCommerce", "Vercel", "Core Web Vitals"]],
  ["Automatyzacja i AI", ["n8n", "Make", "HubSpot", "Claude", "GPT", "RAG"]],
] as const;

const tag =
  "rounded-[2px] border border-iron px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-smoke";

export default function ONas() {
  return (
    <main>
      <section className="border-b border-graphite py-[clamp(56px,8vw,96px)]">
        <div className={wrap}>
          <p className="eyebrow">[ O NAS ]</p>
          <h1 className="display mt-6">
            Zaczynamy od arkusza,
            <br />
            nie od <span className="accent">moodboardu</span>.
          </h1>
          <p className="mt-7 max-w-[58ch] text-[16px] leading-relaxed text-bone">
            Jesteśmy agencją marketingową dla firm, które chcą wiedzieć, za co dokładnie płacą. Pracujemy
            jak zespół produktowy: hipoteza, wdrożenie, pomiar, decyzja. Bez tego cyklu marketing jest
            tylko kosztem z ładną prezentacją.
          </p>
        </div>
      </section>

      <section className={`${wrap} ${section}`}>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-4 text-[15px] leading-[1.75] text-bone [&>p]:max-w-[62ch]">
            <p>
              Kliqa powstała z irytacji. Zbyt wiele razy widzieliśmy ten sam scenariusz: kolorowy raport na
              koniec miesiąca, rosnące „zasięgi”, spadająca sprzedaż i nikt, kto potrafiłby połączyć jedno
              z drugim. Sam raport nigdy nie wygenerował ani jednej złotówki.
            </p>
            <p>
              Nazwa nie jest przypadkowa. Kliknięcie to najmniejsza jednostka, w której da się zmierzyć
              marketing — i pierwsze miejsce, w którym zaczyna się przeciek. Ktoś kliknął, ale strona
              ładowała się cztery sekundy. Kliknął, ale trafił na formularz, który nie zapisał zdarzenia.
              Kliknął, kupił, a system przypisał sprzedaż złemu kanałowi.
            </p>
            <blockquote className="my-3 border-l-2 border-lime pl-5 font-serif text-[23px] font-light italic leading-snug text-chalk">
              Nie mamy zdania. Mamy hipotezę, test i wynik.
            </blockquote>
            <p>
              Pracujemy w cyklach dwutygodniowych. Każdy cykl to zestaw hipotez z przewidywanym wpływem na
              wynik. Część z nich upada i to jest wliczone w koszt — liczy się tempo uczenia się, nie liczba
              slajdów. Po każdym cyklu dostajesz notatkę decyzyjną: co włączamy, co gasimy i dlaczego.
            </p>
            <p>
              Nasz zespół to ludzie, którzy równie swobodnie czują się w Google Ads Editorze, w konsoli
              przeglądarki i w dokumentacji API. Dzięki temu wdrażamy rzeczy, które w klasycznej agencji
              kończą się zdaniem „to trzeba zgłosić do dewelopera”.
            </p>
          </div>

          <aside className="border border-graphite bg-onyx p-8">
            <h2 className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
              Jak to wygląda w praktyce
            </h2>
            {FACTS.map(([k, t, d]) => (
              <div key={t} className="flex gap-4 border-t border-graphite py-4 first:border-t-0 first:pt-0">
                <span className="min-w-[82px] font-mono text-[24px] leading-none text-lime tabular-nums">{k}</span>
                <span>
                  <strong className="mb-1 block text-[14px] font-medium text-chalk">{t}</strong>
                  <span className="text-[13px] leading-snug text-ash">{d}</span>
                </span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className={`${wrap} ${section} border-t border-graphite`}>
        <h2 className="h2 mb-11 border-b border-graphite pb-3.5">
          Zasady, których <span className="accent">nie łamiemy</span>.
        </h2>
        <div className="grid gap-px border border-graphite bg-graphite md:grid-cols-2 lg:grid-cols-3">
          {RULES.map(([n, t, d]) => (
            <article key={n} className="flex flex-col gap-3 bg-carbon p-8">
              <span className="font-mono text-[11px] tracking-[0.22em] text-lime">{n}</span>
              <h3 className="font-serif text-[24px] font-light leading-tight text-chalk">{t}</h3>
              <p className="text-[13.5px] leading-relaxed text-ash">{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${wrap} ${section} border-t border-graphite`}>
        <h2 className="h2 mb-11 border-b border-graphite pb-3.5">
          Czego <span className="accent">nie robimy</span>.
        </h2>
        <ul className="grid gap-3.5 md:grid-cols-2">
          {NOPE.map(([t, d]) => (
            <li key={t} className="flex gap-3.5 border border-graphite bg-onyx p-5 text-[14px] leading-relaxed text-bone">
              <span className="font-mono text-[13px] text-lime">✕</span>
              <span>
                <b className="font-medium text-chalk">{t}</b> {d}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${wrap} ${section} border-t border-graphite`}>
        <h2 className="h2 mb-11 border-b border-graphite pb-3.5">
          Czym <span className="accent">pracujemy</span>.
        </h2>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map(([label, items]) => (
            <div key={label}>
              <h3 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-fog">{label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((i) => (
                  <span key={i} className={tag}>
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-graphite bg-void">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-8 py-[clamp(48px,7vw,80px)]`}>
          <h2 className="h2 max-w-[18ch]">
            Sprawdźmy, ile <span className="accent">zostawiasz na stole</span>.
          </h2>
          <Link
            href="/#kontakt"
            className="inline-flex items-center gap-2.5 rounded-[4px] bg-lime px-6 py-3.5 text-[14px] font-medium tracking-[0.04em] text-black shadow-glow"
          >
            Porozmawiajmy →
          </Link>
        </div>
      </section>
    </main>
  );
}
