import json
from datetime import datetime, timezone
from unittest.mock import patch
from django.test import SimpleTestCase, override_settings
from .errors import TripError
from .planner import plan_trip
from .routing import RoadLeg
from .routing import geocode, road_leg
from django.core.cache import cache
from rest_framework.test import APIClient
from rest_framework.views import APIView
from django.urls import resolve

REQUEST = {"current_location": "Dallas, TX", "pickup_location": "Houston, TX",
           "dropoff_location": "Miami, FL", "current_cycle_used": 20}
POINTS = [[32.77, -96.79], [29.76, -95.36], [25.76, -80.19]]
START = datetime(2026, 10, 5, 6, tzinfo=timezone.utc)


def plan(hours, cycle=20):
    legs = [RoadLeg(POINTS[:2], hours[0] * 55, hours[0]),
            RoadLeg(POINTS[1:], hours[1] * 55, hours[1])]
    return plan_trip({**REQUEST, "current_cycle_used": cycle}, POINTS, legs, START)


class SchedulingTests(SimpleTestCase):
    def assert_valid_logs(self, trip):
        driving = 0
        for log in trip["logs"]:
            self.assertAlmostEqual(sum(log["totals"].values()), 24)
            self.assertEqual(log["segments"][0]["start_hour"], 0)
            self.assertEqual(log["segments"][-1]["end_hour"], 24)
            for a, b in zip(log["segments"], log["segments"][1:]):
                self.assertAlmostEqual(a["end_hour"], b["start_hour"])
            driving += log["totals"]["driving"]
        self.assertAlmostEqual(driving, trip["driving_hours"], places=4)
        self.assertAlmostEqual(sum(log["total_miles"] for log in trip["logs"]), trip["distance_miles"], delta=0.05)
        self.assertTrue(trip["compliance"]["compliant"])

    def test_short_trip_accounts_for_both_legs_and_services(self):
        trip = plan([1, 2])
        self.assertEqual(trip["total_trip_hours"], 5)
        self.assertEqual(trip["remaining_cycle_hours"], 45)
        self.assertEqual([s["type"] for s in trip["stops"]], ["start", "pickup", "dropoff"])
        self.assert_valid_logs(trip)

    def test_timeline_event_kinds_match_frontend_contract(self):
        allowed = {"driving", "on_duty", "off_duty", "sleeper_berth", "fuel", "break", "pickup", "dropoff"}
        trip = plan([4, 30], cycle=70)
        self.assertEqual(trip["events"][0]["kind"], "on_duty")
        for event in trip["events"]:
            self.assertIn(event["kind"], allowed)

    def test_long_trip_breaks_rests_and_fuel(self):
        trip = plan([4, 30])
        kinds = [s["type"] for s in trip["stops"]]
        for kind in ("break", "rest", "fuel"):
            self.assertIn(kind, kinds)
        self.assert_valid_logs(trip)

    def test_pickup_satisfies_thirty_minute_interruption(self):
        trip = plan([8, 3])
        self.assertNotIn("break", [s["type"] for s in trip["stops"]])
        self.assert_valid_logs(trip)

    def test_full_cycle_restarts_before_driving(self):
        trip = plan([1, 1], cycle=70)
        self.assertEqual(trip["stops"][1]["duration_hours"], 34)
        self.assertEqual(trip["remaining_cycle_hours"], 66)
        self.assert_valid_logs(trip)

    def test_multiple_restarts_and_midnight_splitting(self):
        self.assert_valid_logs(plan([20, 140], cycle=69.75))

    def test_final_non_driving_work_does_not_require_a_restart(self):
        trip = plan([0, 0], cycle=69.5)
        self.assertEqual(trip["total_trip_hours"], 2)
        self.assertFalse(any(stop["type"] == "rest" for stop in trip["stops"]))
        self.assertEqual(trip["remaining_cycle_hours"], 0)
        self.assert_valid_logs(trip)


