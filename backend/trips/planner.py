"""Conservative 70/8 planning; a fresh shift starts after prior 10h rest.

Prior daily duty history is unavailable, so no rolling-cycle recapture or
split-sleeper exceptions are inferred. Use a 34h restart when cycle is spent.
"""
from datetime import datetime, timedelta, timezone
from .compliance import check_schedule

STATUSES = ("off_duty", "sleeper_berth", "driving", "on_duty")
EPS = 1e-8


class Planner:
    def __init__(self, request, points, start):
        self.request = request
        self.start = self.now = start
        self.shift_start = start
        self.cycle = request["current_cycle_used"]
        self.shift_driving = self.break_driving = self.fuel_miles = 0.0
        self.non_driving_hours = 0.0
        self.position = points[0]
        self.location = request["current_location"]
        self.stops, self.events, self.segments = [], [], []
        self.max_drive = self.max_window = self.max_cycle = self.max_break = self.max_fuel = 0.0

    def add(self, hours, status, title, kind, miles=0):
        end = self.now + timedelta(hours=hours)
        self.events.append({"id": f"e{len(self.events) + 1}", "time": self.now.isoformat(),
            "title": title, "kind": kind, "duration_hours": hours, "location": self.location,
            "_coordinates": list(self.position), **({"distance_miles": miles} if status == "driving" else {})})
        if hours > EPS:
            self.segments.append((self.now, end, status, title, miles))
        if status in ("driving", "on_duty"):
            self.cycle += hours
        if status == "driving":
            self.non_driving_hours = 0
            self.shift_driving += hours
            self.break_driving += hours
            self.fuel_miles += miles
            self.max_drive = max(self.max_drive, self.shift_driving)
            self.max_window = max(self.max_window, (end - self.shift_start).total_seconds() / 3600)
            self.max_break = max(self.max_break, self.break_driving)
            self.max_fuel = max(self.max_fuel, self.fuel_miles)
            self.max_cycle = max(self.max_cycle, self.cycle)
        else:
            self.non_driving_hours += hours
            if self.non_driving_hours >= 0.5 - EPS:
                self.break_driving = 0
        self.now = end

    def stop(self, kind, hours, status, title):
        arrival = self.now
        self.add(hours, status, title, status if kind in ("start", "rest") else kind)
        self.stops.append({"id": f"s{len(self.stops) + 1}", "type": kind,
            "location": self.location, "coordinates": list(self.position),
            "arrival": arrival.isoformat(), "departure": self.now.isoformat(),
            "duration_hours": hours, "duty_status": status, "description": title})

    def rest(self, restart=False):
        self.stop("rest", 34 if restart else 10, "off_duty",
                  "34-hour cycle restart" if restart else "10-hour off-duty rest")
        self.shift_start = self.now
        self.shift_driving = self.break_driving = 0
        if restart:
            self.cycle = 0

    def service(self, kind, hours, title):
        # HOS limits restrict subsequent driving, not on-duty non-driving work.
        # Loading/unloading still counts toward the cycle and elapsed window.
        self.stop(kind, hours, "on_duty", title)
        if kind == "fuel":
            self.fuel_miles = 0

    def drive(self, leg):
        elapsed = 0.0
        while elapsed < leg.hours - EPS:
            if self.cycle >= 70 - EPS:
                self.rest(restart=True)
                continue
            window = (self.now - self.shift_start).total_seconds() / 3600
            if self.shift_driving >= 11 - EPS or window >= 14 - EPS:
                self.rest()
                continue
            if self.fuel_miles >= 1000 - EPS:
                self.service("fuel", 0.5, "Planned refueling (approximate route location)")
                continue
            if self.break_driving >= 8 - EPS:
                self.stop("break", 0.5, "off_duty", "30-minute driving break")
                continue
            speed = leg.miles / leg.hours
            hours = min(leg.hours - elapsed, 11 - self.shift_driving, 14 - window,
                        70 - self.cycle, 8 - self.break_driving,
                        (1000 - self.fuel_miles) / speed if speed else float("inf"))
            self.add(hours, "driving", "Driving", "driving", hours * speed)
            elapsed += hours
            self.position = leg.position(elapsed / leg.hours)
            self.location = "Along the planned route"

    def logs(self):
        midnight = self.start.replace(hour=0, minute=0, second=0, microsecond=0)
        last = (self.now - timedelta(microseconds=1)).date()
        logs = []
        while midnight.date() <= last:
            end_day = midnight + timedelta(days=1)
            segments, remarks = [], []
            miles = 0.0
            cursor = midnight
            for start, end, status, title, distance in self.segments:
                a, b = max(start, midnight), min(end, end_day)
                if b <= a:
                    continue
                if a > cursor:
                    segments.append(self.log_segment(cursor, a, "off_duty", midnight))
                segments.append(self.log_segment(a, b, status, midnight, title))
                miles += distance * (b - a).total_seconds() / (end - start).total_seconds()
                if midnight <= start < end_day:
                    remarks.append(f"{start:%H:%M} {title}")
                cursor = b
            if cursor < end_day:
                segments.append(self.log_segment(cursor, end_day, "off_duty", midnight))
            totals = {status: sum(s["end_hour"] - s["start_hour"] for s in segments if s["status"] == status)
                      for status in STATUSES}
            # Preserve a 24h partition while removing binary floating-point drift.
            last_status = next(status for status in reversed(STATUSES) if totals[status] > EPS)
            prefix = STATUSES[:STATUSES.index(last_status)]
            totals[last_status] = 24 - sum(totals[status] for status in prefix)
            logs.append({"day": len(logs) + 1, "date": midnight.date().isoformat(),
                "total_miles": round(miles, 2), "truck_number": "Not provided",
                "trailer_number": "Not provided", "carrier": "Not provided",
                "from": self.request["current_location"], "to": self.request["dropoff_location"],
                "remarks": remarks, "segments": segments, "totals": totals})
            midnight = end_day
        return logs

    @staticmethod
    def log_segment(start, end, status, midnight, note=""):
        return {"status": status, "start_hour": (start - midnight).total_seconds() / 3600,
                "end_hour": (end - midnight).total_seconds() / 3600, "note": note}


def plan_trip(request, points, legs, start=None):
    if start is None:
        start = (datetime.now(timezone.utc) + timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
    planner = Planner(request, points, start)
    planner.stop("start", 0, "on_duty", "Trip starts after an assumed 10-hour rest")
    planner.drive(legs[0])
    planner.position, planner.location = points[1], request["pickup_location"]
    planner.service("pickup", 1, "Pickup freight")
    planner.drive(legs[1])
    planner.position, planner.location = points[2], request["dropoff_location"]
    planner.service("dropoff", 1, "Deliver freight")
    logs = planner.logs()
    return {"distance_miles": round(sum(leg.miles for leg in legs), 2),
        "driving_hours": round(sum(leg.hours for leg in legs), 4),
        "total_trip_hours": (planner.now - start).total_seconds() / 3600,
        "remaining_cycle_hours": max(0, 70 - planner.cycle),
        "driving_days": sum(log["totals"]["driving"] > EPS for log in logs),
        "route": legs[0].points + legs[1].points[1:], "stops": planner.stops,
        "events": planner.events, "logs": logs,
        "compliance": check_schedule(planner.events, request["current_cycle_used"])}
