import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { parseListParams } from "@/lib/list-params";
import DeleteButton from "../_components/DeleteButton";
import DataTable, { type DataTableColumn } from "../_components/DataTable";
import { deleteDestination } from "./actions";

export const metadata = { title: "Destinations" };

type Row = Awaited<ReturnType<typeof prisma.destination.findMany>>[number];

export default async function DestinationsListPage({
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

  const where: Prisma.DestinationWhereInput = q
    ? {
        OR: [
          { country: { contains: q } },
          { region: { contains: q } },
          { tagline: { contains: q } },
        ],
      }
    : {};

  const [destinations, totalCount] = await Promise.all([
    prisma.destination.findMany({
      where,
      orderBy: { createdAt: dir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.destination.count({ where }),
  ]);

  const columns: DataTableColumn<Row>[] = [
    {
      key: "country",
      label: "Country",
      className: "font-medium text-gray-900",
      render: (row) => row.country,
    },
    { key: "region", label: "Region", render: (row) => row.region },
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
            href={`/controller/destinations/${row.id}/edit`}
            className="font-medium text-navy hover:underline"
          >
            Edit
          </Link>
          <DeleteButton
            id={row.id}
            action={deleteDestination}
            confirmLabel={`Delete "${row.country}"?`}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-navy">Destinations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the destinations shown on the public site.
          </p>
        </div>
        <Link
          href="/controller/destinations/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover"
        >
          <Plus className="h-4 w-4" />
          New destination
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          basePath="/controller/destinations"
          columns={columns}
          rows={destinations}
          totalItems={totalCount}
          page={page}
          q={q}
          dir={dir}
          pageSize={pageSize}
          searchPlaceholder="Search country, region…"
          getRowKey={(row) => row.id}
          emptyMessage="No destinations yet."
        />
      </div>
    </div>
  );
}
