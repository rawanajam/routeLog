"""Replay the returned activity stream independently of scheduler counters."""
from datetime import datetime, timedelta

EPS = 1e-7


def check_schedule(events, initial_cycle):
    cycle = initial_cycle
    shift_start = None
    driving = since_break = non_driving = off_duty = fuel_miles = 0.0
    maxima = {"driving": 0.0, "window": 0.0, "break": 0.0, "cycle": 0.0, "fuel": 0.0}
    previous_end = None
    continuous = True
    for event in events:
        hours = event.get("duration_hours", 0)
        if hours <= 0:
            continue
        start = datetime.fromisoformat(event["time"])
        end = start + timedelta(hours=hours)
        if previous_end is not None and abs((start - previous_end).total_seconds()) > 0.01:
            continuous = False
        previous_end = end
        kind = event["kind"]
        if kind in ("off_duty", "sleeper_berth", "break"):
            off_duty += hours
            non_driving += hours
            if off_duty >= 10 - EPS:
                shift_start = None
                driving = 0
            if off_duty >= 34 - EPS:
                cycle = 0
        else:
            off_duty = 0
            if shift_start is None:
                shift_start = start
            cycle += hours
            if kind == "driving":
                driving += hours
                since_break += hours
                fuel_miles += event.get("distance_miles", 0)
                maxima["driving"] = max(maxima["driving"], driving)
                maxima["window"] = max(maxima["window"], (end - shift_start).total_seconds() / 3600)
                maxima["break"] = max(maxima["break"], since_break)
                maxima["cycle"] = max(maxima["cycle"], cycle)
                maxima["fuel"] = max(maxima["fuel"], fuel_miles)
                non_driving = 0
            else:
                non_driving += hours
                if kind == "fuel":
                    fuel_miles = 0
        if non_driving >= 0.5 - EPS:
            since_break = 0
    rules = [
        ("11-hour driving limit", "driving", 11, "h"),
        ("14-hour driving window", "window", 14, "h"),
        ("Driving between qualifying interruptions", "break", 8, "h"),
        ("70-hour cycle while driving", "cycle", 70, "h"),
        ("Fuel at least every 1,000 miles", "fuel", 1000, "mi"),
    ]
    items = [{"id": f"c{i}", "rule": rule,
              "detail": f"Maximum {maxima[key]:.2f} {unit}; limit {limit} {unit}",
              "passed": maxima[key] <= limit + EPS} for i, (rule, key, limit, unit) in enumerate(rules, 1)]
    items.append({"id": "c6", "rule": "Rest and schedule continuity",
        "detail": "Initial 10-hour rest assumed; only 10h off duty resets a shift and 34h resets the cycle",
        "passed": continuous and all(item["passed"] for item in items[:4])})
    return {"compliant": all(item["passed"] for item in items), "items": items}
