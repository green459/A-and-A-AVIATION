import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { toCsv, type CsvColumn } from "@/lib/csv";

const COLUMNS: CsvColumn[] = [
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "source", label: "Source" },
  { key: "createdAt", label: "Subscribed" },
];

export async function GET(request: NextRequest) {
  await requireAdmin();

  const format = request.nextUrl.searchParams.get("format") === "xlsx" ? "xlsx" : "csv";

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = subscribers.map((s) => ({
    email: s.email,
    status: s.isActive ? "Subscribed" : "Unsubscribed",
    source: s.source,
    createdAt: s.createdAt.toISOString(),
  }));

  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "xlsx") {
    const aoa = [
      COLUMNS.map((c) => c.label),
      ...rows.map((row) => COLUMNS.map((c) => row[c.key as keyof typeof row] ?? "")),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Newsletter");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="newsletter-${stamp}.xlsx"`,
      },
    });
  }

  const csv = toCsv(rows, COLUMNS);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-${stamp}.csv"`,
    },
  });
}
