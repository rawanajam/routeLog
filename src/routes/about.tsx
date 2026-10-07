import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — RouteLog" },
      { name: "description", content: "RouteLog plans trips and Hours of Service schedules for property-carrying drivers." },
      { property: "og:title", content: "About — RouteLog" },
      { property: "og:description", content: "RouteLog plans trips and Hours of Service schedules for property-carrying drivers." },
    ],
  }),
  component: About,
});

const assumptions = [
  "Property-carrying driver, 70-hour / 8-day cycle",
  "No adverse driving conditions",
  "Fuel at least once every 1,000 miles",
  "Pickup and dropoff take 1 hour each",
];

function About() {
  return (
    <main className="mx-auto min-w-0 max-w-3xl space-y-6 px-4 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">About RouteLog</h1>
      <p className="text-muted-foreground">
        RouteLog generates a driving route, planned stops, and daily ELD log sheets for commercial truck
        drivers. Schedules and Hours of Service compliance are calculated by the backend service.
      </p>
      <section className="panel p-4 sm:p-5">
        <h2 className="mb-3 font-semibold">Planning assumptions</h2>
        <ul className="space-y-2 text-sm">
          {assumptions.map((a) => (
            <li key={a} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {a}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
