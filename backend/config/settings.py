import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
DEBUG = os.getenv("DJANGO_DEBUG", "true").lower() == "true"
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "development-only-routelog-key")
if not DEBUG and SECRET_KEY == "development-only-routelog-key":
    raise RuntimeError("Set DJANGO_SECRET_KEY for production.")
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,testserver").split(",")
INSTALLED_APPS = ["corsheaders", "rest_framework", "trips"]
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "UNAUTHENTICATED_USER": None,
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "EXCEPTION_HANDLER": "trips.serializers.api_exception_handler",
    # Permit parsing non-finite input so field validation can identify the error.
    "STRICT_JSON": False,
}
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
]
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", "http://localhost:8080,http://127.0.0.1:8080"
).split(",")
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"
# Calculation-only API: no models, sessions, users, or persistent database.
DATABASES = {}
TIME_ZONE = "UTC"
USE_TZ = True
# Local development must not depend on writable cache-directory permissions.
# Configure a shared cache before running multiple production workers.
CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache", "LOCATION": "routelog-providers"}}
GEOCODING_URL = os.getenv("GEOCODING_URL", "https://nominatim.openstreetmap.org/search")
AUTOCOMPLETE_URL = os.getenv("AUTOCOMPLETE_URL", "https://photon.komoot.io/api/")
REVERSE_GEOCODING_URL = os.getenv("REVERSE_GEOCODING_URL", "https://nominatim.openstreetmap.org/reverse")
ROUTING_URL = os.getenv("ROUTING_URL", "https://router.project-osrm.org")
GEOCODING_USER_AGENT = os.getenv("GEOCODING_USER_AGENT", "RouteLog-local-development/1.0")
DATA_UPLOAD_MAX_MEMORY_SIZE = 16384
