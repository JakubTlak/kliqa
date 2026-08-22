/**
 * Karuzela klientów. UWAGA: to nazwy poglądowe na czas budowy strony.
 * Przed publikacją podmień je na realne wdrożenia (nazwa + branża + zgoda na użycie logotypu).
 */

export type Client = { name: string; sector: string };

export const clientsArePlaceholders = true;

export const clients: Client[] = [
  { name: "Nordvelo", sector: "e-commerce · rowery" },
  { name: "Casa Moderna", sector: "meble · D2C" },
  { name: "Panoptik", sector: "SaaS · B2B" },
  { name: "Zielony Targ", sector: "food · marketplace" },
  { name: "Forma Studio", sector: "fitness · sieć klubów" },
  { name: "Helios Tech", sector: "OZE · leady" },
  { name: "Motus Logistics", sector: "TSL · B2B" },
  { name: "Lumen Dental", sector: "medycyna · sieć" },
  { name: "Atlas Tools", sector: "przemysł · B2B" },
  { name: "Solva Finance", sector: "fintech · leady" },
];
