"""Boundary, calendar, and realistic-trip tests with an independent replay."""
import random
import json
from pathlib import Path
from datetime import datetime, timedelta, timezone
from unittest.mock import patch
from django.test import SimpleTestCase, override_settings
from django.core.cache import cache
from .planner import Planner, plan_trip
from .routing import RoadLeg, nearby_place, enrich_locations
from .compliance import check_schedule

REQUEST = {"current_location": "Dallas, TX", "pickup_location": "Houston, TX",
           "dropoff_location": "Miami, FL", "current_cycle_used": 20}
POINTS = [[32.77, -96.79], [29.76, -95.36], [25.76, -80.19]]
START = datetime(2026, 10, 5, 6, tzinfo=timezone.utc)


def trip_for(first, second, cycle=20, start=START):
    return plan_trip({**REQUEST, "current_cycle_used": cycle}, POINTS,
        [RoadLeg(POINTS[:2], first * 55, first), RoadLeg(POINTS[1:], second * 55, second)], start)


class HosAuditTests(SimpleTestCase):
    def verify(self, trip, initial_cycle):
        # Deliberately independent of check_schedule and scheduler counters.
        cycle = initial_cycle
        shift_start = None
        shift_drive = break_drive = interruption = consecutive_rest = miles_since_fuel = 0.0
        cursor = None
        for event in trip["events"]:
            hours = event.get("duration_hours", 0)
            if hours == 0:
                continue
            begin = datetime.fromisoformat(event["time"])
            finish = begin + timedelta(hours=hours)
            if cursor is not None:
                self.assertLess(abs((begin - cursor).total_seconds()), 0.01)
            cursor = finish
            if event["kind"] in ("off_duty", "sleeper_berth", "break"):
                consecutive_rest += hours
                interruption += hours
                if consecutive_rest >= 10 - 1e-7:
                    shift_start = None
                    shift_drive = 0
                if consecutive_rest >= 34 - 1e-7:
                    cycle = 0
            else:
                consecutive_rest = 0
                shift_start = shift_start or begin
                if event["kind"] == "driving":
                    shift_drive += hours
                    break_drive += hours
                    cycle += hours
                    miles_since_fuel += event["distance_miles"]
                    self.assertLessEqual(shift_drive, 11 + 1e-7)
                    self.assertLessEqual((finish - shift_start).total_seconds(), 14 * 3600 + 0.01)
                    self.assertLessEqual(break_drive, 8 + 1e-7)
                    self.assertLessEqual(cycle, 70 + 1e-7)
                    self.assertLessEqual(miles_since_fuel, 1000 + 1e-7)
                    interruption = 0
                else:
                    cycle += hours
                    interruption += hours
                    if event["kind"] == "fuel":
                        miles_since_fuel = 0
            if interruption >= 0.5 - 1e-7:
                break_drive = 0
        for log in trip["logs"]:
            self.assertEqual(sum(log["totals"].values()), 24)
            self.assertEqual(log["segments"][0]["start_hour"], 0)
            self.assertEqual(log["segments"][-1]["end_hour"], 24)
            for a, b in zip(log["segments"], log["segments"][1:]):
                self.assertEqual(a["end_hour"], b["start_hour"])
            for status, total in log["totals"].items():
                self.assertAlmostEqual(total, sum(s["end_hour"] - s["start_hour"] for s in log["segments"] if s["status"] == status), places=8)
        self.assertAlmostEqual(sum(e.get("duration_hours", 0) for e in trip["events"] if e["kind"] == "driving"), trip["driving_hours"], places=4)
        self.assertTrue(trip["compliance"]["compliant"])
        for kind in ("pickup", "dropoff"):
            stops = [s for s in trip["stops"] if s["type"] == kind]
            self.assertEqual(len(stops), 1)
            self.assertEqual(stops[0]["duration_hours"], 1)
            self.assertEqual(stops[0]["duty_status"], "on_duty")

    def test_realistic_routes_and_exhausted_cycles(self):
        cases = [(0, 0, 69.5), (1, 2, 20), (4.5, 22, 20), (8, 3, 20),
                 (11, 1, 20), (4, 45, 50), (5, 70, 69), (20, 140, 69.75),
                 (0, 1, 70), (0.5, 0.5, 69.5)]
        for first, second, cycle in cases:
            with self.subTest(first=first, second=second, cycle=cycle):
                self.verify(trip_for(first, second, cycle), cycle)

    def test_offline_demo_matches_same_hos_and_log_requirements(self):
        trip = json.loads((Path(__file__).resolve().parents[2] / "src/data/sampleTrip.json").read_text())
        self.verify(trip, 20)
        self.assertAlmostEqual(sum(log["totals"]["driving"] for log in trip["logs"]), trip["driving_hours"], places=4)

    def test_seeded_fractional_trip_cases(self):
        rng = random.Random(3953)
        for number in range(100):
            first, second, cycle = rng.uniform(0, 15), rng.uniform(0, 80), rng.uniform(0, 70)
            start = START + timedelta(hours=rng.uniform(0, 24))
            with self.subTest(case=number):
                self.verify(trip_for(first, second, cycle, start), cycle)

    def test_pickup_at_eight_hours_replaces_dedicated_break(self):
        trip = trip_for(8, 3)
        self.assertNotIn("break", [s["type"] for s in trip["stops"]])
        self.verify(trip, 20)

    def test_fuel_is_a_qualifying_interruption(self):
        planner = Planner(REQUEST, POINTS, START)
        planner.drive(RoadLeg(POINTS[:2], 440, 8))
        planner.service("fuel", 0.5, "Fuel")
        planner.drive(RoadLeg(POINTS[1:], 55, 1))
        self.assertFalse(any(e["kind"] == "break" for e in planner.events))

    def test_adjacent_non_driving_periods_combine_to_thirty_minutes(self):
        planner = Planner(REQUEST, POINTS, START)
        planner.drive(RoadLeg(POINTS[:2], 440, 8))
        planner.service("pickup", 0.25, "Inspection")
        planner.stop("break", 0.25, "off_duty", "Short interruption")
        planner.drive(RoadLeg(POINTS[1:], 55, 1))
        self.assertEqual(len([s for s in planner.stops if s["type"] == "break"]), 1)

    def test_fourteen_hour_window_includes_non_driving_and_breaks(self):
        planner = Planner(REQUEST, POINTS, START)
        planner.service("pickup", 4, "Warehouse wait")
        planner.drive(RoadLeg(POINTS[:2], 550, 10))
        rests = [s for s in planner.stops if s["type"] == "rest"]
        self.assertEqual(len(rests), 1)
        self.assertEqual(datetime.fromisoformat(rests[0]["arrival"]), START + timedelta(hours=14))
        self.assertTrue(check_schedule(planner.events, 20)["compliant"])

    def test_ten_hour_rest_does_not_reset_weekly_cycle(self):
        planner = Planner(REQUEST, POINTS, START)
        planner.drive(RoadLeg(POINTS[:2], 55, 1))
        planner.rest()
        self.assertEqual(planner.cycle, 21)
        planner.rest(restart=True)
        self.assertEqual(planner.cycle, 0)

    def test_delivery_at_cycle_limit_does_not_add_thirty_four_hours(self):
        trip = trip_for(0, 1, cycle=68)
        self.assertEqual(trip["total_trip_hours"], 3)
        self.assertFalse(any(s["type"] == "rest" for s in trip["stops"]))
        self.verify(trip, 68)

    def test_loading_exhausts_cycle_and_restart_precedes_next_drive(self):
        trip = trip_for(0, 1, cycle=69.5)
        self.assertEqual([e["kind"] for e in trip["events"]], ["on_duty", "pickup", "off_duty", "driving", "dropoff"])
        self.assertEqual(trip["stops"][2]["duration_hours"], 34)
        self.verify(trip, 69.5)

    def test_fuel_accumulates_across_legs_and_rests(self):
        trip = trip_for(4, 40)
        fuel = [s for s in trip["stops"] if s["type"] == "fuel"]
        self.assertEqual(len(fuel), 2)
        self.verify(trip, 20)

    def test_calendar_midnight_and_restart_only_days(self):
        trip = trip_for(1, 0, 70, START.replace(hour=23, minute=45))
        self.assertGreaterEqual(len(trip["logs"]), 3)
        self.assertEqual(trip["logs"][1]["totals"]["off_duty"], 24)
        self.verify(trip, 70)

    def test_independent_compliance_rejects_bad_rest_and_driving(self):
        events = [
            {"time": START.isoformat(), "duration_hours": 11, "kind": "driving", "distance_miles": 605},
            {"time": (START + timedelta(hours=11)).isoformat(), "duration_hours": 9, "kind": "off_duty"},
            {"time": (START + timedelta(hours=20)).isoformat(), "duration_hours": 1, "kind": "driving", "distance_miles": 55},
        ]
        result = check_schedule(events, 59)
        self.assertFalse(result["compliant"])
        self.assertFalse(result["items"][0]["passed"])
        self.assertFalse(result["items"][3]["passed"])


