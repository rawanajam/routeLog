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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="panel flex items-center gap-3 p-4 last:col-span-2 md:last:col-span-1">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
            <p className="font-mono text-lg font-semibold tracking-tight">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
