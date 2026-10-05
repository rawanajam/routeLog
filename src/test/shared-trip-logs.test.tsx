import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { calculateTrip } from "@/services/api";
import { buildMockTrip, sampleTripRequest } from "@/data/mockTrip";

vi.mock("@/services/api", () => ({ calculateTrip: vi.fn(), USE_MOCK: false }));
vi.mock("@/components/RouteMap", () => ({ RouteMap: () => null }));
vi.mock("@/components/TripForm", () => ({
  TripForm: ({ onSubmit }: { onSubmit: (data: unknown) => void }) =>
    <button onClick={() => onSubmit(sampleTripRequest)}>Calculate test trip</button>,
}));

afterEach(() => { cleanup(); vi.resetAllMocks(); });

async function open(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const router = createRouter({ routeTree, context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }) });
  await router.load();
  render(<RouterProvider router={router} />, { container: document });
  return router;
}

it("shows an empty state without calculating a sample trip", async () => {
  await open("/logs");
  expect(await screen.findByText(/Calculate a trip in the Trip Planner/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open Trip Planner" })).toBeInTheDocument();
  expect(calculateTrip).not.toHaveBeenCalled();
});

it("shares the latest successful logs across navigation and replaces them on recalculation", async () => {
  const first = buildMockTrip(sampleTripRequest);
  first.logs.forEach((log) => { log.from = "Chicago, IL"; log.to = "Atlanta, GA"; });
  const second = structuredClone(first);
  second.logs = second.logs.slice(0, 1);
  second.logs[0]!.to = "Indianapolis, IN";
  vi.mocked(calculateTrip).mockResolvedValueOnce(first).mockResolvedValueOnce(second)
    .mockRejectedValueOnce(new Error("Routing unavailable"));
  const router = await open("/");
  fireEvent.click(await screen.findByText("Calculate test trip"));
  await screen.findByText("Driver Daily Logs (UTC)");
  await act(async () => { await router.navigate({ to: "/logs" }); });
  expect(await screen.findByText("Daily log sheets for Chicago, IL → Atlanta, GA.")).toBeInTheDocument();
  expect(screen.getAllByRole("tab")).toHaveLength(first.logs.length);
  expect(calculateTrip).toHaveBeenCalledTimes(1);

  await act(async () => { await router.navigate({ to: "/" }); });
  expect(await screen.findByText("Driver Daily Logs (UTC)")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Calculate test trip"));
  await waitFor(() => expect(screen.getAllByRole("tab")).toHaveLength(1));
  await act(async () => { await router.navigate({ to: "/logs" }); });
  expect(await screen.findByText("Daily log sheets for Chicago, IL → Indianapolis, IN.")).toBeInTheDocument();
  expect(calculateTrip).toHaveBeenCalledTimes(2);

  await act(async () => { await router.navigate({ to: "/" }); });
  fireEvent.click(await screen.findByText("Calculate test trip"));
  await screen.findByText("Routing unavailable");
  await act(async () => { await router.navigate({ to: "/logs" }); });
  expect(await screen.findByText("Daily log sheets for Chicago, IL → Indianapolis, IN.")).toBeInTheDocument();
  expect(screen.getAllByRole("tab")).toHaveLength(1);
  expect(calculateTrip).toHaveBeenCalledTimes(3);
});
