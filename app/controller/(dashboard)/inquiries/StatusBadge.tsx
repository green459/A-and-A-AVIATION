import type { InquiryStatus } from "@/lib/generated/prisma/enums";

const STATUS_STYLES: Record<InquiryStatus, string> = {
  NEW: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  RESOLVED: "bg-green-50 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

export const STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  ARCHIVED: "Archived",
};

// Chart-friendly hex equivalents of the badge palette above (SVG fill can't
// consume Tailwind's bg-* utility classes directly).
export const STATUS_CHART_COLORS: Record<InquiryStatus, string> = {
  NEW: "#3b82f6",
  IN_PROGRESS: "#f59e0b",
  RESOLVED: "#22c55e",
  ARCHIVED: "#9ca3af",
};

export default function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
