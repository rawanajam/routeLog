"""Provider-backed smoke test; run against the local Django server."""
import json
import requests

BASE = "http://127.0.0.1:8000/api"


def get(path, params):
    response = requests.get(f"{BASE}/{path}/", params=params, timeout=120)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    suggestions = get("geocode", {"q": "New Yo"})["results"]
    assert suggestions, "No live autocomplete results"
    current = get("reverse-geocode", {"lat": 41.8781, "lng": -87.6298})
    assert current["lat"] == 41.8781 and current["lng"] == -87.6298
    pickup = get("geocode", {"q": "Indianapolis"})["results"][0]
    dropoff = next(location for location in get("geocode", {"q": "Atlanta"})["results"]
                   if location["name"].startswith("Atlanta, "))
    response = requests.post(f"{BASE}/trip/", json={"current_location": current,
        "pickup_location": pickup, "dropoff_location": dropoff, "current_cycle_used": 18}, timeout=180)
    response.raise_for_status()
    trip = response.json()
    for kind, location in (("start", current), ("pickup", pickup), ("dropoff", dropoff)):
        stop = next(stop for stop in trip["stops"] if stop["type"] == kind)
        assert stop["coordinates"] == [location["lat"], location["lng"]]
    assert trip["compliance"]["compliant"]
    print(json.dumps({"autocomplete": suggestions, "device_location": current,
        "pickup": pickup, "dropoff": dropoff, "routed_miles": trip["distance_miles"],
        "selected_coordinates_preserved": True}, indent=2), flush=True)
