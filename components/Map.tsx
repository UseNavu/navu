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

// 🔧 FIX ÍCONES LEAFLET (OBRIGATÓRIO NO NEXT)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// 🎯 ÍCONE PADRÃO CORRIGIDO
const defaultIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 📍 ÍCONE USUÁRIO (SETA)
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

type Props = {
  selected: number | null;
  onSelect: (id: number) => void;
  userPos: [number, number] | null;
};

// 🎯 FOCUS AUTOMÁTICO NO SELECIONADO
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

  if (!mounted) {
    return <div className="h-full w-full" />;
  }

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
        maxBoundsViscosity={1.0}
      >
        {/* MAPA DARK BONITO */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FocusMap selected={selected} />

        {/* USUÁRIO */}
        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        {/* COMÉRCIOS */}
        {establishments.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={defaultIcon}
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