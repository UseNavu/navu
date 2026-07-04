"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { establishments } from "@/data/establishments";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Props = {
  selected: number | null;
  onSelect: (id: number) => void;
  userPos: [number, number] | null;
};

/* 🔴 ÍCONE DO USUÁRIO */
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

/* 📍 FOCUS AUTOMÁTICO NO COMÉRCIO */
function FocusMap({ selected }: { selected: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selected) return;

    const est = establishments.find((e) => e.id === selected);
    if (!est) return;

    map.flyTo([est.lat, est.lng], 16, {
      duration: 1,
    });
  }, [selected, map]);

  return null;
}

export default function Map({ selected, onSelect, userPos }: Props) {
  const [mounted, setMounted] = useState(false);

  const center: [number, number] = [-15.78, -47.93]; // Brasil

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: "100%", width: "100%" }} />;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        maxBounds={[
          [-33.75, -73.99], // sul-oeste
          [5.27, -34.79],   // norte-leste
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* FOCO NO SELECIONADO */}
        <FocusMap selected={selected} />

        {/* MARCADOR USUÁRIO */}
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
            eventHandlers={{
              click: () => onSelect(item.id),
            }}
          >
            <Popup>
              <strong>{item.name}</strong>
              <br />
              {item.category}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}