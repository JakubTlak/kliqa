"use client";

import { useCallback, useState } from "react";
import Globe from "./Globe";

/**
 * Scena hero: globus + licznik kliknięć zarejestrowanych w tej sesji.
 * Licznik pokazuje realne zdarzenia na stronie — nie jest ozdobną liczbą z sufitu.
 *
 * TODO (etap 2): choreografia scrolla — przejście z pierwszego sloganu na drugi
 * sterowane postępem przewijania (motion + lenis, obie biblioteki są już w zależnościach).
 */
export default function HeroStage({ children }: { children: React.ReactNode }) {
  const [clicks, setClicks] = useState(0);
  const onCount = useCallback((n: number) => setClicks(n), []);

  return (
    <div className="relative grid min-h-[620px] place-items-center overflow-hidden bg-void [height:100svh]">
      <Globe onClickCountChange={onCount} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 46%, rgba(0,0,0,.72) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,0) 72%)",
        }}
      />
      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-6 px-[var(--gutter)] text-center [&_a]:pointer-events-auto">
        {children}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 px-[var(--gutter)] pb-7 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
        <div>
          <div>[ Śledzimy każde kliknięcie ]</div>
          <div className="mt-2 text-smoke">Kliknij planetę · przeciągnij, aby obrócić</div>
        </div>
        <div className="text-right">
          <div>Kliknięcia w tej sesji</div>
          <div className="text-[26px] leading-none tracking-normal text-lime tabular-nums">
            {clicks.toLocaleString("pl-PL")}
          </div>
        </div>
      </div>
    </div>
  );
}
