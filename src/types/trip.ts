export type DutyStatus = "off_duty" | "sleeper_berth" | "driving" | "on_duty";

export type StopType = "start" | "pickup" | "fuel" | "break" | "rest" | "dropoff";

export type TimelineKind =
  | "driving"
  | "on_duty"
  | "off_duty"
  | "sleeper_berth"
  | "fuel"
  | "break"
  | "pickup"
  | "dropoff";

/** [latitude, longitude] */
export type LatLng = [number, number];

export interface LocationValue {
  name: string;
  /** Null until selected or resolved; manual typing remains supported. */
  lat: number | null;
  lng: number | null;
}

export interface ResolvedLocation extends LocationValue {
  lat: number;
  lng: number;
}

export interface TripRequest {
  current_location: LocationValue;
  pickup_location: LocationValue;
  dropoff_location: LocationValue;
  current_cycle_used: number;
}

export interface TripStop {
  id: string;
  type: StopType;
  location: string;
  coordinates: LatLng;
  arrival: string; // ISO datetime
  departure: string; // ISO datetime
  duration_hours: number;
  duty_status: DutyStatus;
  description: string;
}

export interface TripEvent {
  id: string;
  time: string; // ISO datetime
  title: string;
  kind: TimelineKind;
  duration_hours?: number;
  location?: string;
  distance_miles?: number;
}

/** A segment on the 24h ELD grid. Hours are 0–24 within the log day. */
export interface LogSegment {
  status: DutyStatus;
  start_hour: number;
  end_hour: number;
  note?: string;
}

export interface DailyLog {
  day: number;
  date: string; // YYYY-MM-DD
  total_miles: number;
  truck_number: string;
  trailer_number: string;
  carrier: string;
  from: string;
  to: string;
  remarks: string[];
  segments: LogSegment[];
  totals: Record<DutyStatus, number>;
}

export interface ComplianceItem {
  id: string;
  rule: string;
  detail: string;
  passed: boolean;
}

export interface ComplianceResult {
  compliant: boolean;
  items: ComplianceItem[];
}

export interface TripResponse {
  distance_miles: number;
  driving_hours: number;
  total_trip_hours: number;
  remaining_cycle_hours: number;
  driving_days: number;
  route: LatLng[];
  stops: TripStop[];
  events: TripEvent[];
  logs: DailyLog[];
  compliance: ComplianceResult;
}

export class TripApiError extends Error {
  field?: keyof TripRequest | undefined;
  constructor(message: string, field?: keyof TripRequest) {
    super(message);
    this.name = "TripApiError";
    this.field = field;
  }
}
