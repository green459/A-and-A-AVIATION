import Link from "next/link";
import { Download, FileSpreadsheet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { InquiryStatus } from "@/lib/generated/prisma/enums";
import type { Prisma } from "@/lib/generated/prisma/client";
import { parseListParams } from "@/lib/list-params";
import InquiriesTable from "./InquiriesTable";

export const metadata = { title: "Inquiries" };

const FILTERS: { label: string; value: InquiryStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Archived", value: "ARCHIVED" },
];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    page?: string;
    q?: string;
    dir?: string;
    pageSize?: string;
  }>;
}) {
  const sp = await searchParams;
  const { page, q, dir, pageSize } = parseListParams(sp);
  const activeStatus = FILTERS.some((f) => f.value === sp.status)
    ? (sp.status as InquiryStatus | "ALL")
    : "ALL";

  const where: Prisma.InquiryWhereInput = {
    ...(activeStatus === "ALL" ? {} : { status: activeStatus }),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { message: { contains: q } },
            { serviceCategory: { contains: q } },
          ],
        }
      : {}),
  };

  const [inquiries, totalCount] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: dir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.inquiry.count({ where }),
  ]);

  const exportQuery = activeStatus === "ALL" ? "" : `&status=${activeStatus}`;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-navy">Inquiries</h1>
          <p className="mt-1 text-sm text-gray-500">
            Messages submitted through the public contact form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/controller/inquiries/export?format=csv${exportQuery}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            CSV
          </a>
          <a
            href={`/controller/inquiries/export?format=xlsx${exportQuery}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "ALL"
                ? "/controller/inquiries"
                : `/controller/inquiries?status=${filter.value}`
            }
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeStatus === filter.value
                ? "bg-navy text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            } border border-gray-200`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <InquiriesTable
          rows={inquiries}
          totalItems={totalCount}
          page={page}
          q={q}
          dir={dir}
          pageSize={pageSize}
          extraParams={
            activeStatus === "ALL" ? undefined : { status: activeStatus }
          }
        />
      </div>
    </div>
  );
}
