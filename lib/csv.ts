export interface CsvColumn {
  key: string;
  label: string;
}

function escapeCsvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/["\r\n,]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(
  rows: Record<string, unknown>[],
  columns: CsvColumn[],
): string {
  const header = columns.map((c) => escapeCsvValue(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvValue(row[c.key])).join(","),
  );
  // Leading BOM so Excel opens UTF-8 CSVs (accented names, currency symbols)
  // without mangling the encoding.
  return "﻿" + [header, ...lines].join("\r\n");
}
