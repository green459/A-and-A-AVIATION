export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

export interface ListParams {
  page: number;
  q: string;
  dir: "asc" | "desc";
  pageSize: number;
}

/** Parses the shared page/q/dir/pageSize searchParams every admin list page uses. */
export function parseListParams(
  searchParams: Record<string, string | undefined>,
): ListParams {
  const requestedSize = Number(searchParams.pageSize);
  const pageSize = PAGE_SIZE_OPTIONS.includes(
    requestedSize as (typeof PAGE_SIZE_OPTIONS)[number],
  )
    ? requestedSize
    : DEFAULT_PAGE_SIZE;

  return {
    page: Math.max(1, Number(searchParams.page) || 1),
    q: (searchParams.q ?? "").trim(),
    dir: searchParams.dir === "asc" ? "asc" : "desc",
    pageSize,
  };
}
