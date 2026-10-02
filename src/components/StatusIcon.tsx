import {
  Bed,
  Coffee,
  Flag,
  Fuel,
  MapPin,
  Moon,
  PackageCheck,
  PackageOpen,
  Truck,
  Clock,
  Navigation,
  type LucideIcon,
} from "lucide-react";
import type { StopType, TimelineKind } from "@/types/trip";

export const kindIcon: Record<TimelineKind, LucideIcon> = {
  driving: Truck,
  on_duty: Clock,
  off_duty: Moon,
  sleeper_berth: Bed,
  fuel: Fuel,
  break: Coffee,
  pickup: PackageOpen,
  dropoff: PackageCheck,
};

export const stopIcon: Record<StopType, LucideIcon> = {
  start: Navigation,
  pickup: PackageOpen,
  fuel: Fuel,
  break: Coffee,
  rest: Bed,
  dropoff: Flag,
};

export { MapPin };
