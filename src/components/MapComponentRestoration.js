"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  ZoomControl,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2, MapPin } from "lucide-react";

// Setup Icon Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapFixer() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function LocationMarker({ position, setPosition }) {
  const markerRef = useRef(null);
  const [address, setAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition({ lat: newPos.lat, lng: newPos.lng });
        }
      },
    }),
    [setPosition],
  );

  useEffect(() => {
    if (!position) return;

    const fetchAddress = async () => {
      setIsLoadingAddress(true);
      setAddress("Searching location...");

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`,
        );
        const data = await response.json();

        if (data && data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress("Abandoned Area..");
        }
      } catch (error) {
        console.error("Failed pick a location:", error);
        setAddress("Failed Load Address.");
      } finally {
        setIsLoadingAddress(false);
        if (markerRef.current) {
          markerRef.current.openPopup();
        }
      }
    };

    fetchAddress();
  }, [position?.lat, position?.lng]);

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[position.lat, position.lng]}
      icon={customIcon}
      ref={markerRef}
    >
      <Popup autoPan={true}>
        <div className="flex flex-col gap-1.5 max-w-[220px] p-0.5">
          <div className="flex items-center gap-1.5 text-[#A4CF4A] font-bold border-b border-slate-100 pb-1.5">
            <MapPin size={14} strokeWidth={2.5} />
            <span className="text-xs tracking-wider">
              REPORT LOCATION
            </span>
          </div>

          {isLoadingAddress ? (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs py-1">
              <Loader2 size={12} className="animate-spin" />
              <span>Find the location...</span>
            </div>
          ) : (
            <span className="font-medium text-slate-700 text-xs leading-snug tracking-wide">
              {address}
            </span>
          )}

          <span className="text-[10px] text-slate-400 mt-1 italic">
            *Drag the pin...
          </span>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapPicker({ position, setPosition }) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const centerMap = position
    ? [position.lat, position.lng]
    : [-6.2, 106.816666];

  return (
    <MapContainer
      center={centerMap}
      zoom={14}
      zoomControl={false}
      className="w-full max-w-[1250px] h-[300px] md:h-[400px] rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <LocationMarker position={position} setPosition={setPosition} />

      <MapFixer />
    </MapContainer>
  );
}
