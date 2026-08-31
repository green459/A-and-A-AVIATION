import { formatCompactNumber } from "@/lib/format-number";

const SIZE = 96;
const RADIUS = 38;
const STROKE = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ACTIVE_COLOR = "#14b8a6"; // teal — matches the brand's --color-teal
const INACTIVE_COLOR = "#e5e7eb"; // gray-200

/** Deliberately minimal — unlike InquiryStatusPieChart there's no legend
 * list, just the ring and the total front and center, since the ask here
 * is "view the total count", not compare category breakdowns. The active
 * share still reads as a ring so unsubscribes are visible at a glance
 * without needing numbers spelled out. */
export default function NewsletterPieChart({
  active,
  total,
}: {
  active: number;
  total: number;
}) {
  const fraction = total > 0 ? active / total : 0;
  const dash = fraction * CIRCUMFERENCE;

  return (
    <div className="flex items-center gap-5">
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
            stroke={INACTIVE_COLOR}
            strokeWidth={STROKE}
          />
          {dash > 0 && (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={ACTIVE_COLOR}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeLinecap={fraction < 1 ? "butt" : "round"}
            />
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-md font-bold text-navy">
            {formatCompactNumber(total)}
          </span>
          <span className="text-[10px] text-gray-400">total</span>
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-navy">
          {formatCompactNumber(active)}
        </p>
        <p className="text-xs text-gray-500">currently subscribed</p>
      </div>
    </div>
  );
}
