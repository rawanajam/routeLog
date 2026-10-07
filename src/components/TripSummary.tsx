import { CalendarDays, Clock, Gauge, Route, Timer } from "lucide-react";
import type { TripResponse } from "@/types/trip";
import { formatHours } from "@/lib/format";

export function TripSummary({ trip }: { trip: TripResponse }) {
  const items = [
    { label: "Total Distance", value: `${trip.distance_miles.toLocaleString()} mi`, icon: Route },
    { label: "Driving Time", value: formatHours(trip.driving_hours), icon: Clock },
    { label: "Total Trip Duration", value: formatHours(trip.total_trip_hours), icon: Timer },
    { label: "Remaining Cycle", value: `${formatHours(trip.remaining_cycle_hours)} left`, icon: Gauge },
    { label: "Driving Days", value: `${trip.driving_days} days`, icon: CalendarDays },
  ];
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="panel flex min-w-0 items-center gap-3 p-4 min-[360px]:max-md:flex-col min-[360px]:max-md:items-start min-[360px]:last:col-span-2 md:last:col-span-1">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground min-[360px]:max-md:h-8 min-[360px]:max-md:w-8">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground md:truncate md:text-xs">{label}</p>
            <p className="break-words font-mono text-lg font-semibold tracking-tight">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
