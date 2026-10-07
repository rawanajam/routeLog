import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import type { ComplianceResult } from "@/types/trip";

export function ComplianceSummary({ compliance }: { compliance: ComplianceResult }) {
  return (
    <section className="panel min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3.5 sm:px-5">
        <h2 className="font-semibold">HOS Compliance Summary</h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            compliance.compliant ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {compliance.compliant ? "Compliant" : "Issues found"}
        </span>
      </div>
      <p className="px-4 py-3 text-xs text-muted-foreground sm:px-5">Checks apply to this planned schedule, assuming an initial 10-hour rest. Previous daily duty records are unavailable; cycle recapture is not assumed.</p>
      <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {compliance.items.map((c) => (
          <li key={c.id} className="flex gap-3 bg-card p-4">
            {c.passed ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            )}
            <div className="min-w-0 break-words">
              <p className="text-sm font-medium">{c.rule}</p>
              <p className="text-xs text-muted-foreground">{c.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
