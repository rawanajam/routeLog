import hashlib
import math
import threading
import time
from dataclasses import dataclass

import requests
from django.conf import settings
from django.core.cache import cache
from .errors import TripError

_lock = threading.Lock()
_last_request = 0.0


def provider_json(url, params=None):
    try:
        response = requests.get(url, params=params, timeout=20,
                                headers={"User-Agent": settings.GEOCODING_USER_AGENT})
        response.raise_for_status()
        return response.json()
    except (requests.RequestException, ValueError) as exc:
        raise TripError("Map service unavailable. Please try again shortly.", status=502) from exc


def geocoding_json(key, url, params, timeout=86400):
    global _last_request
    with _lock:
        result = cache.get(key)
        if result is not None:
            return result
        time.sleep(max(0, 1.1 - (time.monotonic() - _last_request)))
        try:
            result = provider_json(url, params)
        finally:
            _last_request = time.monotonic()
        cache.set(key, result, timeout)
        return result


def geocode(location, field):
    key = "geo:" + hashlib.sha256((settings.GEOCODING_URL + location.lower()).encode()).hexdigest()
    result = geocoding_json(key, settings.GEOCODING_URL,
        {"q": location, "format": "jsonv2", "limit": 1, "countrycodes": "us"})
    if not result:
        raise TripError("Location not found. Enter a US city or full address.", field)
    return [float(result[0]["lat"]), float(result[0]["lon"])]


def nearby_place(point):
    rounded = tuple(round(value, 4) for value in point)
    key = "reverse:" + hashlib.sha256((settings.REVERSE_GEOCODING_URL + str(rounded)).encode()).hexdigest()
    try:
        result = geocoding_json(key, settings.REVERSE_GEOCODING_URL,
            {"lat": rounded[0], "lon": rounded[1], "format": "jsonv2", "zoom": 12,
             "addressdetails": 1, "accept-language": "en"})
    except TripError:
        # Place naming is optional; a provider outage must not lose a valid trip.
        cache.set(key, {}, 60)
        return None
    address = result.get("address", {}) if isinstance(result, dict) else {}
    place = next((address.get(field) for field in ("city", "town", "village", "hamlet", "municipality", "county") if address.get(field)), None)
    state = address.get("state")
    return ", ".join(part for part in (place, state) if part) or None


def enrich_locations(trip):
    # Stops first; deduplicate locations and cap optional provider work per trip.
    names = {}
    for stop in trip["stops"]:
        key = tuple(round(value, 4) for value in stop["coordinates"])
        if stop["type"] in ("start", "pickup", "dropoff"):
            names[key] = stop["location"]
    for stop in trip["stops"]:
        if stop["type"] not in ("fuel", "break", "rest"):
            continue
        key = tuple(round(value, 4) for value in stop["coordinates"])
        if key not in names and len(names) < 15:
            place = nearby_place(stop["coordinates"])
            names[key] = f"Near {place}" if place else "Along the planned route"
        stop["location"] = names.get(key, "Along the planned route")
    for event in trip["events"]:
        point = event.pop("_coordinates", None)
        if point is not None:
            key = tuple(round(value, 4) for value in point)
            event["location"] = names.get(key, event["location"])
    return trip


@dataclass
class RoadLeg:
    points: list
    miles: float
    hours: float

    def position(self, fraction):
        # Interpolate by distance along road geometry, never between cities.
        distances = [0.0]
        for a, b in zip(self.points, self.points[1:]):
            lat = math.radians((a[0] + b[0]) / 2)
            distances.append(distances[-1] + math.hypot(b[0] - a[0], (b[1] - a[1]) * math.cos(lat)))
        target = max(0, min(1, fraction)) * distances[-1]
        for i in range(1, len(distances)):
            if distances[i] >= target:
                span = distances[i] - distances[i - 1]
                ratio = (target - distances[i - 1]) / span if span else 0
                return [self.points[i - 1][j] + ratio * (self.points[i][j] - self.points[i - 1][j]) for j in (0, 1)]
        return self.points[-1]


def road_leg(start, end):
    coordinates = f"{start[1]},{start[0]};{end[1]},{end[0]}"
    key = "road:" + hashlib.sha256((settings.ROUTING_URL + coordinates).encode()).hexdigest()
    data = cache.get(key)
    if data is None:
        data = provider_json(f"{settings.ROUTING_URL.rstrip('/')}/route/v1/driving/{coordinates}",
            {"overview": "full", "geometries": "geojson"})
        if data.get("code") != "Ok" or not data.get("routes"):
            raise TripError("No road route found between these locations.", status=422)
        cache.set(key, data, 86400)
    route = data["routes"][0]
    miles = route["distance"] / 1609.344
    return RoadLeg([[lat, lon] for lon, lat in route["geometry"]["coordinates"]],
                   miles, max(route["duration"] / 3600, miles / 55))
