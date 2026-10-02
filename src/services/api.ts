import { buildMockTrip } from "@/data/mockTrip";
import { TripApiError, type TripRequest, type TripResponse } from "@/types/trip";

/** Base URL for the Django REST backend. Empty = same origin. */
export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

/** Toggle to switch from mock data to the real backend. */
const USE_MOCK = !import.meta.env.VITE_API_URL;

export async function calculateTrip(data: TripRequest): Promise<TripResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1400));
    return buildMockTrip(data);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/trip/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new TripApiError("Backend unavailable. Please try again shortly.");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { detail?: string; field?: keyof TripRequest }
      | null;
    throw new TripApiError(body?.detail ?? "Unable to calculate trip.", body?.field);
  }
  return (await response.json()) as TripResponse;
}
