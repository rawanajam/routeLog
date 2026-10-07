import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { LatLng, TripStop } from "@/types/trip";
import { stopColor, stopLabel } from "@/lib/format";

const LeafletMap = lazy(() => import("./LeafletMap"));

const legend = ["start", "pickup", "fuel", "break", "rest", "dropoff"] as const;

export function RouteMap({ route, stops }: { route: LatLng[]; stops: TripStop[] }) {
  const fallback = <div className="route-grid h-full w-full animate-pulse bg-muted" />;
  return (
    <section className="panel isolate flex h-full min-w-0 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
        <h2 className="font-semibold">Route Map</h2>
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
          {legend.map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-2.5 w-2.5 rounded-full ${stopColor[t]}`} />
              {t === "break" ? "Break" : t === "fuel" ? "Fuel" : t === "rest" ? "Rest" : stopLabel[t]}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative min-h-[320px] min-w-0 flex-1 sm:min-h-[380px] lg:min-h-[480px]">
        <ClientOnly fallback={fallback}>
          <Suspense fallback={fallback}>
            <LeafletMap route={route} stops={stops} />
          </Suspense>
        </ClientOnly>
      </div>
      <p className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground sm:px-5">
        Drag to explore, use + / − to zoom, and click a stop for details.
      </p>
    </section>
  );
}
