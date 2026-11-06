"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { zonasLinares } from "@/data/zonas";
import { CAPA_MAPA } from "@/lib/mapa";

/** Mapa de Linares con un punto por zona: al tocarlo se elige la zona. */
export default function MapaZonas({ elegida, elegir }: { elegida: string; elegir: (z: string) => void }) {
  const div = useRef<HTMLDivElement>(null);
  const capas = useRef<Map<string, import("leaflet").CircleMarker>>(new Map());
  const elegirRef = useRef(elegir);
  elegirRef.current = elegir;

  useEffect(() => {
    let mapa: import("leaflet").Map | undefined;
    let cancelado = false;
    import("leaflet").then((L) => {
      if (cancelado || !div.current) return;
      mapa = L.map(div.current, { scrollWheelZoom: false, zoomControl: true });
      L.tileLayer(CAPA_MAPA.url, { attribution: CAPA_MAPA.attribution, maxZoom: 19 }).addTo(mapa);
      const puntos = zonasLinares.map((z) => {
        const c = L.circleMarker([z.lat, z.lng], { radius: 14, color: "#1F3A5F", weight: 2, fillColor: "#A9CCEB", fillOpacity: 0.9 })
          .addTo(mapa!)
          .bindTooltip(z.nombre, { direction: "top", offset: [0, -10] })
          .on("click", () => elegirRef.current(z.nombre));
        capas.current.set(z.nombre, c);
        return [z.lat, z.lng] as [number, number];
      });
      mapa.fitBounds(L.latLngBounds(puntos), { padding: [30, 30] });
    });
    return () => { cancelado = true; mapa?.remove(); capas.current.clear(); };
  }, []);

  useEffect(() => {
    capas.current.forEach((c, nombre) => {
      const si = nombre === elegida;
      c.setStyle({ fillColor: si ? "#F28C28" : "#A9CCEB" });
      c.setRadius(si ? 18 : 14);
    });
  }, [elegida]);

  return <div ref={div} className="h-64 w-full sm:h-72" aria-label="Mapa de zonas de Linares" />;
}
