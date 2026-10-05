"""Optional live provider check: python backend/smoke_test.py."""
import json
import os
import django
from django.test import Client

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
payload = {"current_location": "Dallas, TX", "pickup_location": "Houston, TX",
           "dropoff_location": "Miami, FL", "current_cycle_used": 20}
response = Client(HTTP_HOST="localhost").post(
    "/api/trip/", json.dumps(payload), content_type="application/json")
data = response.json()
print(json.dumps({"status": response.status_code, "distance_miles": data.get("distance_miles"),
    "driving_days": data.get("driving_days"), "compliance": data.get("compliance"),
    "detail": data.get("detail")}, indent=2))
raise SystemExit(0 if response.status_code == 200 else 1)
