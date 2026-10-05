"""DRF request validation and the existing frontend error contract."""
from rest_framework import serializers
from rest_framework.views import exception_handler
from .errors import TripError
from .locations import coordinates


class LocationField(serializers.Field):
    def to_internal_value(self, value):
        point = None
        if isinstance(value, dict):
            lat, lng = value.get("lat"), value.get("lng")
            if lat is not None or lng is not None:
                try:
                    point = coordinates(lat, lng)
                except TripError as exc:
                    raise serializers.ValidationError(str(exc)) from exc
            value = value.get("name")
        if not isinstance(value, str) or not value.strip() or len(value) > 300:
            raise serializers.ValidationError("Enter a location of at most 300 characters.")
        return {"name": value.strip(), "point": point}


class CycleHoursField(serializers.Field):
    def to_internal_value(self, value):
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not 0 <= value <= 70:
            raise serializers.ValidationError("Current cycle hours must be between 0 and 70.")
        return float(value)


class TripRequestSerializer(serializers.Serializer):
    current_location = LocationField()
    pickup_location = LocationField()
    dropoff_location = LocationField()
    current_cycle_used = CycleHoursField()

    def validate(self, attrs):
        cleaned = {"current_cycle_used": attrs["current_cycle_used"], "_location_points": {}}
        for field in ("current_location", "pickup_location", "dropoff_location"):
            location = attrs[field]
            cleaned[field] = location["name"]
            if location["point"] is not None:
                cleaned["_location_points"][field] = location["point"]
        return cleaned


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and isinstance(exc, serializers.ValidationError):
        errors = response.data
        field = next(iter(errors)) if isinstance(errors, dict) else None
        message = errors[field] if field else errors
        while isinstance(message, (list, dict)):
            message = next(iter(message.values())) if isinstance(message, dict) else message[0]
        response.data = {"detail": str(message)}
        if field and field != "non_field_errors":
            response.data["field"] = field
    return response
