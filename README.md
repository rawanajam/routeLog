# RouteLog

A frontend for truck trip planning, route maps, planned stops, and daily driver logs.
Built with React, TypeScript, TanStack Start, Tailwind CSS, and Leaflet.

## Development

```sh
npm install
npm run dev
```

The development server runs at http://localhost:8080.

## Trip data

Sample trip data is used by default. Set `VITE_API_URL` in `.env.local` to
connect a Django backend, for example `VITE_API_URL=http://localhost:8000`.
Requests go to `POST /api/trip/`. The backend calculates schedules and Hours
of Service compliance; the frontend displays the results.

All three location inputs support real OpenStreetMap autocomplete through
the Django backend. Select a suggestion to retain its name and coordinates;
editing it clears the coordinates and preserves manual entry. Current Location
also has a browser location button (HTTPS or localhost required). Selected
coordinates are routed directly. See the backend README for provider settings.
In development, Vite proxies `/api` requests to `VITE_API_URL` (or port 8000
by default), allowing location lookup from the frontend origin without CORS.
Autocomplete begins at three characters; focusing an empty field shows a prompt.

Driver Logs shows the same latest successful calculation as the Trip Planner,
without calculating a separate sample. Results remain available when navigating
between pages during the browser session. A full reload clears this in-memory
result; calculate a trip again to populate the logs.

## Checks and production build

```sh
npm test
npm run build
node .output/server/index.mjs
```

The production build uses Nitro's Node server preset.

## Django backend

The Django REST Framework backend lives in `backend/` and provides `POST /api/trip/` and
`GET /api/health/`. See [backend setup and planning assumptions](backend/README.md)
for installation, running both servers, tests, and mapping provider configuration.
