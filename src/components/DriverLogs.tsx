import { useState } from "react";
import type { DailyLog, DutyStatus } from "@/types/trip";
import { dutyLabel, formatDate, formatHours } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DailyLogGraph } from "./DailyLogGraph";

const ORDER: DutyStatus[] = ["off_duty", "sleeper_berth", "driving", "on_duty"];

export function DriverLogs({ logs }: { logs: DailyLog[] }) {
  const [active, setActive] = useState(0);
  const selected = Math.min(active, Math.max(0, logs.length - 1));
  const log = logs[selected];
  if (!log) return null;
  const total = ORDER.reduce((s, k) => s + log.totals[k], 0);

  return (
    <section className="panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h2 className="font-semibold">Driver Daily Logs (UTC)</h2>
        <div role="tablist" className="inline-flex rounded-lg bg-secondary p-1">
          {logs.map((l, i) => (
            <button
              key={l.day}
              role="tab"
              aria-selected={i === selected}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                i === selected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Day {l.day}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5 p-5">
        <DailyLogGraph events={log.segments} totals={log.totals} />

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-3">
            {[
              ["Date", formatDate(log.date)],
              ["Total Miles", `${log.total_miles.toLocaleString()} mi`],
              ["Carrier", log.carrier],
              ["Truck / Tractor", log.truck_number],
              ["Trailer", log.trailer_number],
              ["Route", `${log.from} → ${log.to}`],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="truncate font-medium">{v}</dd>
              </div>
            ))}
            <div className="col-span-full">
              <dt className="text-xs text-muted-foreground">Remarks</dt>
              <dd>
                <ul className="mt-1 space-y-0.5 font-mono text-xs">
                  {log.remarks.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Totals</p>
            <ul className="space-y-1.5 text-sm">
              {ORDER.map((k) => (
                <li key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{dutyLabel[k]}</span>
                  <span className="font-mono font-medium">{formatHours(log.totals[k])}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-border pt-1.5 font-semibold">
                <span>Total</span>
                <span className="font-mono">{formatHours(total)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
