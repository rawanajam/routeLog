import { useMutation, useQueryClient } from "@tanstack/react-query";
import { latestTripKey, useLatestTrip } from "@/services/latestTrip";
import { calculateTrip, USE_MOCK } from "@/services/api";
import { TripApiError, type TripRequest } from "@/types/trip";
import { TripForm } from "@/components/TripForm";
import { TripSummary } from "@/components/TripSummary";
import { RouteMap } from "@/components/RouteMap";
import { TripTimeline } from "@/components/TripTimeline";
import { PlannedStops } from "@/components/PlannedStops";
import { DriverLogs } from "@/components/DriverLogs";
import { ComplianceSummary } from "@/components/ComplianceSummary";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";

export function TripPlanner() {
  const queryClient = useQueryClient();
  const latestTrip = useLatestTrip();
  const mutation = useMutation({
    mutationFn: (data: TripRequest) => calculateTrip(data),
    onSuccess: (trip) => queryClient.setQueryData(latestTripKey, trip),
  });
  const trip = mutation.data ?? latestTrip;
  const err = mutation.error;
  const fieldErr =
    err instanceof TripApiError && err.field ? { [err.field]: err.message } : undefined;

  return (
    <main className="mx-auto min-w-0 max-w-7xl space-y-6 px-4 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Plan Your Trip</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Generate your route, driving schedule, planned stops, and daily driver logs.
        </p>
      </div>

      <TripForm onSubmit={(d) => mutation.mutate(d)} loading={mutation.isPending} serverErrors={fieldErr} />

      {mutation.isPending ? (
        <LoadingState />
      ) : err ? (
        <ErrorState
          message={err.message || "Unable to calculate trip."}
          onRetry={mutation.variables ? () => mutation.mutate(mutation.variables!) : undefined}
        />
      ) : trip ? (
        <div className="min-w-0 space-y-6">
          <TripSummary trip={trip} />
          {USE_MOCK && <p className="text-sm text-muted-foreground">Demo data: this is a fixed Dallas–Houston–Miami sample, not a calculation for the entered locations or cycle hours.</p>}
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <RouteMap route={trip.route} stops={trip.stops} />
            <TripTimeline events={trip.events} />
          </div>
          <PlannedStops stops={trip.stops} />
          <DriverLogs logs={trip.logs} />
          <ComplianceSummary compliance={trip.compliance} />
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
