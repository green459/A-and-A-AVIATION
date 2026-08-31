import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { toCsv, type CsvColumn } from "@/lib/csv";
import type { InquiryStatus } from "@/lib/generated/prisma/enums";

const COLUMNS: CsvColumn[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "serviceCategory", label: "Service" },
  { key: "status", label: "Status" },
  { key: "message", label: "Message" },
  { key: "notes", label: "Internal notes" },
  { key: "source", label: "Source" },
  { key: "createdAt", label: "Received" },
];

const VALID_STATUSES: InquiryStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "ARCHIVED",
];

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  ARCHIVED: "Archived",
};

const NAVY = "1B365D";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "F3F4F6";
const GRAY_TEXT = "6B7280";
const BORDER_COLOR = "D1D5DB";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function thinBorder(): ExcelJS.Border {
  return {
    style: "thin",
    color: { argb: `FF${BORDER_COLOR}` },
  };
}

function dataRows(inquiries: Awaited<ReturnType<typeof fetchData>>) {
  return inquiries.map((inquiry) => ({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? "",
    serviceCategory: inquiry.serviceCategory ?? "",
    status: STATUS_LABELS[inquiry.status] ?? inquiry.status,
    message: inquiry.message ?? "",
    notes: inquiry.notes ?? "",
    source: inquiry.source,
    createdAt: formatDate(inquiry.createdAt.toISOString()),
  }));
}

async function fetchData(status?: InquiryStatus) {
  return prisma.inquiry.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

async function buildXlsx(
  inquiries: Awaited<ReturnType<typeof fetchData>>,
  statusLabel: string,
) {
  const rows = dataRows(inquiries);
  const exportDate = formatDateTime(new Date().toISOString());
  const totalText = `${rows.length} ${rows.length === 1 ? "inquiry" : "inquiries"}`;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "A&A Aviation";
  workbook.created = new Date();

  const ws = workbook.addWorksheet("Inquiries", {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  const colCount = COLUMNS.length;

  ws.columns = COLUMNS.map((c) => {
    const widths: Record<string, number> = {
      name: 22, email: 30, phone: 16, serviceCategory: 20,
      status: 14, message: 50, notes: 36, source: 14, createdAt: 16,
    };
    return { key: c.key, width: widths[c.key] ?? 16 };
  });

  ws.mergeCells(1, 1, 1, colCount);
  const titleCell = ws.getCell("A1");
  titleCell.value = "A&A Aviation — Inquiries Export";
  titleCell.font = { bold: true, size: 20, color: { argb: `FF${WHITE}` } };
  titleCell.fill = {
    type: "pattern", pattern: "solid",
    fgColor: { argb: `FF${NAVY}` },
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 36;

  ws.mergeCells(2, 1, 2, colCount);
  const metaCell = ws.getCell("A2");
  const metaText = `Exported: ${exportDate}  |  Total: ${totalText}${statusLabel ? `  |  Filter: ${statusLabel}` : ""}`;
  metaCell.value = metaText;
  metaCell.font = { italic: true, size: 9, color: { argb: `FF${GRAY_TEXT}` } };
  metaCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(2).height = 20;

  const headerRow = ws.getRow(3);
  COLUMNS.forEach((c, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = c.label;
    cell.font = { bold: true, size: 10, color: { argb: `FF${WHITE}` } };
    cell.fill = {
      type: "pattern", pattern: "solid",
      fgColor: { argb: `FF${NAVY}` },
    };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
      top: thinBorder(), bottom: thinBorder(),
      left: thinBorder(), right: thinBorder(),
    };
  });
  headerRow.height = 24;

  rows.forEach((row, idx) => {
    const excelRow = ws.getRow(idx + 4);
    const isEven = idx % 2 === 0;

    COLUMNS.forEach((c, colIdx) => {
      const cell = excelRow.getCell(colIdx + 1);
      cell.value = (row as Record<string, string>)[c.key] ?? "";
      cell.font = { size: 10 };
      cell.alignment = {
        vertical: "top",
        wrapText: c.key === "message" || c.key === "notes",
        horizontal: c.key === "status" || c.key === "createdAt" ? "center" : "left",
      };
      cell.border = {
        top: thinBorder(), bottom: thinBorder(),
        left: thinBorder(), right: thinBorder(),
      };

      if (isEven) {
        cell.fill = {
          type: "pattern", pattern: "solid",
          fgColor: { argb: `FF${LIGHT_GRAY}` },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export async function GET(request: NextRequest) {
  await requireAdmin();

  const format = request.nextUrl.searchParams.get("format") === "xlsx"
    ? "xlsx"
    : "csv";
  const statusParam = request.nextUrl.searchParams.get("status");
  const status = VALID_STATUSES.includes(statusParam as InquiryStatus)
    ? (statusParam as InquiryStatus)
    : undefined;

  const inquiries = await fetchData(status);
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "xlsx") {
    const statusLabel = status ? STATUS_LABELS[status] ?? status : "";
    const buffer = await buildXlsx(inquiries, statusLabel);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="inquiries-${stamp}.xlsx"`,
      },
    });
  }

  const rows = inquiries.map((inquiry) => ({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? "",
    serviceCategory: inquiry.serviceCategory ?? "",
    status: STATUS_LABELS[inquiry.status] ?? inquiry.status,
    message: inquiry.message ?? "",
    notes: inquiry.notes ?? "",
    source: inquiry.source,
    createdAt: formatDate(inquiry.createdAt.toISOString()),
  }));

  const csv = toCsv(rows, COLUMNS);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inquiries-${stamp}.csv"`,
    },
  });
}
