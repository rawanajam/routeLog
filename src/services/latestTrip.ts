import { skipToken, useQuery } from "@tanstack/react-query";
import type { TripResponse } from "@/types/trip";

export const latestTripKey = ["latest-calculated-trip"] as const;

/** Share the exact backend result across routes without recalculating it. */
export function useLatestTrip() {
  return useQuery<TripResponse>({
    queryKey: latestTripKey,
    queryFn: skipToken,
    staleTime: Infinity,
    gcTime: Infinity,
  }).data;
}
