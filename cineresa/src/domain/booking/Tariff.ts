export type Tariff = "NORMAL" | "STUDENT";

// Comme le legacy : tout tarif autre que STUDENT est traité comme NORMAL.
export function parseTariff(requested?: string): Tariff {
  return requested === "STUDENT" ? "STUDENT" : "NORMAL";
}
