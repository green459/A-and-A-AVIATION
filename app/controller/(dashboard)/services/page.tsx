import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { parseListParams } from "@/lib/list-params";
import DeleteButton from "../_components/DeleteButton";
import DataTable, { type DataTableColumn } from "../_components/DataTable";
import { deleteService } from "./actions";

export const metadata = { title: "Services" };

type Row = Awaited<ReturnType<typeof prisma.service.findMany>>[number];

export default async function ServicesListPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    dir?: string;
    pageSize?: string;
  }>;
}) {
  const { page, q, dir, pageSize } = parseListParams(await searchParams);

  const where: Prisma.ServiceWhereInput = q
    ? {
        OR: [
          { title: { contains: q } },
          { category: { contains: q } },
          { tagline: { contains: q } },
        ],
      }
    : {};

  const [services, totalCount] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: { createdAt: dir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.service.count({ where }),
  ]);

  const columns: DataTableColumn<Row>[] = [
    {
      key: "title",
      label: "Title",
      className: "font-medium text-gray-900",
      render: (row) => row.title,
    },
    { key: "category", label: "Category", render: (row) => row.category },
    { key: "order", label: "Order", render: (row) => row.order },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            row.isPublished
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.isPublished ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/controller/services/${row.id}/edit`}
            className="font-medium text-navy hover:underline"
          >
            Edit
          </Link>
          <DeleteButton
            id={row.id}
            action={deleteService}
            confirmLabel={`Delete "${row.title}"?`}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-navy">Services</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the services shown on the public site.
          </p>
        </div>
        <Link
          href="/controller/services/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover"
        >
          <Plus className="h-4 w-4" />
          New service
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          basePath="/controller/services"
          columns={columns}
          rows={services}
          totalItems={totalCount}
          page={page}
          q={q}
          dir={dir}
          pageSize={pageSize}
          searchPlaceholder="Search title, category…"
          getRowKey={(row) => row.id}
          emptyMessage="No services yet."
        />
      </div>
    </div>
  );
}
