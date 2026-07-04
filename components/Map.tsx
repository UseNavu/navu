"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import L from "leaflet";
import { establishments } from "@/data/establishments";

/* ---------------- ICON FIX ---------------- */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

/* ---------------- ICONS ---------------- */
const defaultIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/* ---------------- ROUTE ---------------- */
function Routing({
  userPos,
  dest,
}: {
  userPos: [number, number] | null;
  dest: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (!userPos || !dest) return;

    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(userPos[0], userPos[1]),
        L.latLng(dest.lat, dest.lng),
      ],
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 5 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    });

    routingControl.addTo(map);

    // ✅ CLEANUP CORRETO (NUNCA RETORNAR MAP OU CONTROL DIRETO)
    return () => {
      map.removeControl(routingControl);
    };
  }, [userPos, dest, map]);

  return null;
}

/* ---------------- FOCUS ---------------- */
function FocusMap({ selected }: { selected: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selected) return;

    const est = establishments.find((e) => e.id === selected);
    if (!est) return;

    map.flyTo([est.lat, est.lng], 16, { duration: 1 });
  }, [selected, map]);

  return null;
}

/* ---------------- COMPONENT ---------------- */
export default function Map({
  selected,
  userPos,
}: {
  selected: number | null;
  onSelect: (id: number) => void;
  userPos: [number, number] | null;
}) {
  const [mounted, setMounted] = useState(false);

  const center: [number, number] = [-15.78, -47.93];

  const dest = establishments.find((e) => e.id === selected);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-zinc-900" />;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-zinc-800">
      <MapContainer
        center={center}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        maxBounds={[
          [-33.75, -73.99],
          [5.27, -34.79],
        ]}
        maxBoundsViscosity={1}
      >
        {/* TILE DARK */}
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FocusMap selected={selected} />

        {/* ROTA */}
        {userPos && dest && (
          <Routing userPos={userPos} dest={dest} />
        )}

        {/* USER */}
        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        {/* DESTINO */}
        {dest && (
          <Marker position={[dest.lat, dest.lng]} icon={defaultIcon}>
            <Popup>
              <strong>{dest.name}</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}