import type { TripEvent } from "@/types/trip";
import { formatDate, formatHours, formatTime, kindColor, kindLabel } from "@/lib/format";
import { kindIcon } from "./StatusIcon";

export function TripTimeline({ events }: { events: TripEvent[] }) {
  let lastDay = "";
  return (
    <section className="panel flex h-full flex-col">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="font-semibold">Trip Timeline</h2>
      </div>
      <ol className="max-h-[540px] flex-1 overflow-y-auto px-5 py-4">
        {events.map((e, i) => {
          const Icon = kindIcon[e.kind];
          const day = e.time.slice(0, 10);
          const showDay = day !== lastDay;
          lastDay = day;
          return (
            <li key={e.id}>
              {showDay && (
                <p className="mb-2 mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground first:mt-0">
                  {formatDate(day)}
                </p>
              )}
              <div className="relative flex gap-3 pb-4">
                {i < events.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" />}
                <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ${kindColor[e.kind]} text-primary-foreground`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{e.title}</p>
                    <span className="font-mono text-xs text-muted-foreground">{formatTime(e.time)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">{kindLabel[e.kind]}</span>
                    {e.duration_hours !== undefined && <span>{formatHours(e.duration_hours)}</span>}
                    {e.location && <span className="truncate">· {e.location}</span>}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
