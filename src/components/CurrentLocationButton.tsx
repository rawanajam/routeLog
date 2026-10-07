import { useEffect, useRef, useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";
import { reverseLocation } from "@/services/locations";
import type { ResolvedLocation } from "@/types/trip";

interface Props {
  disabled?: boolean | undefined;
  onLocation: (location: ResolvedLocation) => void;
  onError: (message: string) => void;
  onBusyChange: (busy: boolean) => void;
}

export function CurrentLocationButton({ disabled, onLocation, onError, onBusyChange }: Props) {
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const locate = () => {
    onError("");
    if (!navigator.geolocation) { onError("Geolocation is unavailable. Enter your location manually."); return; }
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    onBusyChange(true);
    const finish = () => { if (!request.signal.aborted) { setBusy(false); onBusyChange(false); } };
    navigator.geolocation.getCurrentPosition(async (position) => {
      if (request.signal.aborted) return;
      try {
        const location = await reverseLocation(position.coords.latitude, position.coords.longitude, request.signal);
        if (!request.signal.aborted) onLocation(location);
      } catch (reason) {
        if (!request.signal.aborted) onError(reason instanceof Error ? reason.message : "Unable to name your location. Enter it manually.");
      } finally { finish(); }
    }, (error) => {
      if (request.signal.aborted) return;
      onError(error.code === 1 ? "Location permission denied. Allow location access or enter it manually."
        : error.code === 3 ? "Location request timed out. Try again or enter it manually."
        : "Unable to determine your location. Enter it manually.");
      finish();
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  };
  return <button type="button" onClick={locate} disabled={disabled || busy} title="Use my current location"
    aria-label={busy ? "Finding your current location" : "Use my current location"}
    className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:mr-0 sm:h-auto sm:w-auto sm:p-1">
    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
  </button>;
}
