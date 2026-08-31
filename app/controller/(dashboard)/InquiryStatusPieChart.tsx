import type { InquiryStatus } from "@/lib/generated/prisma/enums";
import { formatCompactNumber } from "@/lib/format-number";
import { STATUS_LABELS, STATUS_CHART_COLORS } from "./inquiries/StatusBadge";

const SIZE = 120;
const RADIUS = 45;
const STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function InquiryStatusPieChart({
  counts,
}: {
  counts: Record<InquiryStatus, number>;
}) {
  const statuses = Object.keys(counts) as InquiryStatus[];
  const total = statuses.reduce((sum, status) => sum + counts[status], 0);

  let offset = 0;
  const segments = statuses
    .filter((status) => counts[status] > 0)
    .map((status) => {
      const value = counts[status];
      const fraction = total > 0 ? value / total : 0;
      const dash = fraction * CIRCUMFERENCE;
      const segment = {
        status,
        value,
        fraction,
        dashArray: `${dash} ${CIRCUMFERENCE - dash}`,
        dashOffset: -offset,
      };
      offset += dash;
      return segment;
    });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={STROKE}
          />
          {total > 0 &&
            segments.map((segment) => (
              <circle
                key={segment.status}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={STATUS_CHART_COLORS[segment.status]}
                strokeWidth={STROKE}
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.dashOffset}
                strokeLinecap={segments.length > 1 ? "butt" : "round"}
              />
            ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-md font-bold text-navy">
            {formatCompactNumber(total)}
          </span>
          <span className="text-[11px] text-gray-400">total</span>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-2.5">
        {statuses.map((status) => {
          const value = counts[status];
          const percent = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <li key={status} className="flex items-center gap-2.5 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_CHART_COLORS[status] }}
                aria-hidden="true"
              />
              <span className="flex-1 text-gray-600">
                {STATUS_LABELS[status]}
              </span>
              <span className="font-semibold text-navy">
                {formatCompactNumber(value)}
              </span>
              <span className="w-9 text-right text-xs text-gray-400">
                {percent}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
