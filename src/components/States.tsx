import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState() {
  return (
    <div className="panel route-grid relative min-w-0 overflow-hidden px-4 py-10 text-center sm:px-6 sm:py-16">
      <svg viewBox="0 0 320 80" className="mx-auto mb-6 h-16 w-72 max-w-full" aria-hidden>
        <path d="M20 60 C 90 60, 100 20, 160 20 S 240 60, 300 30" fill="none" className="stroke-input" strokeWidth={3} strokeDasharray="6 8" />
        <circle cx={20} cy={60} r={8} className="fill-navy" />
        <circle cx={160} cy={20} r={6} className="fill-status-pickup" />
        <circle cx={300} cy={30} r={8} className="fill-primary" />
      </svg>
      <h3 className="text-lg font-semibold">No trip calculated yet</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
        Enter your trip details above to generate your route, stops, and driver logs.
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
        Calculating route and Hours of Service schedule...
      </div>
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-[74px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Skeleton className="h-[320px] rounded-xl sm:h-[480px]" />
        <Skeleton className="h-[320px] rounded-xl sm:h-[480px]" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: (() => void) | undefined }) {
  return (
    <div role="alert" className="panel flex min-w-0 flex-col items-start gap-4 border-destructive/30 p-4 sm:flex-row sm:items-center sm:p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <div className="w-full min-w-0 flex-1 break-words sm:w-auto">
        <p className="font-semibold">Unable to calculate trip</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring sm:h-9 sm:w-auto">
          <RotateCcw className="h-3.5 w-3.5" /> Retry
        </button>
      )}
    </div>
  );
}
