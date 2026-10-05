import { API_URL } from "@/services/api";
import type { ResolvedLocation } from "@/types/trip";

async function locationRequest<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, signal ? { signal } : {});
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("Location service unavailable. You can still enter a location manually.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok || !body) throw new Error(body?.detail ?? "Unable to look up locations. Please try again.");
  return body as T;
}

export async function searchLocations(query: string, signal: AbortSignal): Promise<ResolvedLocation[]> {
  const data = await locationRequest<{ results: ResolvedLocation[] }>(
    `/api/geocode/?q=${encodeURIComponent(query)}`, signal);
  return data.results;
}

export function reverseLocation(lat: number, lng: number, signal?: AbortSignal): Promise<ResolvedLocation> {
  return locationRequest(`/api/reverse-geocode/?lat=${lat}&lng=${lng}`, signal);
}
