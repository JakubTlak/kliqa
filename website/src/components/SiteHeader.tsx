"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/uslugi", label: "Usługi" },
  { href: "/o-nas", label: "O nas" },
  { href: "/edukacja", label: "Edukacja" },
  { href: "/#kontakt", label: "Kontakt" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-graphite bg-black/95">
      <div className="mx-auto flex h-16 max-w-[var(--page-max)] items-center justify-between gap-6 px-[var(--gutter)]">
        <Link href="/" className="flex items-center gap-[11px] text-chalk" aria-label="Kliqa — strona główna">
          <span className="brand-mark" aria-hidden="true" />
        </Link>

        <nav className="hidden items-center gap-[30px] lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-lime ${
                pathname === l.href ? "text-lime" : "text-chalk"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#kontakt"
          className="hidden rounded-[4px] border border-lime px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.08em] text-lime shadow-glow transition-colors hover:bg-[rgba(197,255,74,0.09)] sm:inline-block"
        >
          Porozmawiajmy
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-[4px] border border-slate px-3 py-2 text-[11px] uppercase tracking-[0.18em] lg:hidden"
        >
          Menu
        </button>
      </div>

      {open && (
        <nav className="border-t border-graphite bg-void lg:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-graphite px-[var(--gutter)] py-4 text-[13px] font-medium uppercase tracking-[0.18em] text-chalk"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
