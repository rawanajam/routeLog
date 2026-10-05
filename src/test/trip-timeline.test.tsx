import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { TripTimeline } from "@/components/TripTimeline";
import type { TripEvent } from "@/types/trip";

afterEach(cleanup);

it("renders an unexpected backend event kind without crashing", () => {
  const event = {
    id: "start", time: "2026-10-05T06:00:00Z", title: "Trip begins", kind: "start",
  } as unknown as TripEvent;
  render(<TripTimeline events={[event]} />);
  expect(screen.getByText("Trip begins")).toBeInTheDocument();
  expect(screen.getByText("Event")).toBeInTheDocument();
});
