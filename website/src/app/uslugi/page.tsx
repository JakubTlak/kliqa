import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Usługi",
  description:
    "Performance marketing, strony i sklepy, SEO i widoczność w AI, automatyzacja procesów, wdrożenia AI oraz social media — zakres, rezultaty i wskaźnik rozliczenia.",
};

const wrap = "mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter)]";

export default function Uslugi() {
  return (
    <main>
      <section className="border-b border-graphite py-[clamp(56px,8vw,96px)]">
        <div className={wrap}>
          <p className="eyebrow">[ USŁUGI ]</p>
          <h1 className="display mt-6">
            Usługi opisane tak,
            <br />
            jak je <span className="accent">rozliczamy</span>.
          </h1>
          <p className="mt-7 max-w-[58ch] text-[16px] leading-relaxed text-bone">
            Każda usługa ma zakres prac, konkretne rezultaty i wskaźnik, na którym się rozliczamy. Nic tu
            nie jest „w ramach współpracy” — wszystko ma nazwę, termin i właściciela.
          </p>
        </div>
      </section>

      <section className={`${wrap} py-[var(--section-gap)]`}>
        <nav aria-label="Lista usług" className="mb-14 flex flex-wrap gap-2">
          {services.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-[2px] border border-iron px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-smoke transition-colors hover:border-lime hover:text-lime"
            >
              {String(i + 1).padStart(2, "0")} · {s.title.split(" — ")[0]}
            </a>
          ))}
        </nav>

        {services.map((s) => (
          <article key={s.id} id={s.id} className="border-t border-graphite py-[clamp(44px,6vw,72px)] first:border-t-0">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-5">
              <div>
                <p className="eyebrow mb-3">{s.index}</p>
                <h2 className="font-serif text-[clamp(23px,2.8vw,30px)] font-light leading-tight text-chalk">
                  {s.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-[2px] border border-iron px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-smoke"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p className="mb-7 max-w-[58ch] text-[16px] leading-relaxed text-bone">{s.lead}</p>

            <div className="grid gap-8 md:grid-cols-2 md:gap-16">
              <div>
                <h3 className="mb-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-fog">
                  Co robimy
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {s.work.map((w) => (
                    <li
                      key={w}
                      className="relative pl-[18px] text-[13.5px] leading-relaxed text-bone before:absolute before:left-0 before:top-[9px] before:h-px before:w-[7px] before:bg-lime"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-fog">
                  Co dostajesz
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {s.deliverables.map((d) => (
                    <li
                      key={d}
                      className="relative pl-[18px] text-[13.5px] leading-relaxed text-bone before:absolute before:left-0 before:top-[9px] before:h-px before:w-[7px] before:bg-lime"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-graphite pt-4 font-mono text-[11px] leading-relaxed text-smoke">
                  {s.billing}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="border-t border-graphite bg-void">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-8 py-[clamp(48px,7vw,80px)]`}>
          <h2 className="h2 max-w-[18ch]">
            Nie wiesz, od czego <span className="accent">zacząć</span>?
          </h2>
          <Link
            href="/#kontakt"
            className="inline-flex items-center gap-2.5 rounded-[4px] bg-lime px-6 py-3.5 text-[14px] font-medium tracking-[0.04em] text-black shadow-glow"
          >
            Zamów bezpłatny audyt →
          </Link>
        </div>
      </section>
    </main>
  );
}
