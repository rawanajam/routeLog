# RouteLog Django API

Python 3.10+, Django 5.2, and Django REST Framework. Requests are stateless; no login or database
migration is required. The API matches `src/types/trip.ts`.
`DATABASES` is empty; no SQLite file or Supabase connection is used. Provider
caches and the frontend's latest-trip cache are in memory only.
All four endpoints use DRF `@api_view` and `Response`. Trip input validation
uses `TripRequestSerializer` in `trips/serializers.py`; DRF handles JSON parsing,
rendering, and method errors. Validation preserves the frontend's `detail` and
`field` error format. Authentication is disabled and no user model is required.

## Run locally (PowerShell)

From the repository root:

```powershell
python -m venv backend/.venv
./backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
Copy-Item backend/.env.example backend/.env
Copy-Item .env.example .env.local
./backend/.venv/Scripts/python.exe backend/manage.py runserver 127.0.0.1:8000
```

In a second terminal run `npm.cmd run dev`. Restart Vite after changing
`VITE_API_URL`. Without that variable the frontend continues using its mock.

```powershell
./backend/.venv/Scripts/python.exe backend/manage.py check
./backend/.venv/Scripts/python.exe backend/manage.py test trips
```

## Endpoints

- `GET /api/health/`: service status.
- `GET /api/geocode/?q=Chicago`: autocomplete `{results: [{name, lat, lng}]}`.
- `GET /api/reverse-geocode/?lat=41.8781&lng=-87.6298`: readable name with
  the original device coordinates (not the nearby map object's coordinates).
- `POST /api/trip/`: JSON with `current_location`, `pickup_location`,
  `dropoff_location`, and numeric `current_cycle_used` (0–70).
- Each location is `{name: "Chicago, IL, USA", lat: 41.8781, lng: -87.6298}`.
  Selected coordinates go directly to OSRM without another forward lookup.
  Manually entered names use `{name: "Chicago", lat: null, lng: null}` and
  are resolved on submission. Legacy string locations remain supported.
- Invalid requests return `{ "detail": "...", "field": "..." }` with HTTP 400.
  Mapping provider failures return HTTP 502; unroutable locations return 422.

## Planning assumptions

- US property-carrying driver on the 70-hour / 8-day cycle.
- Fresh shift with prior 10-hour rest already completed; first departure is
  tomorrow at 06:00 UTC. Logs use UTC consistently and include full 24h days.
- 11 driving hours per shift, 14-hour window, qualifying 30-minute interruption
  after 8 cumulative driving hours, and 10-hour rest between shifts.
- Pickup/dropoff each take one on-duty hour; fuel takes 30 on-duty minutes.
  Those activities also satisfy a qualifying interruption in driving.
- Fuel is scheduled at most every 1,000 miles; initial tank is assumed full.
- A 34-hour restart resets an exhausted cycle. Prior daily history is not
  available, so rolling recapture and split-sleeper exceptions are not inferred.
- The 14-hour and 70-hour limits restrict further **driving**, not loading or
  unloading. Non-driving work may finish after a limit, with rest/restart
  scheduled before the next driving segment. Remaining cycle time clamps to zero.
- One-hour pickup, one-hour delivery, and 30-minute fueling are on-duty work.
  Consecutive non-driving activity (including combinations of duty statuses)
  satisfies the 30-minute driving interruption; it does not reset the 14h window.
- Compliance is checked by independently replaying the produced activity stream.
  Daily graphs cover every UTC calendar day from 00:00 to 24:00, including
  full rest-only days. Pre-trip and post-trip padding are assumed off duty.
- Duration is the greater of provider travel time and distance / 55 mph.
- Compliance results describe this planned schedule under these assumptions.
  Driver logs are generated plans, not actual recorded ELD duty history.

## Maps and deployment

Photon provides real autocomplete suggestions; Nominatim resolves submitted
manual US addresses and reverse lookups; OSRM supplies road geometry. Data attribution:
[© OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
Fuel, break, and rest coordinates are approximate points along the route,
not verified truck stops. OSRM's default driving profile does not check
truck height, weight, hazardous cargo, or commercial road restrictions.
Intermediate stops and their timeline entries are labeled with a nearby town
or county from reverse geocoding where available, prefixed with "Near".
Coordinates remain unchanged for map placement. If naming fails, the trip
still returns with "Along the planned route" rather than raw coordinates.
Reverse queries share the forward-geocoding rate limit and cache. Set
`REVERSE_GEOCODING_URL` for a compatible alternative service.

Public providers are for light local development. Geocoding requests are
cached in memory and serialized at less than one per second within this process.
The cache resets when the server restarts and needs no writable cache folder.
For multiple workers or production traffic, configure `GEOCODING_URL` and
`AUTOCOMPLETE_URL`, `REVERSE_GEOCODING_URL`, and `ROUTING_URL` to suitable
hosted/self-hosted services; adapters expect Nominatim, Photon, and OSRM formats.
Public Nominatim prohibits autocomplete, including through a proxy;
autocomplete never uses its search endpoint. Photon's public demo permits
reasonable light use but may throttle and offers no availability guarantee.
See [Photon's provider policy](https://github.com/komoot/photon#demo-server).
Supply an identifying contact in
`GEOCODING_USER_AGENT`. See the
[Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/).

For deployment set `DJANGO_DEBUG=false`, a unique `DJANGO_SECRET_KEY`,
`DJANGO_ALLOWED_HOSTS`, and exact `CORS_ALLOWED_ORIGINS`. Serve
`config.wsgi:application` or `config.asgi:application` with a production server.
Add API rate limits at the proxy/provider before exposing the public endpoint.
No session authentication is used; the calculation endpoint accepts JSON only.

The existing form uses one reusable combobox with a 500ms debounce, request
cancellation, loading/empty/error states, mouse selection, arrow/Enter selection,
and Escape/blur dismissal. Editing a selection clears its coordinates.
The current-location button requests browser permission only when clicked;
permission denial, unavailable positioning, timeout, and reverse lookup failure
leave existing input intact and display an error. Geolocation requires HTTPS
or localhost. Location features need a running backend even in offline demo mode.

Run `python backend/smoke_locations.py` using the virtual environment while
the backend is running to exercise live search, reverse lookup, and routing.

Rule reference: [FMCSA HOS summary](https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations).

## Assessment audit

See [HOS_REVIEW.md](HOS_REVIEW.md) for the requirement checklist and boundaries.
Run `python backend/audit_live.py` with the backend virtual environment to check
three real routes and save `backend/audit_results.json`. External providers
must be reachable. This is separate from deterministic unit tests.

The offline frontend demo is a scheduler-generated snapshot with approximate
route geometry. Regenerate it with `python backend/generate_sample.py`.
It does not adapt to entered locations or cycle hours; connect the backend
for calculated results. No HOS rules are calculated in React.
