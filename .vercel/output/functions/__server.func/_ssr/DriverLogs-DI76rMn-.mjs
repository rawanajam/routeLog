import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, n as useQuery, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as skipToken } from "../_libs/tanstack__query-core.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DriverLogs-DI76rMn-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var latestTripKey = ["latest-calculated-trip"];
/** Share the exact backend result across routes without recalculating it. */
function useLatestTrip() {
	return useQuery({
		queryKey: latestTripKey,
		queryFn: skipToken,
		staleTime: Infinity,
		gcTime: Infinity
	}).data;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var formatHours = (h) => {
	const totalMinutes = Math.round(h * 60);
	const hrs = Math.floor(totalMinutes / 60);
	const mins = totalMinutes % 60;
	if (hrs === 0) return `${mins}m`;
	return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
};
var formatTime = (iso) => iso.slice(11, 16);
var formatDate = (iso) => new Date(iso.length === 10 ? iso + "T12:00:00Z" : iso).toLocaleDateString("en-US", {
	weekday: "short",
	month: "short",
	day: "numeric",
	timeZone: "UTC"
});
var dutyLabel = {
	off_duty: "Off Duty",
	sleeper_berth: "Sleeper Berth",
	driving: "Driving",
	on_duty: "On Duty"
};
var kindLabel = {
	driving: "Driving",
	on_duty: "On Duty",
	off_duty: "Off Duty",
	sleeper_berth: "Sleeper Berth",
	fuel: "Fuel",
	break: "Break",
	pickup: "Pickup",
	dropoff: "Dropoff"
};
var kindColor = {
	driving: "bg-status-driving",
	on_duty: "bg-status-on",
	off_duty: "bg-status-off",
	sleeper_berth: "bg-status-sleeper",
	fuel: "bg-status-fuel",
	break: "bg-status-break",
	pickup: "bg-status-pickup",
	dropoff: "bg-status-dropoff"
};
var stopLabel = {
	start: "Start",
	pickup: "Pickup",
	fuel: "Fuel Stop",
	break: "30-Min Break",
	rest: "Rest Stop",
	dropoff: "Dropoff"
};
var stopColor = {
	start: "bg-navy",
	pickup: "bg-status-pickup",
	fuel: "bg-status-fuel",
	break: "bg-status-break",
	rest: "bg-status-sleeper",
	dropoff: "bg-status-dropoff"
};
var ROWS = [
	"off_duty",
	"sleeper_berth",
	"driving",
	"on_duty"
];
var ROW_LABEL = {
	...dutyLabel,
	on_duty: "On Duty (ND)"
};
var W = 1e3;
var LEFT = 120;
var RIGHT = 64;
var TOP = 28;
var ROW_H = 36;
var GRID_W = 816;
var H = 180;
var x = (h) => LEFT + h / 24 * GRID_W;
var y = (s) => TOP + ROWS.indexOf(s) * ROW_H + ROW_H / 2;
/** Builds the connected ELD path from segment data. */
function buildPath(segments) {
	return [...segments].sort((a, b) => a.start_hour - b.start_hour).map((s, i) => {
		return `${i === 0 ? `M ${x(s.start_hour)} ${y(s.status)}` : `L ${x(s.start_hour)} ${y(s.status)}`} L ${x(s.end_hour)} ${y(s.status)}`;
	}).join(" ");
}
function DailyLogGraph({ events, totals }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${W} ${H}`,
			className: "w-full min-w-[680px]",
			role: "img",
			"aria-label": "24-hour duty status graph",
			children: [
				Array.from({ length: 25 }, (_, h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: x(h),
					y: 16,
					textAnchor: "middle",
					className: "fill-muted-foreground font-mono",
					fontSize: 10,
					children: h === 0 || h === 24 ? "M" : h === 12 ? "N" : String(h).padStart(2, "0")
				}, h)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: W - RIGHT / 2,
					y: 16,
					textAnchor: "middle",
					className: "fill-muted-foreground",
					fontSize: 10,
					fontWeight: 600,
					children: "HRS"
				}),
				ROWS.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: LEFT,
						y: TOP + i * ROW_H,
						width: GRID_W,
						height: ROW_H,
						className: i % 2 ? "fill-card" : "fill-muted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: 110,
						y: y(r) + 4,
						textAnchor: "end",
						fontSize: 11,
						fontWeight: 500,
						className: "fill-foreground",
						children: ROW_LABEL[r]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: W - RIGHT / 2,
						y: y(r) + 4,
						textAnchor: "middle",
						fontSize: 11,
						fontWeight: 600,
						className: "fill-foreground font-mono",
						children: formatHours(totals[r])
					})
				] }, r)),
				Array.from({ length: 97 }, (_, q) => {
					const h = q / 4;
					const major = q % 4 === 0;
					return ROWS.map((_, i) => {
						const top = TOP + i * ROW_H;
						const len = major ? ROW_H : q % 2 === 0 ? ROW_H * .45 : ROW_H * .25;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: x(h),
							x2: x(h),
							y1: top,
							y2: top + len,
							className: "stroke-border",
							strokeWidth: major ? 1 : .75
						}, `${q}-${i}`);
					});
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: LEFT,
					y: TOP,
					width: GRID_W,
					height: 144,
					fill: "none",
					className: "stroke-input"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: buildPath(events),
					fill: "none",
					className: "stroke-primary",
					strokeWidth: 2.75,
					strokeLinejoin: "round",
					strokeLinecap: "round"
				})
			]
		})
	});
}
var ORDER = [
	"off_duty",
	"sleeper_berth",
	"driving",
	"on_duty"
];
function DriverLogs({ logs }) {
	const [active, setActive] = (0, import_react.useState)(0);
	const selected = Math.min(active, Math.max(0, logs.length - 1));
	const log = logs[selected];
	if (!log) return null;
	const total = ORDER.reduce((s, k) => s + log.totals[k], 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "Driver Daily Logs (UTC)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "tablist",
				className: "inline-flex rounded-lg bg-secondary p-1",
				children: logs.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					role: "tab",
					"aria-selected": i === selected,
					onClick: () => setActive(i),
					className: cn("rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors", i === selected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
					children: ["Day ", l.day]
				}, l.day))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyLogGraph, {
				events: log.segments,
				totals: log.totals
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-[2fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-3",
					children: [[
						["Date", formatDate(log.date)],
						["Total Miles", `${log.total_miles.toLocaleString()} mi`],
						["Carrier", log.carrier],
						["Truck / Tractor", log.truck_number],
						["Trailer", log.trailer_number],
						["Route", `${log.from} → ${log.to}`]
					].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "truncate font-medium",
							children: v
						})]
					}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Remarks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 space-y-0.5 font-mono text-xs",
							children: log.remarks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: r }, r))
						}) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Totals"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-1.5 text-sm",
						children: [ORDER.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: dutyLabel[k]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-medium",
								children: formatHours(log.totals[k])
							})]
						}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between border-t border-border pt-1.5 font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: formatHours(total)
							})]
						})]
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { formatHours as a, kindLabel as c, stopLabel as d, useLatestTrip as f, formatDate as i, latestTripKey as l, cn as n, formatTime as o, dutyLabel as r, kindColor as s, DriverLogs as t, stopColor as u };
