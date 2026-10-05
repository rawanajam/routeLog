from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TripRequestSerializer
from django.core.exceptions import RequestDataTooBig
from .errors import TripError
from .planner import plan_trip
from .routing import geocode, road_leg, enrich_locations


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


# Stateless public calculation endpoint: no cookie auth, session, or saved state.
@api_view(["POST"])
def trip(request):
    try:
        serializer = TripRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        fields = ("current_location", "pickup_location", "dropoff_location")
        points = [data["_location_points"][field] if field in data["_location_points"]
                  else geocode(data[field], field) for field in fields]
        legs = [road_leg(points[0], points[1]), road_leg(points[1], points[2])]
        return Response(enrich_locations(plan_trip(data, points, legs)))
    except RequestDataTooBig:
        return Response({"detail": "Request body is too large."}, status=413)
    except TripError as exc:
        body = {"detail": str(exc)}
        if exc.field:
            body["field"] = exc.field
        return Response(body, status=exc.status)
