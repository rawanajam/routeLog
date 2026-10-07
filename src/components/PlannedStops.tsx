import type { TripStop } from "@/types/trip";
import { dutyLabel, formatDate, formatHours, formatTime, stopColor, stopLabel } from "@/lib/format";
import { stopIcon } from "./StatusIcon";

export function PlannedStops({ stops }: { stops: TripStop[] }) {
  return (
    <section className="panel min-w-0">
      <div className="border-b border-border px-4 py-3.5 sm:px-5">
        <h2 className="font-semibold">Planned Stops</h2>
      </div>
      <ol className="divide-y divide-border">
        {stops.map((s, i) => {
          const Icon = stopIcon[s.type];
          return (
            <li key={s.id} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-3 px-4 py-4 sm:gap-4 sm:px-5 md:grid-cols-[4rem_minmax(0,1fr)_14rem_6rem_8rem] md:items-center">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <span className="w-5 text-right font-mono text-xs text-muted-foreground">{i + 1}</span>
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${stopColor[s.type]} text-primary-foreground`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{stopLabel[s.type]}</p>
                <p className="break-words text-sm text-foreground/80 md:truncate">{s.location}</p>
                <p className="mt-0.5 break-words text-sm text-muted-foreground md:text-xs">{s.description}</p>
              </div>
              <div className="col-start-2 min-w-0 text-sm md:col-start-auto md:text-xs">
                <p className="text-muted-foreground">Arrive → Depart</p>
                <p className="break-words font-mono leading-relaxed md:leading-normal">
                  {formatDate(s.arrival)} {formatTime(s.arrival)} → {s.arrival.slice(0, 10) !== s.departure.slice(0, 10) ? `${formatDate(s.departure)} ` : ""}{formatTime(s.departure)}
                </p>
              </div>
              <div className="col-start-2 min-w-0 text-sm md:col-start-auto md:text-xs">
                <p className="text-muted-foreground">Duration</p>
                <p className="font-mono">{s.duration_hours ? formatHours(s.duration_hours) : "—"}</p>
              </div>
              <span className="col-start-2 w-fit rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium md:col-start-auto md:justify-self-end">
                {dutyLabel[s.duty_status]}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