@override_settings(CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}})
class PlaceNameTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    @patch("trips.routing.provider_json", return_value={"address": {"town": "Madison", "state": "Florida"}})
    def test_nearby_town_is_cached(self, provider):
        self.assertEqual(nearby_place(POINTS[0]), "Madison, Florida")
        self.assertEqual(nearby_place(POINTS[0]), "Madison, Florida")
        provider.assert_called_once()

    @patch("trips.routing.nearby_place", return_value="Baton Rouge, Louisiana")
    def test_stop_and_timeline_names_are_enriched_without_moving_stops(self, provider):
        trip = trip_for(4, 20)
        positions = [s["coordinates"][:] for s in trip["stops"]]
        enrich_locations(trip)
        self.assertEqual(positions, [s["coordinates"] for s in trip["stops"]])
        self.assertTrue(any(s["location"] == "Near Baton Rouge, Louisiana" for s in trip["stops"]))
        self.assertTrue(any(e["location"] == "Near Baton Rouge, Louisiana" for e in trip["events"]))
        self.assertFalse(any("_coordinates" in e for e in trip["events"]))

    @patch("trips.routing.nearby_place", return_value=None)
    def test_place_lookup_failure_keeps_valid_trip_and_hides_raw_coordinates(self, provider):
        trip = enrich_locations(trip_for(4, 20))
        self.assertTrue(trip["compliance"]["compliant"])
        for item in trip["stops"] + trip["events"]:
            self.assertNotRegex(item["location"], r"\(-?\d+\.\d+,\s*-?\d+\.\d+\)")
