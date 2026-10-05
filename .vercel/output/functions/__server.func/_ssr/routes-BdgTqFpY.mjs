import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as useQueryClient, o as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as formatHours, c as kindLabel, d as stopLabel, f as useLatestTrip, i as formatDate, l as latestTripKey, n as cn, o as formatTime, r as dutyLabel, s as kindColor, t as DriverLogs, u as stopColor } from "./DriverLogs-DI76rMn-.mjs";
import { x as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Bed, _ as Coffee, a as Route, b as CircleCheck, c as PackageCheck, d as MapPin, f as LocateFixed, g as Flag, h as Fuel, i as ShieldCheck, l as Navigation, m as Gauge, n as TriangleAlert, o as RotateCcw, p as LoaderCircle, r as Timer, s as PackageOpen, t as Truck, u as Moon, v as Clock, x as CalendarDays, y as CircleX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BdgTqFpY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sampleTrip_default = {
	distance_miles: 1540,
	driving_hours: 28,
	total_trip_hours: 50.5,
	remaining_cycle_hours: 19.5,
	driving_days: 3,
	route: [
		[32.7767, -96.797],
		[31.55, -96.2],
		[30.6, -95.75],
		[29.7604, -95.3698],
		[30.05, -94.1],
		[30.2241, -92.0198],
		[30.4515, -91.1871],
		[30.42, -89.9],
		[30.6954, -88.0399],
		[30.47, -87.2],
		[30.4383, -84.2807],
		[29.95, -82.6],
		[29.1872, -82.1401],
		[28, -81.3],
		[26.7153, -80.0534],
		[25.7617, -80.1918]
	],
	stops: [
		{
			"id": "s1",
			"type": "start",
			"location": "Dallas, TX",
			"coordinates": [32.7767, -96.797],
			"arrival": "2026-10-05T06:00:00+00:00",
			"departure": "2026-10-05T06:00:00+00:00",
			"duration_hours": 0,
			"duty_status": "on_duty",
			"description": "Trip starts after an assumed 10-hour rest"
		},
		{
			"id": "s2",
			"type": "pickup",
			"location": "Houston, TX",
			"coordinates": [29.7604, -95.3698],
			"arrival": "2026-10-05T10:21:49.090909+00:00",
			"departure": "2026-10-05T11:21:49.090909+00:00",
			"duration_hours": 1,
			"duty_status": "on_duty",
			"description": "Pickup freight"
		},
		{
			"id": "s3",
			"type": "rest",
			"location": "Along the planned route",
			"coordinates": [30.42774234379878, -90.21635462550505],
			"arrival": "2026-10-05T18:00:00+00:00",
			"departure": "2026-10-06T04:00:00+00:00",
			"duration_hours": 10,
			"duty_status": "off_duty",
			"description": "10-hour off-duty rest"
		},
		{
			"id": "s4",
			"type": "fuel",
			"location": "Along the planned route",
			"coordinates": [30.44160854021852, -84.5853883741302],
			"arrival": "2026-10-06T11:10:54.545455+00:00",
			"departure": "2026-10-06T11:40:54.545455+00:00",
			"duration_hours": .5,
			"duty_status": "on_duty",
			"description": "Planned refueling (approximate route location)"
		},
		{
			"id": "s5",
			"type": "rest",
			"location": "Along the planned route",
			"coordinates": [29.228271147329856, -82.16486221900499],
			"arrival": "2026-10-06T15:30:00+00:00",
			"departure": "2026-10-07T01:30:00+00:00",
			"duration_hours": 10,
			"duty_status": "off_duty",
			"description": "10-hour off-duty rest"
		},
		{
			"id": "s6",
			"type": "dropoff",
			"location": "Miami, FL",
			"coordinates": [25.7617, -80.1918],
			"arrival": "2026-10-07T07:30:00+00:00",
			"departure": "2026-10-07T08:30:00+00:00",
			"duration_hours": 1,
			"duty_status": "on_duty",
			"description": "Deliver freight"
		}
	],
	events: [
		{
			"id": "e1",
			"time": "2026-10-05T06:00:00+00:00",
			"title": "Trip starts after an assumed 10-hour rest",
			"kind": "on_duty",
			"duration_hours": 0,
			"location": "Dallas, TX"
		},
		{
			"id": "e2",
			"time": "2026-10-05T06:00:00+00:00",
			"title": "Driving",
			"kind": "driving",
			"duration_hours": 4.363636363636363,
			"location": "Dallas, TX",
			"distance_miles": 240
		},
		{
			"id": "e3",
			"time": "2026-10-05T10:21:49.090909+00:00",
			"title": "Pickup freight",
			"kind": "pickup",
			"duration_hours": 1,
			"location": "Houston, TX"
		},
		{
			"id": "e4",
			"time": "2026-10-05T11:21:49.090909+00:00",
			"title": "Driving",
			"kind": "driving",
			"duration_hours": 6.636363636363637,
			"location": "Houston, TX",
			"distance_miles": 365
		},
		{
			"id": "e5",
			"time": "2026-10-05T18:00:00+00:00",
			"title": "10-hour off-duty rest",
			"kind": "off_duty",
			"duration_hours": 10,
			"location": "Along the planned route"
		},
		{
			"id": "e6",
			"time": "2026-10-06T04:00:00+00:00",
			"title": "Driving",
			"kind": "driving",
			"duration_hours": 7.181818181818182,
			"location": "Along the planned route",
			"distance_miles": 395
		},
		{
			"id": "e7",
			"time": "2026-10-06T11:10:54.545455+00:00",
			"title": "Planned refueling (approximate route location)",
			"kind": "fuel",
			"duration_hours": .5,
			"location": "Along the planned route"
		},
		{
			"id": "e8",
			"time": "2026-10-06T11:40:54.545455+00:00",
			"title": "Driving",
			"kind": "driving",
			"duration_hours": 3.8181818181818183,
			"location": "Along the planned route",
			"distance_miles": 210
		},
		{
			"id": "e9",
			"time": "2026-10-06T15:30:00+00:00",
			"title": "10-hour off-duty rest",
			"kind": "off_duty",
			"duration_hours": 10,
			"location": "Along the planned route"
		},
		{
			"id": "e10",
			"time": "2026-10-07T01:30:00+00:00",
			"title": "Driving",
			"kind": "driving",
			"duration_hours": 6,
			"location": "Along the planned route",
			"distance_miles": 330
		},
		{
			"id": "e11",
			"time": "2026-10-07T07:30:00+00:00",
			"title": "Deliver freight",
			"kind": "dropoff",
			"duration_hours": 1,
			"location": "Miami, FL"
		}
	],
	logs: [
		{
			"day": 1,
			"date": "2026-10-05",
			"total_miles": 605,
			"truck_number": "Not provided",
			"trailer_number": "Not provided",
			"carrier": "Not provided",
			"from": "Dallas, TX",
			"to": "Miami, FL",
			"remarks": [
				"06:00 Driving",
				"10:21 Pickup freight",
				"11:21 Driving",
				"18:00 10-hour off-duty rest"
			],
			"segments": [
				{
					"status": "off_duty",
					"start_hour": 0,
					"end_hour": 6,
					"note": ""
				},
				{
					"status": "driving",
					"start_hour": 6,
					"end_hour": 10.36363636361111,
					"note": "Driving"
				},
				{
					"status": "on_duty",
					"start_hour": 10.36363636361111,
					"end_hour": 11.36363636361111,
					"note": "Pickup freight"
				},
				{
					"status": "driving",
					"start_hour": 11.36363636361111,
					"end_hour": 18,
					"note": "Driving"
				},
				{
					"status": "off_duty",
					"start_hour": 18,
					"end_hour": 24,
					"note": "10-hour off-duty rest"
				}
			],
			"totals": {
				"off_duty": 12,
				"sleeper_berth": 0,
				"driving": 11,
				"on_duty": 1
			}
		},
		{
			"day": 2,
			"date": "2026-10-06",
			"total_miles": 605,
			"truck_number": "Not provided",
			"trailer_number": "Not provided",
			"carrier": "Not provided",
			"from": "Dallas, TX",
			"to": "Miami, FL",
			"remarks": [
				"04:00 Driving",
				"11:10 Planned refueling (approximate route location)",
				"11:40 Driving",
				"15:30 10-hour off-duty rest"
			],
			"segments": [
				{
					"status": "off_duty",
					"start_hour": 0,
					"end_hour": 4,
					"note": "10-hour off-duty rest"
				},
				{
					"status": "driving",
					"start_hour": 4,
					"end_hour": 11.181818181944445,
					"note": "Driving"
				},
				{
					"status": "on_duty",
					"start_hour": 11.181818181944445,
					"end_hour": 11.681818181944445,
					"note": "Planned refueling (approximate route location)"
				},
				{
					"status": "driving",
					"start_hour": 11.681818181944445,
					"end_hour": 15.5,
					"note": "Driving"
				},
				{
					"status": "off_duty",
					"start_hour": 15.5,
					"end_hour": 24,
					"note": "10-hour off-duty rest"
				}
			],
			"totals": {
				"off_duty": 12.5,
				"sleeper_berth": 0,
				"driving": 11,
				"on_duty": .5
			}
		},
		{
			"day": 3,
			"date": "2026-10-07",
			"total_miles": 330,
			"truck_number": "Not provided",
			"trailer_number": "Not provided",
			"carrier": "Not provided",
			"from": "Dallas, TX",
			"to": "Miami, FL",
			"remarks": ["01:30 Driving", "07:30 Deliver freight"],
			"segments": [
				{
					"status": "off_duty",
					"start_hour": 0,
					"end_hour": 1.5,
					"note": "10-hour off-duty rest"
				},
				{
					"status": "driving",
					"start_hour": 1.5,
					"end_hour": 7.5,
					"note": "Driving"
				},
				{
					"status": "on_duty",
					"start_hour": 7.5,
					"end_hour": 8.5,
					"note": "Deliver freight"
				},
				{
					"status": "off_duty",
					"start_hour": 8.5,
					"end_hour": 24,
					"note": ""
				}
			],
			"totals": {
				"off_duty": 17,
				"sleeper_berth": 0,
				"driving": 6,
				"on_duty": 1
			}
		}
	],
	compliance: {
		"compliant": true,
		"items": [
			{
				"id": "c1",
				"rule": "11-hour driving limit",
				"detail": "Maximum 11.00 h; limit 11 h",
				"passed": true
			},
			{
				"id": "c2",
				"rule": "14-hour driving window",
				"detail": "Maximum 12.00 h; limit 14 h",
				"passed": true
			},
			{
				"id": "c3",
				"rule": "Driving between qualifying interruptions",
				"detail": "Maximum 7.18 h; limit 8 h",
				"passed": true
			},
			{
				"id": "c4",
				"rule": "70-hour cycle while driving",
				"detail": "Maximum 49.50 h; limit 70 h",
				"passed": true
			},
			{
				"id": "c5",
				"rule": "Fuel at least every 1,000 miles",
				"detail": "Maximum 1000.00 mi; limit 1000 mi",
				"passed": true
			},
			{
				"id": "c6",
				"rule": "Rest and schedule continuity",
				"detail": "Initial 10-hour rest assumed; only 10h off duty resets a shift and 34h resets the cycle",
				"passed": true
			}
		]
	}
};
/** Static offline demo generated by backend/generate_sample.py. No UI HOS math. */
function buildMockTrip(_request) {
	return structuredClone(sampleTrip_default);
}
var sampleTripRequest = {
	current_location: {
		name: "Dallas, TX",
		lat: 32.7767,
		lng: -96.797
	},
	pickup_location: {
		name: "Houston, TX",
		lat: 29.7604,
		lng: -95.3698
	},
	dropoff_location: {
		name: "Miami, FL",
		lat: 25.7617,
		lng: -80.1918
	},
	current_cycle_used: 20
};
var TripApiError = class extends Error {
	field;
	constructor(message, field) {
		super(message);
		this.name = "TripApiError";
		this.field = field;
	}
};
/** Base URL for the Django REST backend. Empty = same origin. */
var API_URL = ({
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "http://127.0.0.1:8000"
}["VITE_API_URL"] ?? "").replace(/\/$/, "");
/** Toggle to switch from mock data to the real backend. */
var USE_MOCK = !{
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "http://127.0.0.1:8000"
}["VITE_API_URL"];
async function calculateTrip(data) {
	if (USE_MOCK) {
		await new Promise((r) => setTimeout(r, 1400));
		return buildMockTrip(data);
	}
	let response;
	try {
		response = await fetch(`${API_URL}/api/trip/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
	} catch {
		throw new TripApiError("Backend unavailable. Please try again shortly.");
	}
	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new TripApiError(body?.detail ?? "Unable to calculate trip.", body?.field);
	}
	return await response.json();
}
async function locationRequest(path, signal) {
	let response;
	try {
		response = await fetch(`${API_URL}${path}`, signal ? { signal } : {});
	} catch (error) {
		if (signal?.aborted) throw error;
		throw new Error("Location service unavailable. You can still enter a location manually.");
	}
	const body = await response.json().catch(() => null);
	if (!response.ok || !body) throw new Error(body?.detail ?? "Unable to look up locations. Please try again.");
	return body;
}
async function searchLocations(query, signal) {
	return (await locationRequest(`/api/geocode/?q=${encodeURIComponent(query)}`, signal)).results;
}
function reverseLocation(lat, lng, signal) {
	return locationRequest(`/api/reverse-geocode/?lat=${lat}&lng=${lng}`, signal);
}
function LocationAutocomplete({ id, value, onChange, placeholder, disabled }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [active, setActive] = (0, import_react.useState)(-1);
	const query = value.name.trim();
	const showSuggestions = open && !disabled && value.lat === null;
	const searching = showSuggestions && query.length >= 3;
	(0, import_react.useEffect)(() => {
		setResults([]);
		setActive(-1);
		setError("");
		setBusy(searching);
		if (!searching) return;
		const controller = new AbortController();
		const timer = setTimeout(() => {
			searchLocations(query, controller.signal).then((locations) => {
				if (!controller.signal.aborted) setResults(locations);
			}).catch((reason) => {
				if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Location search failed.");
			}).finally(() => {
				if (!controller.signal.aborted) setBusy(false);
			});
		}, 500);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [query, searching]);
	const select = (location) => {
		onChange(location);
		setOpen(false);
		setActive(-1);
	};
	const keyDown = (event) => {
		if (event.key === "Escape") {
			setOpen(false);
			return;
		}
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setOpen(true);
			setActive((index) => !results.length ? -1 : index < 0 ? event.key === "ArrowDown" ? 0 : results.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
		} else if (event.key === "Enter" && searching && active >= 0 && results[active]) {
			event.preventDefault();
			select(results[active]);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full min-w-0 flex-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			role: "combobox",
			"aria-autocomplete": "list",
			"aria-expanded": showSuggestions,
			"aria-controls": `${id}-suggestions`,
			"aria-activedescendant": active >= 0 ? `${id}-option-${active}` : void 0,
			autoComplete: "off",
			maxLength: 300,
			value: value.name,
			placeholder,
			disabled,
			className: "h-full w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 disabled:opacity-60",
			onFocus: () => setOpen(true),
			onBlur: () => setOpen(false),
			onKeyDown: keyDown,
			onChange: (event) => {
				onChange({
					name: event.target.value,
					lat: null,
					lng: null
				});
				setOpen(true);
			}
		}), showSuggestions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute left-0 right-0 top-full z-50 mt-2 min-w-64 rounded-lg border border-border bg-card p-1 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-live": "polite",
					className: "text-xs text-muted-foreground",
					children: !searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-2",
						children: "Type at least 3 characters to search locations"
					}) : busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Searching locations…"]
					}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-2 text-destructive",
						children: error
					}) : !results.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-2",
						children: "No locations found"
					}) : null
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					id: `${id}-suggestions`,
					role: "listbox",
					"aria-label": "Location suggestions",
					children: results.map((location, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						id: `${id}-option-${index}`,
						role: "option",
						"aria-selected": active === index,
						className: `cursor-pointer rounded-md p-2 text-sm hover:bg-muted ${active === index ? "bg-muted" : ""}`,
						onPointerDown: (event) => event.preventDefault(),
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => select(location),
						children: location.name
					}, `${location.lat},${location.lng},${location.name}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "border-t border-border px-2 pt-1 text-[10px] text-muted-foreground",
					children: [
						"© ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://www.openstreetmap.org/copyright",
							target: "_blank",
							rel: "noreferrer",
							children: "OpenStreetMap contributors"
						}),
						" · Photon"
					]
				})
			]
		})]
	});
}
function CurrentLocationButton({ disabled, onLocation, onError, onBusyChange }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const controller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => () => controller.current?.abort(), []);
	const locate = () => {
		onError("");
		if (!navigator.geolocation) {
			onError("Geolocation is unavailable. Enter your location manually.");
			return;
		}
		const request = new AbortController();
		controller.current = request;
		setBusy(true);
		onBusyChange(true);
		const finish = () => {
			if (!request.signal.aborted) {
				setBusy(false);
				onBusyChange(false);
			}
		};
		navigator.geolocation.getCurrentPosition(async (position) => {
			if (request.signal.aborted) return;
			try {
				const location = await reverseLocation(position.coords.latitude, position.coords.longitude, request.signal);
				if (!request.signal.aborted) onLocation(location);
			} catch (reason) {
				if (!request.signal.aborted) onError(reason instanceof Error ? reason.message : "Unable to name your location. Enter it manually.");
			} finally {
				finish();
			}
		}, (error) => {
			if (request.signal.aborted) return;
			onError(error.code === 1 ? "Location permission denied. Allow location access or enter it manually." : error.code === 3 ? "Location request timed out. Try again or enter it manually." : "Unable to determine your location. Enter it manually.");
			finish();
		}, {
			enableHighAccuracy: true,
			timeout: 15e3,
			maximumAge: 6e4
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: locate,
		disabled: disabled || busy,
		title: "Use my current location",
		"aria-label": busy ? "Finding your current location" : "Use my current location",
		className: "shrink-0 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
		children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "h-4 w-4" })
	});
}
function Field({ id, label, icon, error, helper, suffix, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: "text-sm font-medium text-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex h-11 items-center gap-2.5 rounded-lg border bg-card px-3 transition-shadow focus-within:ring-2 focus-within:ring-ring/40", error ? "border-destructive focus-within:ring-destructive/30" : "border-input focus-within:border-ring"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("shrink-0", error ? "text-destructive" : "text-muted-foreground"),
						children: icon
					}),
					children,
					suffix && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-sm text-muted-foreground",
						children: suffix
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: error
			}) : helper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: helper
			}) : null
		]
	});
}
var inputCls = "h-full w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60";
function TripForm({ onSubmit, loading, serverErrors }) {
	const [values, setValues] = (0, import_react.useState)({
		current: {
			name: "",
			lat: null,
			lng: null
		},
		pickup: {
			name: "",
			lat: null,
			lng: null
		},
		dropoff: {
			name: "",
			lat: null,
			lng: null
		},
		cycle: ""
	});
	const [locationError, setLocationError] = (0, import_react.useState)("");
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const all = {
		...serverErrors,
		...errors
	};
	const setLocation = (k, value) => {
		setValues((v) => ({
			...v,
			[k]: value
		}));
		if (k === "current") setLocationError("");
		const field = `${k}_location`;
		setErrors((previous) => {
			const next = { ...previous };
			delete next[field];
			return next;
		});
	};
	const submit = (e) => {
		e.preventDefault();
		const next = {};
		if (locating) return;
		if (!values.current.name.trim()) next.current_location = "Enter a current location";
		if (!values.pickup.name.trim()) next.pickup_location = "Enter a pickup location";
		if (!values.dropoff.name.trim()) next.dropoff_location = "Enter a dropoff location";
		const cycle = Number(values.cycle);
		if (values.cycle === "" || Number.isNaN(cycle) || cycle < 0 || cycle > 70) next.current_cycle_used = "Current cycle hours must be between 0 and 70";
		setErrors(next);
		if (Object.keys(next).length) return;
		onSubmit({
			current_location: {
				...values.current,
				name: values.current.name.trim()
			},
			pickup_location: {
				...values.pickup,
				name: values.pickup.name.trim()
			},
			dropoff_location: {
				...values.dropoff,
				name: values.dropoff.name.trim()
			},
			current_cycle_used: cycle
		});
	};
	const fillSample = () => {
		setValues({
			current: { ...sampleTripRequest.current_location },
			pickup: { ...sampleTripRequest.pickup_location },
			dropoff: { ...sampleTripRequest.dropoff_location },
			cycle: "20"
		});
		setErrors({});
		setLocationError("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		noValidate: true,
		className: "panel relative z-20 p-5 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					id: "current",
					label: "Current Location",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-4 w-4" }),
					error: locationError || all.current_location,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationAutocomplete, {
						id: "current",
						placeholder: "Enter current location",
						value: values.current,
						onChange: (value) => setLocation("current", value),
						disabled: loading || locating
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentLocationButton, {
						disabled: loading,
						onLocation: (value) => setLocation("current", value),
						onError: setLocationError,
						onBusyChange: setLocating
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "pickup",
					label: "Pickup Location",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageOpen, { className: "h-4 w-4" }),
					error: all.pickup_location,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationAutocomplete, {
						id: "pickup",
						placeholder: "Enter pickup location",
						value: values.pickup,
						onChange: (value) => setLocation("pickup", value),
						disabled: loading
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "dropoff",
					label: "Dropoff Location",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4" }),
					error: all.dropoff_location,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationAutocomplete, {
						id: "dropoff",
						placeholder: "Enter dropoff location",
						value: values.dropoff,
						onChange: (value) => setLocation("dropoff", value),
						disabled: loading
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "cycle",
					label: "Current Cycle Used",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4" }),
					error: all.current_cycle_used,
					helper: "Hours already used in the current 70-hour cycle",
					suffix: "hrs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "cycle",
						type: "number",
						min: 0,
						max: 70,
						step: .25,
						className: inputCls,
						placeholder: "0",
						value: values.cycle,
						onChange: (event) => setValues((v) => ({
							...v,
							cycle: event.target.value
						})),
						disabled: loading
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-col-reverse items-stretch gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: fillSample,
				disabled: loading || locating,
				className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), " Use sample trip"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: loading || locating,
				className: "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
				children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), loading ? "Calculating…" : "Calculate Trip"]
			})]
		})]
	});
}
function TripSummary({ trip }) {
	const items = [
		{
			label: "Total Distance",
			value: `${trip.distance_miles.toLocaleString()} mi`,
			icon: Route
		},
		{
			label: "Driving Time",
			value: formatHours(trip.driving_hours),
			icon: Clock
		},
		{
			label: "Total Trip Duration",
			value: formatHours(trip.total_trip_hours),
			icon: Timer
		},
		{
			label: "Remaining Cycle",
			value: `${formatHours(trip.remaining_cycle_hours)} left`,
			icon: Gauge
		},
		{
			label: "Driving Days",
			value: `${trip.driving_days} days`,
			icon: CalendarDays
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
		children: items.map(({ label, value, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel flex items-center gap-3 p-4 last:col-span-2 md:last:col-span-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs font-medium text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-lg font-semibold tracking-tight",
					children: value
				})]
			})]
		}, label))
	});
}
var legend = [
	"start",
	"pickup",
	"fuel",
	"break",
	"rest",
	"dropoff"
];
function RouteMap({ route, stops }) {
	const fallback = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "route-grid h-full w-full animate-pulse bg-muted" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel isolate flex h-full flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Route Map"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap gap-x-3 gap-y-1.5",
					children: legend.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2.5 w-2.5 rounded-full ${stopColor[t]}` }), t === "break" ? "Break" : t === "fuel" ? "Fuel" : t === "rest" ? "Rest" : stopLabel[t]]
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-[380px] flex-1 lg:min-h-[480px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-t border-border px-5 py-2.5 text-xs text-muted-foreground",
				children: "Drag to explore, use + / − to zoom, and click a stop for details."
			})
		]
	});
}
var kindIcon = {
	driving: Truck,
	on_duty: Clock,
	off_duty: Moon,
	sleeper_berth: Bed,
	fuel: Fuel,
	break: Coffee,
	pickup: PackageOpen,
	dropoff: PackageCheck
};
var stopIcon = {
	start: Navigation,
	pickup: PackageOpen,
	fuel: Fuel,
	break: Coffee,
	rest: Bed,
	dropoff: Flag
};
function TripTimeline({ events }) {
	let lastDay = "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel flex h-full flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "Trip Timeline (UTC)"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "max-h-[540px] flex-1 overflow-y-auto px-5 py-4",
			children: events.map((e, i) => {
				const Icon = kindIcon[e.kind] ?? kindIcon.on_duty;
				const day = e.time.slice(0, 10);
				const showDay = day !== lastDay;
				lastDay = day;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [showDay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground first:mt-0",
					children: formatDate(day)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex gap-3 pb-4",
					children: [
						i < events.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ${kindColor[e.kind] ?? kindColor.on_duty} text-primary-foreground`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 pt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-muted-foreground",
									children: formatTime(e.time)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground",
										children: kindLabel[e.kind] ?? "Event"
									}),
									e.duration_hours !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatHours(e.duration_hours) }),
									e.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate",
										children: ["· ", e.location]
									})
								]
							})]
						})
					]
				})] }, e.id);
			})
		})]
	});
}
function PlannedStops({ stops }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "Planned Stops"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "divide-y divide-border",
			children: stops.map((s, i) => {
				const Icon = stopIcon[s.type];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid grid-cols-[auto_1fr] gap-4 px-5 py-4 md:grid-cols-[4rem_minmax(0,1fr)_14rem_6rem_8rem] md:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-5 text-right font-mono text-xs text-muted-foreground",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-9 w-9 place-items-center rounded-lg ${stopColor[s.type]} text-primary-foreground`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: stopLabel[s.type]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-foreground/80",
									children: s.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: s.description
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-start-2 text-xs md:col-start-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Arrive → Depart"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono",
								children: [
									formatDate(s.arrival),
									" ",
									formatTime(s.arrival),
									" → ",
									s.arrival.slice(0, 10) !== s.departure.slice(0, 10) ? `${formatDate(s.departure)} ` : "",
									formatTime(s.departure)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-start-2 text-xs md:col-start-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Duration"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono",
								children: s.duration_hours ? formatHours(s.duration_hours) : "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "col-start-2 w-fit rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium md:col-start-auto md:justify-self-end",
							children: dutyLabel[s.duty_status]
						})
					]
				}, s.id);
			})
		})]
	});
}
function ComplianceSummary({ compliance }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-5 py-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "HOS Compliance Summary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${compliance.compliant ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), compliance.compliant ? "Compliant" : "Issues found"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-5 py-3 text-xs text-muted-foreground",
				children: "Checks apply to this planned schedule, assuming an initial 10-hour rest. Previous daily duty records are unavailable; cycle recapture is not assumed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3",
				children: compliance.items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 bg-card p-4",
					children: [c.passed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-5 w-5 shrink-0 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 h-5 w-5 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: c.rule
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: c.detail
					})] })]
				}, c.id))
			})
		]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
