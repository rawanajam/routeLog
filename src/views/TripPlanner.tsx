import { useMutation } from "@tanstack/react-query";
import { calculateTrip } from "@/services/api";
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
  const mutation = useMutation({ mutationFn: (data: TripRequest) => calculateTrip(data) });
  const err = mutation.error;
  const fieldErr =
    err instanceof TripApiError && err.field ? { [err.field]: err.message } : undefined;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
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
      ) : mutation.data ? (
        <div className="space-y-6">
          <TripSummary trip={mutation.data} />
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <RouteMap route={mutation.data.route} stops={mutation.data.stops} />
            <TripTimeline events={mutation.data.events} />
          </div>
          <PlannedStops stops={mutation.data.stops} />
          <DriverLogs logs={mutation.data.logs} />
          <ComplianceSummary compliance={mutation.data.compliance} />
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
