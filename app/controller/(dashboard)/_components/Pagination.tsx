import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildHref(basePath: string, params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params);
  if (page <= 1) {
    next.delete("page");
  } else {
    next.set("page", String(page));
  }
  const qs = next.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Numbered page list with an ellipsis for large ranges — always shows the
 * first, last, and a window around the current page. */
function getPageNumbers(current: number, total: number): (number | "...")[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("...");
    result.push(p);
    prev = p;
  }
  return result;
}

export default function Pagination({
  basePath,
  currentPage,
  totalItems,
  pageSize,
  searchParams,
}: {
  basePath: string;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  /** Other active filters/search params to preserve across page links. */
  searchParams?: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const params = new URLSearchParams(
    Object.entries(searchParams ?? {}).filter(
      (entry): entry is [string, string] => !!entry[1],
    ),
  );

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 border-t border-gray-100 px-5 py-4"
    >
      <p className="text-xs text-gray-500">
        Page {currentPage} of {totalPages} · {totalItems} total
      </p>
      <div className="flex items-center gap-1">
        <Link
          href={buildHref(basePath, params, Math.max(1, currentPage - 1))}
          aria-disabled={currentPage <= 1}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
            currentPage <= 1
              ? "pointer-events-none text-gray-300"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        {pageNumbers.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(basePath, params, page)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                page === currentPage
                  ? "bg-navy text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          ),
        )}

        <Link
          href={buildHref(
            basePath,
            params,
            Math.min(totalPages, currentPage + 1),
          )}
          aria-disabled={currentPage >= totalPages}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
            currentPage >= totalPages
              ? "pointer-events-none text-gray-300"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </nav>
  );
}
