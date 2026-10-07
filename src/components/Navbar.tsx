import { Link } from "@tanstack/react-router";
import { Menu, Route as RouteIcon } from "lucide-react";

const links = [
  { to: "/", label: "Trip Planner" },
  { to: "/logs", label: "Driver Logs" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-[1000] border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-navy-foreground">
            <RouteIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Route<span className="text-primary">Log</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:px-3"
              activeProps={{ className: "bg-secondary !text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <details className="relative sm:hidden">
          <summary aria-label="Open navigation menu" className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-lg text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" />
          </summary>
          <nav aria-label="Mobile navigation" className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-lg">
            {links.map((l) => (
              <Link key={l.to} to={l.to} activeOptions={{ exact: true }}
                onClick={(event) => { const menu = event.currentTarget.closest("details"); if (menu) menu.open = false; }}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                activeProps={{ className: "bg-secondary !text-foreground" }}>{l.label}</Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
