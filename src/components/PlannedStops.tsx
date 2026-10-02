import type { TripStop } from "@/types/trip";
import { dutyLabel, formatDate, formatHours, formatTime, stopColor, stopLabel } from "@/lib/format";
import { stopIcon } from "./StatusIcon";

export function PlannedStops({ stops }: { stops: TripStop[] }) {
  return (
    <section className="panel">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="font-semibold">Planned Stops</h2>
      </div>
      <ol className="divide-y divide-border">
        {stops.map((s, i) => {
          const Icon = stopIcon[s.type];
          return (
            <li key={s.id} className="grid grid-cols-[auto_1fr] gap-4 px-5 py-4 md:grid-cols-[auto_1.4fr_1fr_1fr_auto] md:items-center">
              <div className="flex items-center gap-3">
                <span className="w-5 text-right font-mono text-xs text-muted-foreground">{i + 1}</span>
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${stopColor[s.type]} text-primary-foreground`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{stopLabel[s.type]}</p>
                <p className="truncate text-sm text-foreground/80">{s.location}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
              </div>
              <div className="col-start-2 text-xs md:col-start-auto">
                <p className="text-muted-foreground">Arrive → Depart</p>
                <p className="font-mono">
                  {formatDate(s.arrival)} {formatTime(s.arrival)} → {formatTime(s.departure)}
                </p>
              </div>
              <div className="col-start-2 text-xs md:col-start-auto">
                <p className="text-muted-foreground">Duration</p>
                <p className="font-mono">{s.duration_hours ? formatHours(s.duration_hours) : "—"}</p>
              </div>
              <span className="col-start-2 w-fit rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium md:col-start-auto">
                {dutyLabel[s.duty_status]}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
