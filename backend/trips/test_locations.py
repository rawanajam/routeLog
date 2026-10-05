import json
from unittest.mock import patch
from django.core.cache import cache
from django.test import SimpleTestCase
from .errors import TripError
from .routing import RoadLeg
from .tests import REQUEST, POINTS


class LocationApiTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    @patch("trips.routing.provider_json", return_value={"features": [{
        "properties": {"name": "Chicago", "city": "Chicago", "state": "Illinois", "country": "United States"},
        "geometry": {"coordinates": [-87.6298, 41.8781]}}]})
    def test_search_normalizes_coordinates_and_caches(self, provider):
        for query in ("Chicago", "chicago"):
            response = self.client.get("/api/geocode/", {"q": query})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["results"], [{"name": "Chicago, Illinois, United States", "lat": 41.8781, "lng": -87.6298}])
        provider.assert_called_once()
        self.assertIn("photon", provider.call_args.args[0])

    @patch("trips.routing.provider_json", return_value={"features": []})
    def test_empty_search_and_invalid_query(self, provider):
        self.assertEqual(self.client.get("/api/geocode/", {"q": "nonexistent"}).json(), {"results": []})
        for query in ("", "ab", "a" * 301):
            self.assertEqual(self.client.get("/api/geocode/", {"q": query}).status_code, 400)
        provider.assert_called_once()

    @patch("trips.routing.provider_json", return_value={"display_name": "Chicago, Illinois, United States", "lat": "42", "lon": "-88"})
    def test_reverse_keeps_device_coordinates_not_nearby_object(self, provider):
        response = self.client.get("/api/reverse-geocode/", {"lat": 41.8781, "lng": -87.6298})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"name": "Chicago, Illinois, United States", "lat": 41.8781, "lng": -87.6298})

    @patch("trips.routing.provider_json", side_effect=TripError("Map service unavailable", status=502))
    def test_provider_errors_are_json(self, provider):
        for url, params in (("/api/geocode/", {"q": "Chicago"}),
                            ("/api/reverse-geocode/", {"lat": 41, "lng": -87})):
            response = self.client.get(url, params)
            self.assertEqual(response.status_code, 502)
            self.assertIn("detail", response.json())

    @patch("trips.routing.provider_json", return_value={"error": "Unable to geocode"})
    def test_reverse_missing_name(self, provider):
        self.assertEqual(self.client.get("/api/reverse-geocode/", {"lat": 0, "lng": 0}).status_code, 422)

    def test_reverse_rejects_invalid_coordinates(self):
        for params in ({}, {"lat": "bad", "lng": 0}, {"lat": "nan", "lng": 0},
                       {"lat": 91, "lng": 0}, {"lat": 0, "lng": 181}):
            self.assertEqual(self.client.get("/api/reverse-geocode/", params).status_code, 400)

    def post(self, data):
        return self.client.post("/api/trip/", json.dumps(data), content_type="application/json")

    @patch("trips.views.enrich_locations", side_effect=lambda trip: trip)
    @patch("trips.views.road_leg")
    @patch("trips.views.geocode")
    def test_selected_points_go_directly_to_routing(self, geocode, road_leg, enrich):
        locations = {field: {"name": REQUEST[field], "lat": point[0], "lng": point[1]}
                     for field, point in zip(("current_location", "pickup_location", "dropoff_location"), POINTS)}
        road_leg.side_effect = [RoadLeg(POINTS[:2], 55, 1), RoadLeg(POINTS[1:], 55, 1)]
        response = self.post({**locations, "current_cycle_used": 18})
        self.assertEqual(response.status_code, 200)
        geocode.assert_not_called()
        self.assertEqual(road_leg.call_args_list[0].args, (POINTS[0], POINTS[1]))
        self.assertEqual(road_leg.call_args_list[1].args, (POINTS[1], POINTS[2]))
        self.assertEqual(response.json()["stops"][0]["location"], "Dallas, TX")

    @patch("trips.views.geocode", side_effect=TripError("Location not found", "pickup_location"))
    def test_manual_unknown_text_returns_field_error(self, geocode):
        response = self.post({**REQUEST,
            "current_location": {"name": "Dallas", "lat": 32.77, "lng": -96.79},
            "pickup_location": {"name": "made up unknown", "lat": None, "lng": None}})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["field"], "pickup_location")
        geocode.assert_called_once_with("made up unknown", "pickup_location")

    def test_structured_coordinates_and_names_are_validated(self):
        for value in ({"name": "Dallas", "lat": 0, "lng": None},
                      {"name": "Dallas", "lat": True, "lng": 0},
                      {"name": "Dallas", "lat": float("nan"), "lng": 0},
                      {"name": "Dallas", "lat": 0, "lng": 181},
                      {"name": " ", "lat": 0, "lng": 0}):
            response = self.post({**REQUEST, "current_location": value})
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json()["field"], "current_location")
