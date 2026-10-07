import type { DutyStatus, LogSegment } from "@/types/trip";
import { dutyLabel, formatHours } from "@/lib/format";

const ROWS: DutyStatus[] = ["off_duty", "sleeper_berth", "driving", "on_duty"];
const ROW_LABEL: Record<DutyStatus, string> = { ...dutyLabel, on_duty: "On Duty (ND)" };

const W = 1000;
const LEFT = 120;
const RIGHT = 64;
const TOP = 28;
const ROW_H = 36;
const GRID_W = W - LEFT - RIGHT;
const H = TOP + ROW_H * 4 + 8;

const x = (h: number) => LEFT + (h / 24) * GRID_W;
const y = (s: DutyStatus) => TOP + ROWS.indexOf(s) * ROW_H + ROW_H / 2;

/** Builds the connected ELD path from segment data. */
function buildPath(segments: LogSegment[]) {
  const sorted = [...segments].sort((a, b) => a.start_hour - b.start_hour);
  return sorted
    .map((s, i) => {
      const cmd = i === 0 ? `M ${x(s.start_hour)} ${y(s.status)}` : `L ${x(s.start_hour)} ${y(s.status)}`;
      return `${cmd} L ${x(s.end_hour)} ${y(s.status)}`;
    })
    .join(" ");
}

export function DailyLogGraph({ events, totals }: { events: LogSegment[]; totals: Record<DutyStatus, number> }) {
  return (
    <div className="min-w-0 max-w-full">
      <p className="mb-2 text-xs text-muted-foreground sm:hidden">Swipe the graph to see all 24 hours.</p>
      <div tabIndex={0} role="region" aria-label="Scrollable 24-hour duty status graph" className="max-w-full overflow-x-auto overscroll-x-contain scroll-smooth rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[1000px] sm:min-w-[680px]" role="img" aria-label="24-hour duty status graph">
        {/* hour labels */}
        {Array.from({ length: 25 }, (_, h) => (
          <text key={h} x={x(h)} y={16} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={10}>
            {h === 0 || h === 24 ? "M" : h === 12 ? "N" : String(h).padStart(2, "0")}
          </text>
        ))}
        <text x={W - RIGHT / 2} y={16} textAnchor="middle" className="fill-muted-foreground" fontSize={10} fontWeight={600}>
          HRS
        </text>
        {ROWS.map((r, i) => (
          <g key={r}>
            <rect x={LEFT} y={TOP + i * ROW_H} width={GRID_W} height={ROW_H} className={i % 2 ? "fill-card" : "fill-muted"} />
            <text x={LEFT - 10} y={y(r) + 4} textAnchor="end" fontSize={11} fontWeight={500} className="fill-foreground">
              {ROW_LABEL[r]}
            </text>
            <text x={W - RIGHT / 2} y={y(r) + 4} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-foreground font-mono">
              {formatHours(totals[r])}
            </text>
          </g>
        ))}
        {/* grid: hour, half, quarter ticks */}
        {Array.from({ length: 24 * 4 + 1 }, (_, q) => {
          const h = q / 4;
          const major = q % 4 === 0;
          return ROWS.map((_, i) => {
            const top = TOP + i * ROW_H;
            const len = major ? ROW_H : q % 2 === 0 ? ROW_H * 0.45 : ROW_H * 0.25;
            return (
              <line key={`${q}-${i}`} x1={x(h)} x2={x(h)} y1={top} y2={top + len} className="stroke-border" strokeWidth={major ? 1 : 0.75} />
            );
          });
        })}
        <rect x={LEFT} y={TOP} width={GRID_W} height={ROW_H * 4} fill="none" className="stroke-input" />
        <path d={buildPath(events)} fill="none" className="stroke-primary" strokeWidth={2.75} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      </div>
    </div>
  );
}
