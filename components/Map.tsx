"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { establishments } from "@/data/establishments";
import "leaflet/dist/leaflet.css";

type Props = {
  selected: number | null;
  onSelect: (id: number) => void;
};

function FlyToSelected({
  selected,
}: {
  selected: number | null;
}) {
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

export default function Map({ selected, onSelect }: Props) {
  const [mounted, setMounted] = useState(false);

  const center: [number, number] = [-23.5505, -47.9011];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: "100%", width: "100%" }} />;
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToSelected selected={selected} />

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