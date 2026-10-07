import type { TripEvent } from "@/types/trip";
import { formatDate, formatHours, formatTime, kindColor, kindLabel } from "@/lib/format";
import { kindIcon } from "./StatusIcon";

export function TripTimeline({ events }: { events: TripEvent[] }) {
  let lastDay = "";
  return (
    <section className="panel flex h-full min-w-0 flex-col">
      <div className="border-b border-border px-4 py-3.5 sm:px-5">
        <h2 className="font-semibold">Trip Timeline (UTC)</h2>
      </div>
      <ol className="min-w-0 flex-1 px-4 py-4 sm:max-h-[540px] sm:overflow-y-auto sm:px-5">
        {events.map((e, i) => {
          const Icon = kindIcon[e.kind] ?? kindIcon.on_duty;
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
                <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ${kindColor[e.kind] ?? kindColor.on_duty} text-primary-foreground`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-2 sm:items-center">
                    <p className="min-w-0 break-words text-sm font-medium sm:truncate">{e.title}</p>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatTime(e.time)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">{kindLabel[e.kind] ?? "Event"}</span>
                    {e.duration_hours !== undefined && <span>{formatHours(e.duration_hours)}</span>}
                    {e.location && <span className="min-w-0 break-words sm:truncate">· {e.location}</span>}
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
