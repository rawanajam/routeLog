import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2, MapPin, Navigation, Flag, PackageOpen, Gauge } from "lucide-react";
import type { TripRequest } from "@/types/trip";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<keyof TripRequest, string>>;

interface Props {
  onSubmit: (data: TripRequest) => void;
  loading?: boolean | undefined;
  serverErrors?: Errors | undefined;
}

function Field({
  id,
  label,
  icon,
  error,
  helper,
  suffix,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string | undefined;
  helper?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        className={cn(
          "flex h-11 items-center gap-2.5 rounded-lg border bg-card px-3 transition-shadow focus-within:ring-2 focus-within:ring-ring/40",
          error ? "border-destructive focus-within:ring-destructive/30" : "border-input focus-within:border-ring",
        )}
      >
        <span className={cn("shrink-0", error ? "text-destructive" : "text-muted-foreground")}>{icon}</span>
        {children}
        {suffix && <span className="shrink-0 text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : helper ? (
        <p className="text-xs text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  );
}

const inputCls =
  "h-full w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60";

export function TripForm({ onSubmit, loading, serverErrors }: Props) {
  const [values, setValues] = useState({ current: "", pickup: "", dropoff: "", cycle: "" });
  const [errors, setErrors] = useState<Errors>({});
  const all = { ...serverErrors, ...errors };

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!values.current.trim()) next.current_location = "Enter a current location";
    if (!values.pickup.trim()) next.pickup_location = "Enter a pickup location";
    if (!values.dropoff.trim()) next.dropoff_location = "Enter a dropoff location";
    const cycle = Number(values.cycle);
    if (values.cycle === "" || Number.isNaN(cycle) || cycle < 0 || cycle > 70)
      next.current_cycle_used = "Current cycle hours must be between 0 and 70";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({
      current_location: values.current.trim(),
      pickup_location: values.pickup.trim(),
      dropoff_location: values.dropoff.trim(),
      current_cycle_used: cycle,
    });
  };

  const fillSample = () =>
    setValues({ current: "Dallas, TX", pickup: "Houston, TX", dropoff: "Miami, FL", cycle: "20" });

  return (
    <form onSubmit={submit} noValidate className="panel p-5 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Field id="current" label="Current Location" icon={<Navigation className="h-4 w-4" />} error={all.current_location}>
          <input id="current" className={inputCls} placeholder="Enter current location" value={values.current} onChange={set("current")} disabled={loading} />
        </Field>
        <Field id="pickup" label="Pickup Location" icon={<PackageOpen className="h-4 w-4" />} error={all.pickup_location}>
          <input id="pickup" className={inputCls} placeholder="Enter pickup location" value={values.pickup} onChange={set("pickup")} disabled={loading} />
        </Field>
        <Field id="dropoff" label="Dropoff Location" icon={<Flag className="h-4 w-4" />} error={all.dropoff_location}>
          <input id="dropoff" className={inputCls} placeholder="Enter dropoff location" value={values.dropoff} onChange={set("dropoff")} disabled={loading} />
        </Field>
        <Field
          id="cycle"
          label="Current Cycle Used"
          icon={<Gauge className="h-4 w-4" />}
          error={all.current_cycle_used}
          helper="Hours already used in the current 70-hour cycle"
          suffix="hrs"
        >
          <input id="cycle" type="number" min={0} max={70} step={0.25} className={inputCls} placeholder="0" value={values.cycle} onChange={set("cycle")} disabled={loading} />
        </Field>
      </div>
      <div className="mt-5 flex flex-col-reverse items-stretch gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={fillSample} disabled={loading} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50">
          <MapPin className="h-3.5 w-3.5" /> Use sample trip
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Calculating…" : "Calculate Trip"}
        </button>
      </div>
    </form>
  );
}
