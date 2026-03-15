"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// === FIX BUG IKON MARKER GAIB DI NEXT.JS ===
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapComponent({ locations = [] }) {
  // Cek di console apakah data masuk ke komponen ini
  // console.log("📍 Data lokasi di MapComponent:", locations);

  return (
    <MapContainer
      center={[-6.12345, 106.12345]} // Kordinat tengah awal (Sunda Kelapa)
      zoom={10}
      className="w-full h-full z-0 relative"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Looping Pin Point Mangrove */}
      {locations.map((area) => (
        <Marker key={area.id} position={[area.latitude, area.longitude]}>
          <Popup>
            <div className="font-extrabold text-slate-800 text-sm">
              {area.name}
            </div>
            <p className="text-[10px] text-slate-500 m-0 mt-1">
              Area Penanaman Mangrove
            </p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
