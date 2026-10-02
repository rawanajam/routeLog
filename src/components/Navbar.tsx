import { Link } from "@tanstack/react-router";
import { Route as RouteIcon } from "lucide-react";

const links = [
  { to: "/", label: "Trip Planner" },
  { to: "/logs", label: "Driver Logs" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-[1000] border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-navy-foreground">
            <RouteIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Route<span className="text-primary">Log</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
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
      </div>
    </header>
  );
}
