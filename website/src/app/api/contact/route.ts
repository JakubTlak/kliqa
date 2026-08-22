import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

/**
 * Odbiór formularza kontaktowego -> e-mail na biuro@kliqa.pl.
 *
 * Wymagane zmienne środowiskowe (patrz .env.example):
 *   RESEND_API_KEY   — klucz z resend.com
 *   CONTACT_TO       — adres odbiorcy (domyślnie biuro@kliqa.pl)
 *   CONTACT_FROM     — adres nadawcy z domeny zweryfikowanej w Resend, np. formularz@kliqa.pl
 *
 * Bez zweryfikowanej domeny Resend odrzuci wysyłkę — weryfikacja DNS (SPF/DKIM)
 * jest pierwszym krokiem wdrożenia, nie ostatnim.
 */

const schema = z.object({
  name: z.string().trim().min(2, "Podaj imię i nazwisko."),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Sprawdź adres e-mail."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  site: z.string().trim().max(200).optional().or(z.literal("")),
  scope: z.array(z.string().max(60)).max(10).optional(),
  message: z.string().trim().min(10, "Opisz krótko, nad czym pracujesz."),
  consent: z.literal(true, { message: "Potrzebujemy zgody na kontakt." }),
  // Pułapka na boty: pole ukryte w CSS, człowiek go nie wypełni.
  website: z.string().max(0).optional(),
});

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Sprawdź formularz." }, { status: 422 });
  }

  const d = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Brak RESEND_API_KEY — zgłoszenie nie zostało wysłane:", d.email);
    return NextResponse.json(
      { error: "Wysyłka jest chwilowo niedostępna. Napisz na biuro@kliqa.pl." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO ?? "biuro@kliqa.pl";
  const from = process.env.CONTACT_FROM ?? "formularz@kliqa.pl";

  const rows: [string, string][] = [
    ["Imię i nazwisko", d.name],
    ["Firma", d.company || "—"],
    ["E-mail", d.email],
    ["Telefon", d.phone || "—"],
    ["Strona", d.site || "—"],
    ["Zakres", d.scope?.length ? d.scope.join(", ") : "—"],
  ];

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6;color:#111">
      <h2 style="font-size:16px;margin:0 0 12px">Nowe zapytanie ze strony kliqa.pl</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:16px 0 0;white-space:pre-wrap">${esc(d.message)}</p>
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from: `Kliqa — formularz <${from}>`,
      to: [to],
      replyTo: d.email,
      subject: `Zapytanie ze strony — ${d.name}${d.company ? ` (${d.company})` : ""}`,
      html,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${d.message}`,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("Resend nie przyjął wiadomości:", err);
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości. Napisz na biuro@kliqa.pl." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
