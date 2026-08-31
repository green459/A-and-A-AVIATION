import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { parseListParams } from "@/lib/list-params";
import DeleteButton from "../_components/DeleteButton";
import DataTable, { type DataTableColumn } from "../_components/DataTable";
import { deleteBlog } from "./actions";

export const metadata = { title: "Blogs" };

type Row = Awaited<ReturnType<typeof prisma.blog.findMany>>[number];

export default async function BlogsListPage({
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

  const where: Prisma.BlogWhereInput = q
    ? {
        OR: [
          { title: { contains: q } },
          { category: { contains: q } },
          { excerpt: { contains: q } },
        ],
      }
    : {};

  const [posts, totalCount] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { publishedAt: dir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blog.count({ where }),
  ]);

  const columns: DataTableColumn<Row>[] = [
    {
      key: "title",
      label: "Title",
      className: "font-medium text-gray-900",
      render: (row) => row.title,
    },
    { key: "category", label: "Category", render: (row) => row.category },
    {
      key: "published",
      label: "Published",
      render: (row) =>
        row.publishedAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
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
            href={`/controller/blogs/${row.id}/edit`}
            className="font-medium text-navy hover:underline"
          >
            Edit
          </Link>
          <DeleteButton
            id={row.id}
            action={deleteBlog}
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
          <h1 className="font-display text-2xl text-navy">Blogs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the articles shown on the public Travel Guide.
          </p>
        </div>
        <Link
          href="/controller/blogs/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          basePath="/controller/blogs"
          columns={columns}
          rows={posts}
          totalItems={totalCount}
          page={page}
          q={q}
          dir={dir}
          pageSize={pageSize}
          searchPlaceholder="Search title, category…"
          getRowKey={(row) => row.id}
          emptyMessage="No blog posts yet."
        />
      </div>
    </div>
  );
}
