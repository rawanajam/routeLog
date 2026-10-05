import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { DriverLogs } from "@/components/DriverLogs";
import { PlannedStops } from "@/components/PlannedStops";
import { buildMockTrip, sampleTripRequest } from "@/data/mockTrip";
import { formatDate, formatHours } from "@/lib/format";

afterEach(cleanup);

it("rounds minute overflow into the next hour", () => {
  expect(formatHours(1.9999)).toBe("2h");
  expect(formatHours(23.999999)).toBe("24h");
});

it("keeps calendar date labels consistent with UTC duty times", () => {
  expect(formatDate("2026-10-05T23:45:00Z")).toBe(formatDate("2026-10-05"));
});

it("shows both calendar dates for an overnight rest", () => {
  const stop = { ...buildMockTrip(sampleTripRequest).stops[0]!, type: "rest" as const,
    arrival: "2026-10-05T23:00:00Z", departure: "2026-10-06T09:00:00Z", duration_hours: 10 };
  render(<PlannedStops stops={[stop]} />);
  expect(screen.getByText(/Mon, Oct 5 23:00.*Tue, Oct 6 09:00/)).toBeInTheDocument();
});

it("retains a visible log when a new trip has fewer days", () => {
  const trip = buildMockTrip(sampleTripRequest);
  const { rerender } = render(<DriverLogs logs={trip.logs} />);
  fireEvent.click(screen.getByRole("tab", { name: "Day 3" }));
  rerender(<DriverLogs logs={trip.logs.slice(0, 1)} />);
  expect(screen.getByRole("tab", { name: "Day 1" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByText("Driver Daily Logs (UTC)")).toBeInTheDocument();
});
