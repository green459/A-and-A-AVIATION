import { CheckCheck } from "lucide-react";
import { parseListParams } from "@/lib/list-params";
import { getNotificationsPage } from "@/lib/data/notifications";
import type { Notification } from "@/lib/generated/prisma/client";
import DataTable, { type DataTableColumn } from "../_components/DataTable";
import { openNotification, markAllNotificationsRead } from "./actions";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; dir?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { page, q, dir, pageSize } = parseListParams(sp);
  const { rows, totalItems } = await getNotificationsPage({ page, pageSize, q });

  const columns: DataTableColumn<Notification>[] = [
    {
      key: "message",
      label: "Notification",
      render: (row) => (
        <form action={openNotification}>
          <input type="hidden" name="id" value={row.id} />
          {row.inquiryId && (
            <input type="hidden" name="inquiryId" value={row.inquiryId} />
          )}
          <button
            type="submit"
            className="flex items-center gap-2 text-left font-medium text-navy hover:underline"
          >
            {!row.isRead && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal"
                title="Unread"
              />
            )}
            {row.message}
          </button>
        </form>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            row.isRead
              ? "bg-gray-100 text-gray-600"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {row.isRead ? "Read" : "Unread"}
        </span>
      ),
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
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-navy">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Everything the admin panel has flagged for your attention.
          </p>
        </div>
        <form action={markAllNotificationsRead}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        </form>
      </div>

      <div className="mt-6">
        <DataTable
          basePath="/controller/notifications"
          columns={columns}
          rows={rows}
          totalItems={totalItems}
          page={page}
          q={q}
          dir={dir}
          pageSize={pageSize}
          searchPlaceholder="Search notifications…"
          getRowKey={(row) => row.id}
          emptyMessage="No notifications yet."
        />
      </div>
    </div>
  );
}
