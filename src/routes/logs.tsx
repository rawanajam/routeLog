import { createFileRoute, Link } from "@tanstack/react-router";
import { useLatestTrip } from "@/services/latestTrip";
import { DriverLogs } from "@/components/DriverLogs";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Driver Logs — RouteLog" },
      { name: "description", content: "ELD-style daily driver log sheets with 24-hour duty status graphs." },
      { property: "og:title", content: "Driver Logs — RouteLog" },
      { property: "og:description", content: "ELD-style daily driver log sheets with 24-hour duty status graphs." },
    ],
  }),
  component: LogsPage,
});

function LogsPage() {
  const trip = useLatestTrip();
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Driver Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {trip ? `Daily log sheets for ${trip.logs[0]?.from ?? "your trip"} → ${trip.logs[0]?.to ?? "your destination"}.`
            : "Daily log sheets from your latest calculated trip."}
        </p>
      </div>
      {trip ? <DriverLogs logs={trip.logs} /> : (
        <div className="panel space-y-3 p-6">
          <p className="text-sm text-muted-foreground">Calculate a trip in the Trip Planner to see its daily logs here.</p>
          <Link to="/" className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Open Trip Planner</Link>
        </div>
      )}
    </main>
  );
}
