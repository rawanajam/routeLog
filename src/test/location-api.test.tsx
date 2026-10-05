import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import type { LocationValue } from "@/types/trip";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function Input() {
  const [value, setValue] = useState<LocationValue>({ name: "", lat: null, lng: null });
  return <><LocationAutocomplete id="location" placeholder="Location" value={value} onChange={setValue} />
    <output data-testid="selection">{JSON.stringify(value)}</output></>;
}

it("shows a prompt before the minimum query length", () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  render(<Input />);
  fireEvent.focus(screen.getByRole("combobox"));
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "NY" } });
  expect(screen.getByText("Type at least 3 characters to search locations")).toBeInTheDocument();
  expect(fetcher).not.toHaveBeenCalled();
});

it("fetches real-service-shaped suggestions through the same-origin API and retains selection", async () => {
  const location = { name: "New York, New York, United States", lat: 40.7127, lng: -74.006 };
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [location] }) });
  vi.stubGlobal("fetch", fetcher);
  render(<Input />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "New Yo" } });
  const option = await screen.findByRole("option", { name: location.name });
  expect(fetcher).toHaveBeenCalledWith("/api/geocode/?q=New%20Yo", expect.objectContaining({ signal: expect.any(AbortSignal) }));
  fireEvent.pointerDown(option);
  fireEvent.click(option);
  expect(screen.getByRole("combobox")).toHaveValue(location.name);
  expect(screen.getByTestId("selection")).toHaveTextContent(JSON.stringify(location));
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});
