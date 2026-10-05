import type { DutyStatus, StopType, TimelineKind } from "@/types/trip";

export const formatHours = (h: number) => {
  const totalMinutes = Math.round(h * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs === 0) return `${mins}m`;
  return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
};

export const formatTime = (iso: string) => iso.slice(11, 16);

export const formatDate = (iso: string) =>
  new Date(iso.length === 10 ? iso + "T12:00:00Z" : iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export const dutyLabel: Record<DutyStatus, string> = {
  off_duty: "Off Duty",
  sleeper_berth: "Sleeper Berth",
  driving: "Driving",
  on_duty: "On Duty",
};

export const kindLabel: Record<TimelineKind, string> = {
  driving: "Driving",
  on_duty: "On Duty",
  off_duty: "Off Duty",
  sleeper_berth: "Sleeper Berth",
  fuel: "Fuel",
  break: "Break",
  pickup: "Pickup",
  dropoff: "Dropoff",
};

export const kindColor: Record<TimelineKind, string> = {
  driving: "bg-status-driving",
  on_duty: "bg-status-on",
  off_duty: "bg-status-off",
  sleeper_berth: "bg-status-sleeper",
  fuel: "bg-status-fuel",
  break: "bg-status-break",
  pickup: "bg-status-pickup",
  dropoff: "bg-status-dropoff",
};

export const stopLabel: Record<StopType, string> = {
  start: "Start",
  pickup: "Pickup",
  fuel: "Fuel Stop",
  break: "30-Min Break",
  rest: "Rest Stop",
  dropoff: "Dropoff",
};

export const stopColor: Record<StopType, string> = {
  start: "bg-navy",
  pickup: "bg-status-pickup",
  fuel: "bg-status-fuel",
  break: "bg-status-break",
  rest: "bg-status-sleeper",
  dropoff: "bg-status-dropoff",
};
