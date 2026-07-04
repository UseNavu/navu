"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { establishments } from "@/data/establishments";
import L from "leaflet";

// 🔧 Corrige ícones quebrados do Leaflet no Next.js
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  const center: [number, number] = [-23.5505, -47.9011];

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
    </div>
  );
}