const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Formats a count for tight UI spots (dashboard stat cards, chart totals):
 * under 1000 shows the exact number, 1000+ switches to a compact form —
 * 1200 -> "1.2K", 3000000 -> "3M". */
export function formatCompactNumber(value: number): string {
  if (value < 1000) return String(value);
  return compactFormatter.format(value);
}
