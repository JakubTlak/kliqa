"use client";

import { useState } from "react";
import { filters, resources } from "@/content/education";

export default function EducationGrid() {
  const [active, setActive] = useState<string>("all");
  const visible = resources.filter((r) => active === "all" || r.category === active);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            className={`rounded-[2px] border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
              active === f.id
                ? "border-lime text-lime shadow-glow"
                : "border-iron text-smoke hover:border-fog hover:text-bone"
            }`}
          >
            {f.label}
            {f.id === "all" ? ` · ${resources.length}` : ""}
          </button>
        ))}
      </div>

      <div className="grid gap-px border border-graphite bg-graphite md:grid-cols-2">
        {visible.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 bg-carbon p-7 transition-colors hover:bg-onyx"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lime">{r.badge}</span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-fog">{r.year}</span>
            </div>
            <h2 className="font-serif text-[23px] font-light leading-snug text-chalk">{r.title}</h2>
            <p className="text-[13.5px] leading-relaxed text-ash">{r.takeaway}</p>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-graphite pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-smoke group-hover:text-pearl">
              <span>{r.source}</span>
              <span className="whitespace-nowrap text-lime">Źródło ↗</span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
