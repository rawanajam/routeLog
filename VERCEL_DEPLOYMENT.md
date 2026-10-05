# One-project deployment

This repository uses Vercel Services: Nitro serves the frontend, and Django
serves `/api/*` on the same domain. Services must be available for the account.

In the Vercel project settings:

1. Select the Services framework and keep Root Directory at the repository root.
2. Clear dashboard Build Command and Output Directory overrides.
3. Add production environment variables:
   - `DJANGO_DEBUG=false`
   - `DJANGO_SECRET_KEY`: a private random secret
   - `DJANGO_ALLOWED_HOSTS=.vercel.app` (append custom domains with commas)
   - `GEOCODING_USER_AGENT=RouteLog/1.0 (contact: YOUR_EMAIL)`
4. Deploy the updated repository.

Generate a secret locally, without committing it:

```powershell
.\backend\.venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(50))"
```

The frontend service build command sets `VITE_API_URL=/`. This selects the real
backend and keeps requests on the same origin, overriding local development URLs.
Local development configuration remains unchanged.

Verify `/api/health/` and `/api/geocode/?q=Chicago` return JSON, then select
locations and calculate a trip in the frontend. Check Django runtime logs for
500/502 responses. External routing and geocoding providers must be reachable.

Reference: https://vercel.com/kb/guide/vercel-services
