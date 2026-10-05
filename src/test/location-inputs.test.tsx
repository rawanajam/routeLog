import { useState } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { TripForm } from "@/components/TripForm";
import { searchLocations, reverseLocation } from "@/services/locations";
import type { LocationValue } from "@/types/trip";

vi.mock("@/services/locations", () => ({ searchLocations: vi.fn(), reverseLocation: vi.fn() }));
const chicago = { name: "Chicago, IL, USA", lat: 41.8781, lng: -87.6298 };
beforeEach(() => {
  vi.mocked(searchLocations).mockResolvedValue([chicago]);
  vi.mocked(reverseLocation).mockResolvedValue(chicago);
});
afterEach(() => { cleanup(); vi.resetAllMocks(); vi.useRealTimers(); vi.unstubAllGlobals(); });

function Input() {
  const [value, setValue] = useState<LocationValue>({ name: "", lat: null, lng: null });
  return <><label htmlFor="test-location">Location</label>
    <LocationAutocomplete id="test-location" value={value} onChange={setValue} placeholder="City" />
    <output data-testid="value">{JSON.stringify(value)}</output></>;
}

it("debounces, selects with keyboard, and clears coordinates after editing", async () => {
  vi.useFakeTimers();
  render(<Input />);
  const input = screen.getByRole("combobox");
  fireEvent.change(input, { target: { value: "Chic" } });
  await act(async () => { vi.advanceTimersByTime(250); });
  fireEvent.change(input, { target: { value: "Chicago" } });
  await act(async () => { vi.advanceTimersByTime(499); });
  expect(searchLocations).not.toHaveBeenCalled();
  await act(async () => { vi.advanceTimersByTime(1); });
  expect(searchLocations).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(input).toHaveValue(chicago.name);
  expect(screen.getByTestId("value")).toHaveTextContent(JSON.stringify(chicago));
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  fireEvent.change(input, { target: { value: "Chicago new address" } });
  expect(screen.getByTestId("value")).toHaveTextContent('"lat":null,"lng":null');
});

it("shows no results and service errors without blocking manual entry", async () => {
  vi.mocked(searchLocations).mockResolvedValueOnce([]).mockRejectedValueOnce(new Error("Search unavailable"));
  render(<Input />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "bad location" } });
  expect(await screen.findByText("No locations found")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "other place" } });
  expect(await screen.findByText("Search unavailable")).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toHaveValue("other place");
});

it("submits selected coordinates and still permits manually typed text", async () => {
  const submit = vi.fn();
  render(<TripForm onSubmit={submit} />);
  fireEvent.click(screen.getByText("Use sample trip"));
  fireEvent.change(screen.getByLabelText("Pickup Location"), { target: { value: "Chic" } });
  fireEvent.click(await screen.findByRole("option", { name: chicago.name }));
  fireEvent.change(screen.getByLabelText("Dropoff Location"), { target: { value: "Manual address" } });
  fireEvent.click(screen.getByText("Calculate Trip"));
  expect(submit.mock.calls[0]![0].pickup_location).toEqual(chicago);
  expect(submit.mock.calls[0]![0].dropoff_location).toEqual({ name: "Manual address", lat: null, lng: null });
});

function geolocation(getCurrentPosition: ReturnType<typeof vi.fn>) {
  vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } });
}

it("fills and submits the device coordinates after permission is accepted", async () => {
  const getPosition = vi.fn((success) => success({ coords: { latitude: chicago.lat, longitude: chicago.lng } }));
  geolocation(getPosition);
  const submit = vi.fn();
  render(<TripForm onSubmit={submit} />);
  fireEvent.click(screen.getByText("Use sample trip"));
  fireEvent.click(screen.getByRole("button", { name: "Use my current location" }));
  await waitFor(() => expect(screen.getByLabelText("Current Location")).toHaveValue(chicago.name));
  expect(reverseLocation).toHaveBeenCalledWith(chicago.lat, chicago.lng, expect.any(AbortSignal));
  fireEvent.click(screen.getByText("Calculate Trip"));
  expect(submit.mock.calls[0]![0].current_location).toEqual(chicago);
});

it.each([[1, "Location permission denied"], [2, "Unable to determine your location"], [3, "Location request timed out"]])(
  "handles geolocation failure code %s", (code, message) => {
    geolocation(vi.fn((_success, error) => error({ code })));
    render(<TripForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Use my current location" }));
    expect(screen.getByText(new RegExp(message as string))).toBeInTheDocument();
    expect(reverseLocation).not.toHaveBeenCalled();
  });

it("handles unavailable geolocation", () => {
  vi.stubGlobal("navigator", {});
  render(<TripForm onSubmit={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Use my current location" }));
  expect(screen.getByText(/Geolocation is unavailable/)).toBeInTheDocument();
});

it("keeps the previous location after a reverse lookup failure", async () => {
  geolocation(vi.fn((success) => success({ coords: { latitude: 41, longitude: -87 } })));
  vi.mocked(reverseLocation).mockRejectedValue(new Error("Reverse lookup failed"));
  render(<TripForm onSubmit={vi.fn()} />);
  fireEvent.click(screen.getByText("Use sample trip"));
  fireEvent.click(screen.getByRole("button", { name: "Use my current location" }));
  expect(await screen.findByText("Reverse lookup failed")).toBeInTheDocument();
  expect(screen.getByLabelText("Current Location")).toHaveValue("Dallas, TX");
});
