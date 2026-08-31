import Link from "next/link";
import { StickyNote } from "lucide-react";
import type { Inquiry } from "@/lib/generated/prisma/client";
import DataTable, { type DataTableColumn } from "../_components/DataTable";
import StatusBadge from "./StatusBadge";

/** Each row links to its own /controller/inquiries/[id] page — a real,
 * bookmarkable/shareable URL (also what notifications deep-link to)
 * instead of a client-side modal, so there's nothing here that needs to be
 * a Client Component. */
export default function InquiriesTable({
  rows,
  totalItems,
  page,
  q,
  dir,
  pageSize,
  extraParams,
}: {
  rows: Inquiry[];
  totalItems: number;
  page: number;
  q: string;
  dir: "asc" | "desc";
  pageSize: number;
  extraParams?: Record<string, string | undefined>;
}) {
  const columns: DataTableColumn<Inquiry>[] = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <Link
          href={`/controller/inquiries/${row.id}`}
          className="flex items-center gap-2 font-medium text-navy hover:underline"
        >
          {!row.isRead && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal"
              title="Unread"
            />
          )}
          {row.name}
          {row.notes && (
            <StickyNote
              className="h-3.5 w-3.5 shrink-0 text-gray-400"
              aria-label="Has notes"
            />
          )}
        </Link>
      ),
    },
    { key: "email", label: "Email", render: (row) => row.email },
    {
      key: "service",
      label: "Service",
      render: (row) => row.serviceCategory || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "received",
      label: "Received",
      render: (row) =>
        row.createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  return (
    <DataTable
      basePath="/controller/inquiries"
      columns={columns}
      rows={rows}
      totalItems={totalItems}
      page={page}
      q={q}
      dir={dir}
      pageSize={pageSize}
      searchPlaceholder="Search name, email, message…"
      getRowKey={(row) => row.id}
      emptyMessage="No inquiries here yet."
      extraParams={extraParams}
    />
  );
}
