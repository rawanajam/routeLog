# Assessment and HOS implementation review

Scope: the checklist supplied in the conversation. No separate assessment
document was supplied. Rules reviewed against the current
[FMCSA property-carrying summary](https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations).

| Requirement | Implementation and verification |
|---|---|
| 11 driving hours | Driving splits at 11h per shift; only a qualifying 10h rest resets the shift. |
| 14-hour window | Elapsed time includes pickup, fuel, and short off-duty breaks; no driving after 14h. Non-driving work may continue. |
| 30-minute break | Required before further driving after 8 cumulative driving hours. Adjacent non-driving periods combine. |
| Pickup as interruption | 1h pickup stays on duty, counts toward cycle/window, and satisfies the 30min interruption. No duplicate break. |
| Fuel as interruption | 30min on-duty refueling also qualifies without being labeled off duty. |
| 10-hour rest | Resets driving/shift counters, never the 70h cycle. Initial rest is explicitly assumed. |
| 70-hour cycle | Counts driving plus on-duty work; driving stops at the limit. Final unloading may exceed 70h without requiring a needless restart. |
| 34-hour restart | Resets cycle plus shift after consecutive off-duty time. Restart days remain in daily logs. |
| Fuel every 1,000 mi | Distance continues across legs and rests. Fuel resets mileage, not HOS cycle. Initial tank assumed full. |
| Pickup/dropoff | Exactly 1h on-duty pickup and 1h on-duty delivery per trip. |
| Multiple logs | Split activities at UTC midnight; include rest-only days; no extra day when activity ends exactly at midnight. |
| Exactly 24h/day | Continuous 0–24 segments, padding off duty, totals normalized for floating-point drift. |
| Place names | Optional cached/rate-limited reverse lookup labels nearby places without moving stops; generic fallback avoids raw coordinates. |

Fuel frequency and 1h loading/unloading are assessment assumptions, not
universal FMCSA HOS requirements. Routing speed is estimated; traffic, truck
restrictions, actual truck-stop suitability, and actual driver activity are
not verified.

## Corrections

- Removed unnecessary rests/restarts before non-driving work, especially final delivery.
- Combined adjacent non-driving segments for break qualification.
- Replaced compliance assertions based solely on scheduler counters with
  an independent replay of the returned event stream.
- Removed raw coordinate labels in intermediate stops/timeline entries.
- Kept date labels, midnight splits, and displayed times consistently UTC;
  show both dates for overnight stop departures.
- Fixed minute-rounding overflow (e.g. `1h 60m`) and log tab selection when
  recalculation produces fewer days.
- Replaced inconsistent handwritten mock schedules with a backend-generated
  static demo. Frontend does not calculate HOS rules.
- Repaired routing smoke tests to await route loading and render the full
  HTML document in the correct container.

## Test coverage

`manage.py test trips` includes independent timeline replay, 100 seeded
fractional scenarios, realistic durations with used cycles from 0 to 70h,
11h and 14h boundaries, qualifying pickup/fuel, combined interruptions,
10h vs 34h resets, delivery at the cycle limit, multiple fuel stops,
midnight/restart-only days, and reverse-geocoding failure/cache behavior.
`npm test` verifies route rendering, unknown event icons, UTC display,
overnight dates, minute formatting, and shorter replacement logs.

Verification completed: 33 backend tests (including 100 seeded scenarios),
7 frontend tests, and the production build. Three live API cases passed:
Dallas–Houston–Miami (1,425.34 mi, 3 daily logs), Chicago–Indianapolis–Nashville
with 69h already used (468.26 mi, 34h restart, 3 daily logs), and
Los Angeles–Phoenix–Las Vegas (658.80 mi, 10h rest, 2 daily logs).
All daily totals were exactly 24h and intermediate stops resolved to place names.
Detailed provider-backed results are in [audit_results.json](audit_results.json).

## Remaining limits

The input has only total used cycle hours. A full rolling 8-day recapture
calculation needs dated prior-duty history, which is absent. The engine
conservatively retains reported used hours until a 34h restart; it may
schedule an avoidable restart instead of reclaiming expiring hours.
Split-sleeper, short-haul, adverse-conditions, passenger-carrier and other
exceptions are not modeled. Logs use UTC rather than a supplied home-terminal
time zone. Logs are proposed schedules, not certified ELD records.

Optional place names identify nearby map objects, not safe parking or verified
truck facilities. See [Nominatim reverse lookup behavior](https://nominatim.org/release-docs/latest/api/Reverse/).
