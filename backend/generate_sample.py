"""Regenerate the offline demo through the same backend scheduler, not UI HOS math."""
import json
from datetime import datetime, timezone
from pathlib import Path
from trips.planner import plan_trip
from trips.routing import RoadLeg

REQUEST = {"current_location": "Dallas, TX", "pickup_location": "Houston, TX",
           "dropoff_location": "Miami, FL", "current_cycle_used": 20}

route = [[32.7767, -96.797], [31.55, -96.2], [30.6, -95.75], [29.7604, -95.3698],
         [30.05, -94.1], [30.2241, -92.0198], [30.4515, -91.1871], [30.42, -89.9],
         [30.6954, -88.0399], [30.47, -87.2], [30.4383, -84.2807], [29.95, -82.6],
         [29.1872, -82.1401], [28.0, -81.3], [26.7153, -80.0534], [25.7617, -80.1918]]
trip = plan_trip(REQUEST, [route[0], route[3], route[-1]],
    [RoadLeg(route[:4], 240, 240 / 55), RoadLeg(route[3:], 1300, 1300 / 55)],
    datetime(2026, 10, 5, 6, tzinfo=timezone.utc))
for event in trip["events"]:
    event.pop("_coordinates", None)
target = Path(__file__).resolve().parent.parent / "src/data/sampleTrip.json"
target.write_text(json.dumps(trip, indent=2) + "\n", encoding="utf-8")
print(f"Generated {target.name}: {len(trip['logs'])} days, {trip['driving_hours']} driving hours")
