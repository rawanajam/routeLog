import type { DailyLog, DutyStatus, LogSegment, TripRequest, TripResponse } from "@/types/trip";

/**
 * Temporary mock response. Shape mirrors the future Django `POST /api/trip/`
 * response. No HOS rules are computed here — values are static sample data.
 */

const totalsOf = (segments: LogSegment[]): Record<DutyStatus, number> => {
  const t: Record<DutyStatus, number> = { off_duty: 0, sleeper_berth: 0, driving: 0, on_duty: 0 };
  for (const s of segments) t[s.status] += s.end_hour - s.start_hour;
  return t;
};

const day1: LogSegment[] = [
  { status: "off_duty", start_hour: 0, end_hour: 6 },
  { status: "on_duty", start_hour: 6, end_hour: 7, note: "Pickup" },
  { status: "driving", start_hour: 7, end_hour: 15 },
  { status: "off_duty", start_hour: 15, end_hour: 15.5, note: "30-min break" },
  { status: "driving", start_hour: 15.5, end_hour: 18.5 },
  { status: "off_duty", start_hour: 18.5, end_hour: 24, note: "10-hr rest" },
];
const day2: LogSegment[] = [
  { status: "off_duty", start_hour: 0, end_hour: 4.5 },
  { status: "on_duty", start_hour: 4.5, end_hour: 5, note: "Pre-trip inspection" },
  { status: "driving", start_hour: 5, end_hour: 9 },
  { status: "on_duty", start_hour: 9, end_hour: 9.5, note: "Fuel" },
  { status: "driving", start_hour: 9.5, end_hour: 13.5 },
  { status: "off_duty", start_hour: 13.5, end_hour: 14, note: "30-min break" },
  { status: "driving", start_hour: 14, end_hour: 17 },
  { status: "sleeper_berth", start_hour: 17, end_hour: 24, note: "10-hr rest" },
];
const day3: LogSegment[] = [
  { status: "sleeper_berth", start_hour: 0, end_hour: 3 },
  { status: "on_duty", start_hour: 3, end_hour: 3.5, note: "Pre-trip inspection" },
  { status: "driving", start_hour: 3.5, end_hour: 5.75 },
  { status: "on_duty", start_hour: 5.75, end_hour: 6.75, note: "Dropoff" },
  { status: "off_duty", start_hour: 6.75, end_hour: 24 },
];

const log = (
  day: number,
  date: string,
  miles: number,
  from: string,
  to: string,
  remarks: string[],
  segments: LogSegment[],
): DailyLog => ({
  day,
  date,
  total_miles: miles,
  truck_number: "TRK-4821",
  trailer_number: "TRL-77130",
  carrier: "Lone Star Freight Co.",
  from,
  to,
  remarks,
  segments,
  totals: totalsOf(segments),
});

