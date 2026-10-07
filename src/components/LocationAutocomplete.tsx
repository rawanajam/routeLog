import { useEffect, useState, type KeyboardEvent } from "react";
import { Loader2 } from "lucide-react";
import { searchLocations } from "@/services/locations";
import type { LocationValue, ResolvedLocation } from "@/types/trip";

interface Props {
  id: string;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  placeholder: string;
  disabled?: boolean | undefined;
}

export function LocationAutocomplete({ id, value, onChange, placeholder, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<ResolvedLocation[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(-1);
  const query = value.name.trim();
  const showSuggestions = open && !disabled && value.lat === null;
  const searching = showSuggestions && query.length >= 3;

  useEffect(() => {
    setResults([]);
    setActive(-1);
    setError("");
    setBusy(searching);
    if (!searching) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchLocations(query, controller.signal).then((locations) => {
        if (!controller.signal.aborted) setResults(locations);
      }).catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Location search failed.");
      }).finally(() => {
        if (!controller.signal.aborted) setBusy(false);
      });
    }, 500);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, searching]);

  const select = (location: ResolvedLocation) => {
    onChange(location);
    setOpen(false);
    setActive(-1);
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") { setOpen(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => !results.length ? -1 : index < 0
        ? (event.key === "ArrowDown" ? 0 : results.length - 1)
        : (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (event.key === "Enter" && searching && active >= 0 && results[active]) {
      event.preventDefault();
      select(results[active]);
    }
  };

  return (
    <div className="location-autocomplete relative h-full min-w-0 flex-1">
      <input id={id} role="combobox" aria-autocomplete="list" aria-expanded={showSuggestions}
        aria-controls={`${id}-suggestions`} aria-activedescendant={active >= 0 ? `${id}-option-${active}` : undefined}
        autoComplete="off" maxLength={300} value={value.name} placeholder={placeholder} disabled={disabled}
        className="h-full w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground/70 disabled:opacity-60 sm:text-sm"
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={keyDown}
        onChange={(event) => {
          const name = event.target.value.replace(/[^\p{L}\p{M}\p{N} ,.'’\-]/gu, "");
          if (name === value.name) return;
          onChange({ name, lat: null, lng: null });
          setOpen(true);
        }} />
      {showSuggestions && (
        <div className="location-suggestions absolute left-0 right-0 top-full z-50 mt-2 min-w-0 rounded-lg border border-border bg-card p-1 shadow-lg sm:min-w-64">
          <div aria-live="polite" className="text-xs text-muted-foreground">
            {!searching ? <p className="p-2">Type at least 3 characters to search locations</p>
              : busy ? <p className="flex items-center gap-2 p-2"><Loader2 className="h-3 w-3 animate-spin" /> Searching locations…</p>
              : error ? <p className="p-2 text-destructive">{error}</p>
              : !results.length ? <p className="p-2">No locations found</p> : null}
          </div>
          <ul id={`${id}-suggestions`} role="listbox" aria-label="Location suggestions" className="max-h-64 overflow-y-auto overscroll-contain">
            {results.map((location, index) => (
              <li key={`${location.lat},${location.lng},${location.name}`} id={`${id}-option-${index}`} role="option"
                aria-selected={active === index} className={`flex min-h-11 cursor-pointer items-center break-words rounded-md p-2 text-sm hover:bg-muted sm:block sm:min-h-0 ${active === index ? "bg-muted" : ""}`}
                onPointerDown={(event) => event.preventDefault()}
                onMouseDown={(event) => event.preventDefault()} onClick={() => select(location)}>{location.name}</li>
            ))}
          </ul>
          <p className="border-t border-border px-2 pt-1 text-[10px] text-muted-foreground">
            © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> · Photon
          </p>
        </div>
      )}
    </div>
  );
}
