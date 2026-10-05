"""Optional realistic integration checks against live mapping providers."""
import json
import os
from datetime import datetime, timezone
from pathlib import Path
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from django.test import Client
from trips.test_hos import HosAuditTests

cases = [
    ("Dallas–Houston–Miami", "Dallas, TX", "Houston, TX", "Miami, FL", 20),
    ("Chicago–Indianapolis–Nashville, nearly exhausted cycle", "Chicago, IL", "Indianapolis, IN", "Nashville, TN", 69),
    ("Los Angeles–Phoenix–Las Vegas", "Los Angeles, CA", "Phoenix, AZ", "Las Vegas, NV", 0),
]
results = []
for name, current, pickup, dropoff, cycle in cases:
    response = Client(HTTP_HOST="localhost").post("/api/trip/", json.dumps({
        "current_location": current, "pickup_location": pickup,
        "dropoff_location": dropoff, "current_cycle_used": cycle}), content_type="application/json")
    data = response.json()
    if response.status_code != 200:
        raise RuntimeError(f"{name}: HTTP {response.status_code}: {data}")
    HosAuditTests().verify(data, cycle)
    result = {"case": name, "distance_miles": data["distance_miles"],
        "driving_hours": data["driving_hours"], "total_trip_hours": data["total_trip_hours"],
        "calendar_logs": len(data["logs"]), "remaining_cycle_hours": data["remaining_cycle_hours"],
        "stops": [{"type": s["type"], "location": s["location"], "duration_hours": s["duration_hours"]} for s in data["stops"]],
        "all_calendar_days_24_hours": all(sum(log["totals"].values()) == 24 for log in data["logs"]),
        "compliance": data["compliance"]}
    results.append(result)
    print(json.dumps(result, indent=2), flush=True)
target = Path(__file__).resolve().parent / "audit_results.json"
target.write_text(json.dumps({"checked_at_utc": datetime.now(timezone.utc).isoformat(), "cases": results}, indent=2) + "\n", encoding="utf-8")
