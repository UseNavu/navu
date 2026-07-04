"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/* ---------------- CENTER MAP ---------------- */
const center: [number, number] = [-15.78, -47.93];

export default function Map({
  userPos,
}: {
  userPos: [number, number] | null;
}) {
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

      {/* USER */}
      {userPos && (
        <Marker position={userPos} icon={userIcon}>
          <Popup>Você está aqui</Popup>
        </Marker>
      )}

      {/* ESTABELECIMENTOS */}
      {establishments.map((item) => (
        <Marker key={item.id} position={[item.lat, item.lng]}>
          <Popup>
            <strong>{item.name}</strong>
            <br />
            {item.category}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}