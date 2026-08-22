"use client";

import { useState } from "react";

const SCOPES = [
  "Performance marketing",
  "Strona / sklep",
  "SEO",
  "Automatyzacja",
  "AI",
  "Social media",
];

const field =
  "w-full rounded-[4px] border border-graphite bg-onyx px-3.5 py-3 text-[14px] text-chalk transition-colors hover:border-slate focus:border-lime focus:bg-graphite focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.2em] text-ash";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");

    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      site: String(fd.get("site") ?? ""),
      scope: fd.getAll("scope").map(String),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Nie udało się wysłać wiadomości.");
      setState("sent");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Nie udało się wysłać wiadomości.");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-[4px] border border-lime bg-[rgba(197,255,74,0.06)] p-6">
        <h3 className="font-serif text-[26px] font-light text-chalk">Wiadomość poszła.</h3>
        <p className="mt-3 text-bone">
          Odpowiadamy w ciągu jednego dnia roboczego — zwykle pytaniami, bo pierwsza oferta bez
          znajomości Twoich liczb byłaby zgadywanką.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
      <div className="grid gap-[18px] sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={label} htmlFor="name">Imię i nazwisko *</label>
          <input id="name" name="name" required autoComplete="name" placeholder="Anna Kowalska" className={field} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={label} htmlFor="company">Firma</label>
          <input id="company" name="company" autoComplete="organization" placeholder="Nazwa firmy" className={field} />
        </div>
      </div>

      <div className="grid gap-[18px] sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={label} htmlFor="email">E-mail *</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="anna@firma.pl" className={field} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={label} htmlFor="phone">Telefon</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+48 600 000 000" className={field} />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2 border-0 p-0">
        <legend className={label}>Zakres współpracy</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCOPES.map((s) => (
            <label
              key={s}
              className="cursor-pointer rounded-[2px] border border-iron px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-smoke transition-colors hover:border-fog hover:text-bone has-checked:border-lime has-checked:text-lime"
            >
              <input type="checkbox" name="scope" value={s} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label className={label} htmlFor="site">Adres strony</label>
        <input id="site" name="site" placeholder="twojafirma.pl" className={field} />
      </div>

      <div className="flex flex-col gap-2">
        <label className={label} htmlFor="message">Opis *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Sprzedajemy meble w Polsce i Czechach. ROAS spadł z 6 do 3,2 w pół roku, nie wiemy dlaczego."
          className={`${field} min-h-[112px] resize-y leading-relaxed`}
        />
      </div>

      {/* Pułapka na boty — ukryta przed ludźmi, widoczna dla skryptów. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

      <label className="flex items-start gap-3 text-[12px] leading-relaxed text-ash">
        <input type="checkbox" name="consent" required className="mt-0.5 h-[15px] w-[15px] accent-lime" />
        <span>
          Zgadzam się na kontakt w sprawie mojego zapytania. Administratorem danych jest Kliqa; dane
          przetwarzamy wyłącznie w celu odpowiedzi na to zgłoszenie.
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center gap-2.5 rounded-[4px] bg-lime px-6 py-3.5 text-[14px] font-medium tracking-[0.04em] text-black shadow-glow transition-colors hover:bg-[#d5ff77] disabled:opacity-60"
        >
          {state === "sending" ? "Wysyłam…" : "Wyślij zapytanie →"}
        </button>
        <span className="font-mono text-[11px] tracking-[0.06em] text-ash">→ biuro@kliqa.pl</span>
      </div>

      {error && (
        <p role="alert" className="font-mono text-[11px] text-[#ff6b6b]">
          {error}
        </p>
      )}
    </form>
  );
}
