import Link from "next/link";
import { services } from "@/content/services";

export default function SiteFooter() {
  return (
    <footer className="border-t border-graphite py-12">
      <div className="mx-auto max-w-[var(--page-max)] px-[var(--gutter)]">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-[300px]">
            <Link href="/" className="flex items-center gap-[11px] text-chalk">
              <span className="brand-mark" aria-hidden="true" />
              <span className="text-[15px] font-semibold uppercase leading-none tracking-[0.3em]">Kliqa</span>
            </Link>
            <p className="mt-3 leading-relaxed text-ash">
              Agencja marketingowa dla firm, które chcą wiedzieć, za co dokładnie płacą.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-fog">Serwis</h2>
            {[
              ["/", "Strona główna"],
              ["/uslugi", "Usługi"],
              ["/o-nas", "O nas"],
              ["/edukacja", "Edukacja"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="text-[13px] text-ash hover:text-lime">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-fog">Usługi</h2>
            {services.map((s) => (
              <Link key={s.id} href={`/uslugi#${s.id}`} className="text-[13px] text-ash hover:text-lime">
                {s.title.split(" — ")[0]}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-fog">Kontakt</h2>
            <a href="mailto:biuro@kliqa.pl" className="text-[13px] text-ash hover:text-lime">
              biuro@kliqa.pl
            </a>
            <span className="text-[13px] text-ash">Poniedziałek – piątek, 9:00–17:00</span>
            <span className="text-[13px] text-ash">Polska · pracujemy zdalnie</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-graphite pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
          <span>© 2026 Kliqa</span>
          <span>[ Każde kliknięcie ma swój koszt ]</span>
        </div>
      </div>
    </footer>
  );
}
