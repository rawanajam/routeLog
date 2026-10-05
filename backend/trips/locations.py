"""Location search and device-coordinate naming, independent of HOS planning.

Public Nominatim disallows autocomplete. Photon supports search-as-you-type.
Both providers are cached and conservatively serialized via geocoding_json.
"""
import hashlib
import math
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .errors import TripError
from .routing import geocoding_json


def coordinates(lat, lng, field=None):
    if (isinstance(lat, bool) or isinstance(lng, bool)
            or not isinstance(lat, (int, float)) or not isinstance(lng, (int, float))
            or not math.isfinite(lat) or not math.isfinite(lng)
            or not -90 <= lat <= 90 or not -180 <= lng <= 180):
        raise TripError("Enter valid latitude and longitude.", field)
    return [float(lat), float(lng)]


def search_locations(query):
    key = "suggest:" + hashlib.sha256((settings.AUTOCOMPLETE_URL + query.casefold()).encode()).hexdigest()
    data = geocoding_json(key, settings.AUTOCOMPLETE_URL,
                          {"q": query, "limit": 6, "lang": "en"})
    if not isinstance(data, dict) or not isinstance(data.get("features"), list):
        raise TripError("Location search unavailable. Please try again.", status=502)
    results, seen = [], set()
    for feature in data["features"]:
        try:
            props = feature["properties"]
            lng, lat = feature["geometry"]["coordinates"][:2]
            point = coordinates(lat, lng)
            street = " ".join(str(props.get(k) or "") for k in ("housenumber", "street")).strip()
            locality = props.get("city") or props.get("county")
            parts = [props.get("name"), street]
            if locality not in parts:
                parts.append(locality)
            # Keep the state even if its name equals the city (e.g. New York).
            # This distinguishes a city suggestion from the state suggestion.
            parts.extend([props.get("state"), props.get("country")])
            name = ", ".join(str(part) for part in parts if part)
            identity = (name, *point)
            if name and identity not in seen:
                seen.add(identity)
                results.append({"name": name, "lat": point[0], "lng": point[1]})
        except (KeyError, TypeError, ValueError, TripError):
            continue
    return results


def reverse_location(lat, lng):
    key = "device-reverse:" + hashlib.sha256(
        (settings.REVERSE_GEOCODING_URL + str((round(lat, 5), round(lng, 5)))).encode()).hexdigest()
    data = geocoding_json(key, settings.REVERSE_GEOCODING_URL,
        {"lat": lat, "lon": lng, "format": "jsonv2", "zoom": 18,
         "addressdetails": 1, "accept-language": "en"})
    if not isinstance(data, dict) or not data.get("display_name"):
        raise TripError("Unable to find a readable name for your location. Enter a location manually.", status=422)
    # Preserve the device coordinates, not the nearby OSM object's coordinates.
    return {"name": data["display_name"], "lat": lat, "lng": lng}


@api_view(["GET"])
def geocode_view(request):
    query = request.query_params.get("q", "").strip()
    if not 3 <= len(query) <= 300:
        return Response({"detail": "Enter between 3 and 300 characters."}, status=400)
    try:
        return Response({"results": search_locations(query)})
    except TripError as exc:
        return Response({"detail": str(exc)}, status=exc.status)


@api_view(["GET"])
def reverse_geocode_view(request):
    try:
        try:
            lat, lng = float(request.query_params["lat"]), float(request.query_params["lng"])
        except (KeyError, ValueError):
            raise TripError("Enter valid latitude and longitude.")
        lat, lng = coordinates(lat, lng)
        return Response(reverse_location(lat, lng))
    except TripError as exc:
        return Response({"detail": str(exc)}, status=exc.status)