function EmptyState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel route-grid relative overflow-hidden px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 320 80",
				className: "mx-auto mb-6 h-16 w-72",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M20 60 C 90 60, 100 20, 160 20 S 240 60, 300 30",
						fill: "none",
						className: "stroke-input",
						strokeWidth: 3,
						strokeDasharray: "6 8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: 20,
						cy: 60,
						r: 8,
						className: "fill-navy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: 160,
						cy: 20,
						r: 6,
						className: "fill-status-pickup"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: 300,
						cy: 30,
						r: 8,
						className: "fill-primary"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold",
				children: "No trip calculated yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1.5 max-w-md text-sm text-muted-foreground",
				children: "Enter your trip details above to generate your route, stops, and driver logs."
			})
		]
	});
}
function LoadingState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		"aria-busy": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }), "Calculating route and Hours of Service schedule..."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
				children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[74px] rounded-xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[2fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[480px] rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[480px] rounded-xl" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" })
		]
	});
}
function ErrorState({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "alert",
		className: "panel flex flex-col items-start gap-4 border-destructive/30 p-5 sm:flex-row sm:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Unable to calculate trip"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: message
				})]
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onRetry,
				className: "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Retry"]
			})
		]
	});
}
function TripPlanner() {
	const queryClient = useQueryClient();
	const latestTrip = useLatestTrip();
	const mutation = useMutation({
		mutationFn: (data) => calculateTrip(data),
		onSuccess: (trip) => queryClient.setQueryData(latestTripKey, trip)
	});
	const trip = mutation.data ?? latestTrip;
	const err = mutation.error;
	const fieldErr = err instanceof TripApiError && err.field ? { [err.field]: err.message } : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight sm:text-3xl",
				children: "Plan Your Trip"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground sm:text-base",
				children: "Generate your route, driving schedule, planned stops, and daily driver logs."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripForm, {
				onSubmit: (d) => mutation.mutate(d),
				loading: mutation.isPending,
				serverErrors: fieldErr
			}),
			mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {}) : err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				message: err.message || "Unable to calculate trip.",
				onRetry: mutation.variables ? () => mutation.mutate(mutation.variables) : void 0
			}) : trip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripSummary, { trip }),
					USE_MOCK && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Demo data: this is a fixed Dallas–Houston–Miami sample, not a calculation for the entered locations or cycle hours."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-[2fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteMap, {
							route: trip.route,
							stops: trip.stops
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripTimeline, { events: trip.events })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlannedStops, { stops: trip.stops }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriverLogs, { logs: trip.logs }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplianceSummary, { compliance: trip.compliance })
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {})
		]
	});
}
var SplitComponent = TripPlanner;
//#endregion
export { SplitComponent as component };
