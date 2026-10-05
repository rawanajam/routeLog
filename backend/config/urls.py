from django.urls import path
from trips.views import health, trip
from trips.locations import geocode_view, reverse_geocode_view

urlpatterns = [path("api/health/", health), path("api/trip/", trip),
               path("api/geocode/", geocode_view), path("api/reverse-geocode/", reverse_geocode_view)]
