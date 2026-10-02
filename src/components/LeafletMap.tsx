import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import type { LatLng, TripStop } from "@/types/trip";
import { stopLabel } from "@/lib/format";

const letter = { start: "S", pickup: "P", fuel: "F", break: "B", rest: "R", dropoff: "D" } as const;

const icon = (type: TripStop["type"]) =>
  L.divIcon({
    className: "",
    html: `<div class="rl-pin rl-pin-${type}">${letter[type]}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

export default function LeafletMap({ route, stops }: { route: LatLng[]; stops: TripStop[] }) {
  const bounds = L.latLngBounds(route.length ? route : stops.map((s) => s.coordinates));
  return (
    <MapContainer bounds={bounds} boundsOptions={{ padding: [30, 30] }} scrollWheelZoom={false} className="absolute inset-0 h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Polyline positions={route} pathOptions={{ color: "oklch(0.23 0.045 258)", weight: 4, opacity: 0.85 }} />
      {stops.map((s) => (
        <Marker key={s.id} position={s.coordinates} icon={icon(s.type)}>
          <Popup>
            <strong>{stopLabel[s.type]}</strong>
            <br />
            {s.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
