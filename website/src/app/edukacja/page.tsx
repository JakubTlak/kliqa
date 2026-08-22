import Link from "next/link";
import type { Metadata } from "next";
import EducationGrid from "@/components/EducationGrid";
import { checkedAt } from "@/content/education";

export const metadata: Metadata = {
  title: "Edukacja",
  description:
    "Dziesięć raportów i materiałów o performance marketingu, SEO, AI i pomiarze — z konkretną liczbą i linkiem do źródła.",
};

const wrap = "mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter)]";

export default function Edukacja() {
  return (
    <main>
      <section className="border-b border-graphite py-[clamp(56px,8vw,96px)]">
        <div className={wrap}>
          <p className="eyebrow">[ EDUKACJA ]</p>
          <h1 className="display mt-6">
            Dane, na których
            <br />
            <span className="accent">sami pracujemy</span>.
          </h1>
          <p className="mt-7 max-w-[58ch] text-[16px] leading-relaxed text-bone">
            Dziesięć raportów i materiałów, do których wracamy przy planowaniu budżetów i wdrożeń. Każdy
            z konkretną liczbą, którą warto znać, i linkiem do źródła — czytaj u autorów, nie w streszczeniu
            z LinkedIna.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
            <span>Stan na {checkedAt}</span>
            <span>Liczby weryfikujemy przy każdej aktualizacji</span>
          </div>
        </div>
      </section>

      <section className={`${wrap} py-[var(--section-gap)]`}>
        <EducationGrid />
      </section>

      <section className="border-t border-graphite bg-void">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-8 py-[clamp(48px,7vw,80px)]`}>
          <h2 className="h2 max-w-[18ch]">
            Chcesz te liczby <span className="accent">na swoim koncie</span>?
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
