"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { establishments } from "@/data/establishments";

/* ---------------- ICONS ---------------- */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

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
function Route({
  userPos,
  dest,
}: {
  userPos: [number, number] | null;
  dest: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (!userPos || !dest) return;

    const polyline = L.polyline(
      [userPos, [dest.lat, dest.lng]],
      {
        color: "#3b82f6",
        weight: 4,
      }
    ).addTo(map);

    return () => {
      map.removeLayer(polyline);
    };
  }, [userPos, dest, map]);

  return null;
}

/* ---------------- FOCUS ---------------- */
function Focus({ selected }: { selected: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selected) return;

    const est = establishments.find((e) => e.id === selected);
    if (!est) return;

    map.flyTo([est.lat, est.lng], 16, { duration: 1 });
  }, [selected, map]);

  return null;
}

/* ---------------- MAP ---------------- */
export default function Map({
  selected,
  activeRoute,
  userPos,
}: {
  selected: number | null;
  activeRoute: number | null;
  userPos: [number, number] | null;
}) {
  const center: [number, number] = [-15.78, -47.93];

  const dest = establishments.find((e) => e.id === activeRoute);

  return (
    <MapContainer
      center={center}
      zoom={5}
      minZoom={4}
      maxZoom={18}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <Focus selected={selected} />

      {/* ROUTE SÓ NO BOTÃO */}
      {userPos && dest && (
        <Route userPos={userPos} dest={dest} />
      )}

      {/* USER */}
      {userPos && (
        <Marker position={userPos} icon={userIcon}>
          <Popup>Você está aqui</Popup>
        </Marker>
      )}

      {/* ESTABELECIMENTOS */}
      {establishments.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
          icon={defaultIcon}
        >
          <Popup>
            <strong>{item.name}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}