export function buildMockTrip(req: TripRequest): TripResponse {
  const start = req.current_location;
  const pickup = req.pickup_location;
  const dropoff = req.dropoff_location;

  return {
    distance_miles: 1540,
    driving_hours: 24.25,
    total_trip_hours: 47.75,
    remaining_cycle_hours: Math.max(0, 70 - req.current_cycle_used - 30),
    driving_days: 3,
    route: [
      [32.7767, -96.797], [31.55, -96.2], [30.6, -95.75], [29.7604, -95.3698],
      [30.05, -94.1], [30.2241, -92.0198], [30.4515, -91.1871], [30.42, -89.9],
      [30.6954, -88.0399], [30.47, -87.2], [30.4383, -84.2807], [29.95, -82.6],
      [29.1872, -82.1401], [28.0, -81.3], [26.7153, -80.0534], [25.7617, -80.1918],
    ],
    stops: [
      { id: "s1", type: "start", location: start, coordinates: [32.7767, -96.797], arrival: "2026-10-05T06:00:00", departure: "2026-10-05T06:00:00", duration_hours: 0, duty_status: "on_duty", description: "Shift begins, pre-trip inspection." },
      { id: "s2", type: "pickup", location: pickup, coordinates: [29.7604, -95.3698], arrival: "2026-10-05T06:00:00", departure: "2026-10-05T07:00:00", duration_hours: 1, duty_status: "on_duty", description: "Load freight and complete bill of lading." },
      { id: "s3", type: "break", location: "Lafayette, LA", coordinates: [30.2241, -92.0198], arrival: "2026-10-05T15:00:00", departure: "2026-10-05T15:30:00", duration_hours: 0.5, duty_status: "off_duty", description: "Required 30-minute break after 8 hours driving." },
      { id: "s4", type: "rest", location: "Baton Rouge, LA", coordinates: [30.4515, -91.1871], arrival: "2026-10-05T18:30:00", departure: "2026-10-06T04:30:00", duration_hours: 10, duty_status: "off_duty", description: "10-hour off-duty reset." },
      { id: "s5", type: "fuel", location: "Mobile, AL", coordinates: [30.6954, -88.0399], arrival: "2026-10-06T09:00:00", departure: "2026-10-06T09:30:00", duration_hours: 0.5, duty_status: "on_duty", description: "Refuel tractor, inspect tires." },
      { id: "s6", type: "break", location: "Tallahassee, FL", coordinates: [30.4383, -84.2807], arrival: "2026-10-06T13:30:00", departure: "2026-10-06T14:00:00", duration_hours: 0.5, duty_status: "off_duty", description: "Required 30-minute break." },
      { id: "s7", type: "rest", location: "Ocala, FL", coordinates: [29.1872, -82.1401], arrival: "2026-10-06T17:00:00", departure: "2026-10-07T03:00:00", duration_hours: 10, duty_status: "sleeper_berth", description: "10-hour sleeper berth rest." },
      { id: "s8", type: "dropoff", location: dropoff, coordinates: [25.7617, -80.1918], arrival: "2026-10-07T05:45:00", departure: "2026-10-07T06:45:00", duration_hours: 1, duty_status: "on_duty", description: "Unload and obtain delivery signature." },
    ],
    events: [
      { id: "e1", time: "2026-10-05T06:00:00", title: "Start Shift", kind: "on_duty", location: start },
      { id: "e2", time: "2026-10-05T06:00:00", title: "Pickup", kind: "pickup", duration_hours: 1, location: pickup },
      { id: "e3", time: "2026-10-05T07:00:00", title: "Driving", kind: "driving", duration_hours: 8 },
      { id: "e4", time: "2026-10-05T15:00:00", title: "30-Minute Break", kind: "break", duration_hours: 0.5, location: "Lafayette, LA" },
      { id: "e5", time: "2026-10-05T15:30:00", title: "Resume Driving", kind: "driving", duration_hours: 3 },
      { id: "e6", time: "2026-10-05T18:30:00", title: "10-Hour Rest", kind: "off_duty", duration_hours: 10, location: "Baton Rouge, LA" },
      { id: "e7", time: "2026-10-06T04:30:00", title: "Resume Trip", kind: "on_duty", duration_hours: 0.5 },
      { id: "e8", time: "2026-10-06T09:00:00", title: "Fuel Stop", kind: "fuel", duration_hours: 0.5, location: "Mobile, AL" },
      { id: "e9", time: "2026-10-06T13:30:00", title: "30-Minute Break", kind: "break", duration_hours: 0.5, location: "Tallahassee, FL" },
      { id: "e10", time: "2026-10-06T17:00:00", title: "Sleeper Berth", kind: "sleeper_berth", duration_hours: 10, location: "Ocala, FL" },
      { id: "e11", time: "2026-10-07T03:30:00", title: "Final Leg", kind: "driving", duration_hours: 2.25 },
      { id: "e12", time: "2026-10-07T05:45:00", title: "Dropoff", kind: "dropoff", duration_hours: 1, location: dropoff },
    ],
    logs: [
      log(1, "2026-10-05", 610, start, "Baton Rouge, LA", ["06:00 Pickup — " + pickup, "15:00 Break — Lafayette, LA", "18:30 Rest — Baton Rouge, LA"], day1),
      log(2, "2026-10-06", 690, "Baton Rouge, LA", "Ocala, FL", ["09:00 Fuel — Mobile, AL", "13:30 Break — Tallahassee, FL", "17:00 Sleeper — Ocala, FL"], day2),
      log(3, "2026-10-07", 240, "Ocala, FL", dropoff, ["05:45 Dropoff — " + dropoff], day3),
    ],
    compliance: {
      compliant: true,
      items: [
        { id: "c1", rule: "11-hour driving limit respected", detail: "Max 11h driving per shift", passed: true },
        { id: "c2", rule: "14-hour driving window respected", detail: "Longest window 12.5h", passed: true },
        { id: "c3", rule: "30-minute break scheduled", detail: "2 breaks planned", passed: true },
        { id: "c4", rule: "10-hour rest scheduled", detail: "2 rest periods planned", passed: true },
        { id: "c5", rule: "70-hour cycle within limit", detail: "Cycle stays under 70h", passed: true },
        { id: "c6", rule: "Fuel stop planned within 1,000 miles", detail: "Fuel at mile 870", passed: true },
      ],
    },
  };
}

export const sampleTripRequest: TripRequest = {
  current_location: "Dallas, TX",
  pickup_location: "Houston, TX",
  dropoff_location: "Miami, FL",
  current_cycle_used: 20,
};
