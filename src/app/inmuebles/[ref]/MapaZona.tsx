"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export const CAPA_MAPA = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

export default function MapaZona({ lat, lng }: { lat: number; lng: number }) {
  const div = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mapa: import("leaflet").Map | undefined;
    let cancelado = false;
    import("leaflet").then((L) => {
      if (cancelado || !div.current) return;
      mapa = L.map(div.current, { scrollWheelZoom: false }).setView([lat, lng], 15);
      L.tileLayer(CAPA_MAPA.url, { attribution: CAPA_MAPA.attribution, maxZoom: 19 }).addTo(mapa);
      L.circle([lat, lng], { radius: 180, color: "#F28C28", weight: 2, fillColor: "#F28C28", fillOpacity: 0.18 }).addTo(mapa);
    });
    return () => { cancelado = true; mapa?.remove(); };
  }, [lat, lng]);
  return <div ref={div} className="h-full w-full" aria-label="Mapa de la zona del inmueble" />;
}
