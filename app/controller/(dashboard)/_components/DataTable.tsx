import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";
import { PAGE_SIZE_OPTIONS } from "@/lib/list-params";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") usp.set(key, String(value));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

/** Central admin list table: row numbers, search, date sort, page-size
 * selection, and pagination, all in one place — the individual list pages
 * only supply the already-fetched rows + column definitions and this
 * component + list-params.ts own the shared search/sort/paging UI/logic. */
export default function DataTable<T>({
  basePath,
  columns,
  rows,
  totalItems,
  page,
  q,
  dir,
  pageSize,
  searchPlaceholder = "Search…",
  dateSortLabel = "Date",
  getRowKey,
  emptyMessage,
  extraParams,
}: {
  basePath: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  totalItems: number;
  page: number;
  q: string;
  dir: "asc" | "desc";
  pageSize: number;
  searchPlaceholder?: string;
  dateSortLabel?: string;
  getRowKey: (row: T) => string;
  emptyMessage: string;
  /** Other active filters (e.g. inquiry status) to preserve across links. */
  extraParams?: Record<string, string | undefined>;
}) {
  const startIndex = (page - 1) * pageSize;
  const preserved = { ...extraParams, pageSize: String(pageSize) };

  const sortHref = `${basePath}${buildQueryString({
    ...preserved,
    q: q || undefined,
    dir: dir === "asc" ? "desc" : "asc",
  })}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <form
          method="GET"
          action={basePath}
          className="relative"
          role="search"
        >
          {Object.entries(preserved).map(([key, value]) =>
            value ? (
              <input key={key} type="hidden" name={key} value={value} />
            ) : null,
          )}
          <input type="hidden" name="dir" value={dir} />
          <SearchBox name="q" defaultValue={q} placeholder={searchPlaceholder} />
        </form>

        <div className="flex items-center gap-4">
          <Link
            href={sortHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-navy"
          >
            {dateSortLabel}
            {dir === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ArrowUp className="h-3.5 w-3.5" />
            )}
          </Link>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span>Show</span>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <Link
                key={size}
                href={`${basePath}${buildQueryString({
                  ...extraParams,
                  q: q || undefined,
                  dir,
                  pageSize: size,
                })}`}
                className={`rounded px-1.5 py-0.5 font-medium ${
                  size === pageSize
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {size}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="border-t border-gray-100 p-8 text-center text-sm text-gray-500">
          {q ? `No results for "${q}".` : emptyMessage}
        </p>
      ) : (
        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-medium">#</th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-5 py-3 font-medium ${col.className ?? ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={getRowKey(row)}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-5 py-3 text-gray-400">
                    {startIndex + i + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-3 ${col.className ?? ""}`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        basePath={basePath}
        currentPage={page}
        totalItems={totalItems}
        pageSize={pageSize}
        searchParams={{ ...preserved, q: q || undefined, dir }}
      />
    </div>
  );
}
