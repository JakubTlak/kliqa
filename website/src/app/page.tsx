import Link from "next/link";
import HeroStage from "@/components/HeroStage";
import ContactForm from "@/components/ContactForm";
import { services } from "@/content/services";
import { steps } from "@/content/process";
import { clients } from "@/content/clients";

/**
 * Strona główna. Zakres jest celowo wąski: slogan + globus, przejście do drugiego
 * sloganu z CTA, segmenty usług, droga współpracy, karuzela klientów, formularz.
 * Opisy usług, historia agencji i materiały edukacyjne mają własne podstrony —
 * nie wolno ich tu dokładać (patrz PLAN.md, sekcja „Architektura serwisu”).
 */

const wrap = "mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter)]";
const section = "py-[var(--section-gap)]";

function SectionHead({ title, index }: { title: React.ReactNode; index: string }) {
  return (
    <div className="mb-11 flex items-baseline justify-between gap-6 border-b border-graphite pb-3.5">
      <h2 className="h2">{title}</h2>
      <span className="whitespace-nowrap font-mono text-[11px] tracking-[0.22em] text-fog">{index}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section id="hero">
        <HeroStage>
          <p className="eyebrow">[ PERFORMANCE · DANE · AUTOMATYZACJA ]</p>
          <h1 className="display">
            Zamieniamy kliknięcia
            <br />w <span className="accent">przychód</span>.
          </h1>
          <p className="max-w-[54ch] text-[15px] leading-relaxed text-pearl">
            Każde kliknięcie ma swój koszt i swoją wartość. My mierzymy oba — i pilnujemy różnicy.
          </p>
          <Link
            href="#kontakt"
            className="mt-2 inline-flex items-center gap-2.5 rounded-[4px] bg-lime px-6 py-3.5 text-[14px] font-medium tracking-[0.04em] text-black shadow-glow"
          >
            Porozmawiajmy →
          </Link>
        </HeroStage>
      </section>

      <section id="zakres" className={`${wrap} ${section}`}>
        <SectionHead
          index="01 / ZAKRES"
          title={
            <>
              Sześć dźwigni.
              <br />
              Jeden <span className="accent">wspólny wskaźnik</span>.
            </>
          }
        />
        <div className="grid gap-px border border-graphite bg-graphite sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.id}
              href={`/uslugi#${s.id}`}
              className="group flex min-h-[262px] flex-col gap-3.5 bg-carbon p-8 transition-colors hover:bg-onyx"
            >
              <span className="font-mono text-[11px] tracking-[0.22em] text-fog">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-[25px] font-light leading-tight text-chalk">
                {s.title.split(" — ")[0]}
              </h3>
              <p className="text-ash">{s.short}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {s.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-[2px] border border-iron px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-smoke"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="mt-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog transition-colors group-hover:text-lime">
                Zobacz zakres →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="proces" className={`${wrap} ${section} border-t border-graphite`}>
        <SectionHead
          index="02 / PROCES"
          title={
            <>
              Droga współpracy.
              <br />
              Sześć kroków, <span className="accent">zero mgły</span>.
            </>
          }
        />
        {/* TODO (etap 2): ścieżka sterowana scrollem — szyna z kursorem i przełączane panele,
            tak jak w prototypie w /prototype.html. Tu na razie pełna lista kroków. */}
        <ol className="flex flex-col gap-11">
          {steps.map((st) => (
            <li key={st.slug} className="grid gap-6 border-l border-graphite pl-5 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-lime">{st.meta}</p>
                <h3 className="mb-3.5 font-serif text-[clamp(28px,4vw,44px)] font-light leading-none text-chalk">
                  {st.title}
                </h3>
                <p className="max-w-[46ch] text-[15px] leading-relaxed text-bone">{st.description}</p>
              </div>
              <div className="border border-graphite bg-onyx p-6">
                <h4 className="mb-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-fog">
                  Efekt kroku
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {st.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-[13.5px] leading-snug text-bone">
                      <span className="text-lime">›</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="overflow-hidden border-y border-graphite py-16">
        <div className={wrap}>
          <h2 className="h2">
            Marki, które <span className="accent">skalowaliśmy</span>.
          </h2>
        </div>
        <div className="mt-9 flex gap-3.5 overflow-x-auto px-[var(--gutter)] pb-2">
          {clients.map((c) => (
            <div
              key={c.name}
              className="grid h-24 w-[210px] flex-none place-items-center gap-0.5 rounded border border-graphite bg-onyx p-3"
            >
              <span className="text-center text-[15px] font-semibold uppercase tracking-[0.12em] text-pearl">
                {c.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-fog">{c.sector}</span>
            </div>
          ))}
        </div>
        <div className={wrap}>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
            [ Logotypy poglądowe — do podmiany na realne wdrożenia przed publikacją ]
          </p>
        </div>
      </section>

      <section id="kontakt" className={`${section} border-t border-graphite bg-void`}>
        <div className={wrap}>
          <SectionHead
            index="03 / KONTAKT"
            title={
              <>
                Napisz do nas.
                <br />
                Odpiszemy <span className="accent">konkretem</span>.
              </>
            }
          />
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="max-w-[44ch] text-[14.5px] leading-relaxed text-ash">
                Wypełnij formularz albo napisz bezpośrednio na maila. Odpowiadamy w ciągu jednego dnia
                roboczego — zwykle pytaniami, bo pierwsza oferta bez znajomości Twoich liczb byłaby zgadywanką.
              </p>
              <a
                href="mailto:biuro@kliqa.pl"
                className="mt-7 inline-flex border-b border-[rgba(197,255,74,0.35)] pb-1 font-mono text-[15px] text-lime hover:border-lime"
              >
                biuro@kliqa.pl ↗
              </a>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  ["01", "Odpowiedź w 1 dzień roboczy, od człowieka z zespołu prowadzącego projekt."],
                  ["02", "Bezpłatny przegląd konta i pomiaru przed jakąkolwiek umową."],
                  ["03", "Umowy bez sztywnego okresu wypowiedzenia liczonego w kwartałach."],
                  ["04", "Nie obsługujemy bezpośredniej konkurencji naszych klientów w tej samej kategorii."],
                ].map(([n, t]) => (
                  <div key={n} className="flex items-baseline gap-3 text-[13px] text-ash">
                    <span className="font-mono text-[11px] text-lime">{n}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
