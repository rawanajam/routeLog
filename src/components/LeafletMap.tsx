import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import type { LatLng, TripStop } from "@/types/trip";
import { formatDate, formatHours, formatTime, stopLabel } from "@/lib/format";

const letter = { start: "S", pickup: "P", fuel: "F", break: "B", rest: "R", dropoff: "D" } as const;

const icon = (type: TripStop["type"]) =>
  L.divIcon({
    className: "",
    html: `<div class="rl-pin rl-pin-${type}">${letter[type]}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

function RouteViewport({ points }: { points: LatLng[] }) {
  const map = useMap();
  const bounds = useMemo(() => L.latLngBounds(points), [points]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    });
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [map, bounds]);
  return (
    <button
      type="button"
      onClick={() => bounds.isValid() && map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })}
      onDoubleClick={(event) => event.stopPropagation()}
      className="absolute right-3 top-3 z-[500] rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-secondary"
    >
      Fit route
    </button>
  );
}

export default function LeafletMap({ route, stops }: { route: LatLng[]; stops: TripStop[] }) {
  const points = useMemo(() => [...route, ...stops.map((stop) => stop.coordinates)], [route, stops]);
  return (
    <MapContainer center={[39.5, -98.35]} zoom={4} scrollWheelZoom={false} className="absolute inset-0 h-full w-full" style={{ height: "100%", width: "100%" }}>
      <RouteViewport points={points} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <Polyline positions={route} pathOptions={{ color: "#24344d", weight: 5, opacity: 0.9 }} />
      {stops.map((s) => (
        <Marker key={s.id} position={s.coordinates} icon={icon(s.type)}>
          <Popup>
            <strong>{stopLabel[s.type]}</strong>
            <br />
            {s.location}
            <dl className="mt-2 space-y-1 text-xs">
              <div><dt className="inline font-medium">Arrival: </dt><dd className="inline">{formatDate(s.arrival)} {formatTime(s.arrival)}</dd></div>
              <div><dt className="inline font-medium">Departure: </dt><dd className="inline">{formatDate(s.departure)} {formatTime(s.departure)}</dd></div>
              <div><dt className="inline font-medium">Duration: </dt><dd className="inline">{formatHours(s.duration_hours)}</dd></div>
            </dl>
            <p className="mt-2 text-xs">{s.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