class ApiTests(SimpleTestCase):
    client_class = APIClient

    def test_endpoints_use_drf_without_authentication(self):
        for path in ("/api/health/", "/api/trip/", "/api/geocode/", "/api/reverse-geocode/"):
            view = resolve(path).func
            self.assertTrue(issubclass(view.cls, APIView))
            self.assertEqual(view.cls.authentication_classes, [])
        response = self.client.get("/api/health/")
        self.assertEqual(response["Content-Type"], "application/json")

    def test_drf_parser_and_serializer_errors(self):
        response = self.client.post("/api/trip/", "text", content_type="text/plain")
        self.assertEqual(response.status_code, 415)
        response = self.client.post("/api/trip/", "{}", content_type="application/json; charset=utf-8")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["field"], "current_location")
        self.assertIn("detail", response.json())

    def post(self, data):
        return self.client.post("/api/trip/", json.dumps(data), content_type="application/json")

    def test_health_and_method(self):
        self.assertEqual(self.client.get("/api/health/").json(), {"status": "ok"})
        self.assertEqual(self.client.get("/api/trip/").status_code, 405)

    def test_invalid_inputs(self):
        for value in (None, True, "20", -1, 71, float("nan")):
            response = self.post({**REQUEST, "current_cycle_used": value})
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json()["field"], "current_cycle_used")
        self.assertEqual(self.post([]).status_code, 400)
        self.assertEqual(self.post({**REQUEST, "pickup_location": " "}).status_code, 400)

    def test_malformed_json(self):
        self.assertEqual(self.client.post("/api/trip/", "{", content_type="application/json").status_code, 400)

    @patch("trips.views.road_leg")
    @patch("trips.views.geocode", side_effect=POINTS)
    def test_response_matches_frontend_contract(self, geocode, road_leg):
        road_leg.side_effect = [RoadLeg(POINTS[:2], 55, 1), RoadLeg(POINTS[1:], 110, 2)]
        response = self.post(REQUEST)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.json()), {"distance_miles", "driving_hours", "total_trip_hours",
            "remaining_cycle_hours", "driving_days", "route", "stops", "events", "logs", "compliance"})

    @patch("trips.views.geocode", side_effect=TripError("Provider unavailable", status=502))
    def test_provider_failure(self, geocode):
        self.assertEqual(self.post(REQUEST).status_code, 502)

    def test_cors_preflight(self):
        response = self.client.options("/api/trip/", HTTP_ORIGIN="http://localhost:8080",
            HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST", HTTP_ACCESS_CONTROL_REQUEST_HEADERS="content-type")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Access-Control-Allow-Origin"], "http://localhost:8080")

@override_settings(CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
class RoutingTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    @patch("trips.routing.provider_json", return_value=[{"lat": "32.77", "lon": "-96.79"}])
    def test_geocoding_cache(self, provider):
        self.assertEqual(geocode("Dallas, TX", "current_location"), POINTS[0])
        self.assertEqual(geocode("Dallas, TX", "current_location"), POINTS[0])
        provider.assert_called_once()

    @patch("trips.routing.provider_json", return_value=[])
    def test_unknown_location(self, provider):
        with self.assertRaises(TripError) as caught:
            geocode("unknown", "pickup_location")
        self.assertEqual(caught.exception.field, "pickup_location")

    @patch("trips.routing.provider_json", return_value={"code": "Ok", "routes": [{
        "distance": 1609.344 * 110, "duration": 3600,
        "geometry": {"coordinates": [[-96.79, 32.77], [-95.36, 29.76]]}}]})
    def test_route_coordinates_units_and_speed(self, provider):
        leg = road_leg(POINTS[0], POINTS[1])
        self.assertEqual(leg.points, POINTS[:2])
        self.assertAlmostEqual(leg.miles, 110)
        self.assertAlmostEqual(leg.hours, 2)
        self.assertEqual(leg.position(1), POINTS[1])

    @patch("trips.routing.provider_json", return_value={"code": "NoRoute"})
    def test_missing_route(self, provider):
        with self.assertRaises(TripError) as caught:
            road_leg(POINTS[0], POINTS[1])
        self.assertEqual(caught.exception.status, 422)

