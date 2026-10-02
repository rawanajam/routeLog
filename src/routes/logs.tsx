import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { calculateTrip } from "@/services/api";
import { sampleTripRequest } from "@/data/mockTrip";
import { DriverLogs } from "@/components/DriverLogs";
import { ErrorState } from "@/components/States";
import { Skeleton } from "@/components/ui/skeleton";

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
  const q = useQuery({ queryKey: ["trip", sampleTripRequest], queryFn: () => calculateTrip(sampleTripRequest) });
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Driver Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sample log sheets for {sampleTripRequest.pickup_location} → {sampleTripRequest.dropoff_location}.
        </p>
      </div>
      {q.isPending ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : q.error ? (
        <ErrorState message={q.error.message} onRetry={() => q.refetch()} />
      ) : (
        <DriverLogs logs={q.data.logs} />
      )}
    </main>
  );
}
