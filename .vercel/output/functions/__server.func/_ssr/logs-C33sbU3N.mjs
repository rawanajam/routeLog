import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as useLatestTrip, t as DriverLogs } from "./DriverLogs-DI76rMn-.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logs-C33sbU3N.js
var import_jsx_runtime = require_jsx_runtime();
function LogsPage() {
	const trip = useLatestTrip();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight sm:text-3xl",
			children: "Driver Logs"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: trip ? `Daily log sheets for ${trip.logs[0]?.from ?? "your trip"} → ${trip.logs[0]?.to ?? "your destination"}.` : "Daily log sheets from your latest calculated trip."
		})] }), trip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriverLogs, { logs: trip.logs }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel space-y-3 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Calculate a trip in the Trip Planner to see its daily logs here."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
				children: "Open Trip Planner"
			})]
		})]
	});
}
//#endregion
export { LogsPage as component };
