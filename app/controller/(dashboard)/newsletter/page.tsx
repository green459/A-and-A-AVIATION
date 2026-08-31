import { Download, FileSpreadsheet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { parseListParams } from "@/lib/list-params";
import DataTable, { type DataTableColumn } from "../_components/DataTable";
import DeleteButton from "../_components/DeleteButton";
import { deleteSubscriber, toggleSubscriberActive } from "./actions";

export const metadata = { title: "Newsletter" };

interface Subscriber {
  id: string;
  email: string;
  source: string;
  isActive: boolean;
  createdAt: Date;
}

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    dir?: string;
    pageSize?: string;
  }>;
}) {
  const sp = await searchParams;
  const { page, q, dir, pageSize } = parseListParams(sp);

  const where: Prisma.NewsletterSubscriberWhereInput = q
    ? { email: { contains: q } }
    : {};

  const [subscribers, totalCount, activeCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: dir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsletterSubscriber.count({ where }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  const columns: DataTableColumn<Subscriber>[] = [
    {
      key: "email",
      label: "Email",
      render: (row) => <span className="font-medium text-gray-900">{row.email}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            row.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.isActive ? "Subscribed" : "Unsubscribed"}
        </span>
      ),
    },
    {
      key: "source",
      label: "Source",
      render: (row) => <span className="capitalize text-gray-500">{row.source}</span>,
    },
    {
      key: "createdAt",
      label: "Subscribed",
      render: (row) => row.createdAt.toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-4">
          <form action={toggleSubscriberActive}>
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="isActive" value={String(row.isActive)} />
            <button type="submit" className="font-medium text-navy hover:underline">
              {row.isActive ? "Unsubscribe" : "Resubscribe"}
            </button>
          </form>
          <DeleteButton
            id={row.id}
            action={deleteSubscriber}
            confirmLabel={`Remove ${row.email} from the newsletter list? This can't be undone.`}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-navy">Newsletter</h1>
          <p className="mt-1 text-sm text-gray-500">
            Subscribers from the footer newsletter form —{" "}
            <span className="font-semibold text-navy">{activeCount}</span> currently
            subscribed, {totalCount} total.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/controller/newsletter/export?format=csv"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            CSV
          </a>
          <a
            href="/controller/newsletter/export?format=xlsx"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </a>
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          basePath="/controller/newsletter"
          columns={columns}
          rows={subscribers}
          totalItems={totalCount}
          page={page}
          q={q}
          dir={dir}
          pageSize={pageSize}
          searchPlaceholder="Search by email…"
          dateSortLabel="Subscribed"
          getRowKey={(row) => row.id}
          emptyMessage="No newsletter subscribers yet."
        />
      </div>
    </div>
  );
}
