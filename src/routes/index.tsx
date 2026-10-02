import { createFileRoute } from "@tanstack/react-router";
import { TripPlanner } from "@/views/TripPlanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trip Planner — RouteLog" },
      { name: "description", content: "Plan truck routes, stops, and Hours of Service compliant driver logs." },
      { property: "og:title", content: "Trip Planner — RouteLog" },
      { property: "og:description", content: "Plan truck routes, stops, and Hours of Service compliant driver logs." },
    ],
  }),
  component: TripPlanner,
});
