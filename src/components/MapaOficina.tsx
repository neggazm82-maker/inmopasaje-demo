"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { empresa } from "@/data/empresa";
import { CAPA_MAPA } from "@/app/inmuebles/[ref]/MapaZona";

export default function MapaOficina() {
  const div = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mapa: import("leaflet").Map | undefined;
    let cancelado = false;
    import("leaflet").then((L) => {
      if (cancelado || !div.current) return;
      const { lat, lng } = empresa.oficina;
      mapa = L.map(div.current, { scrollWheelZoom: false }).setView([lat, lng], 17);
      L.tileLayer(CAPA_MAPA.url, { attribution: CAPA_MAPA.attribution, maxZoom: 19 }).addTo(mapa);
      L.marker([lat, lng], { icon: L.divIcon({ className: "", html: `<div class="marcador oficina">El Pasaje · Canalejas, 15</div>`, iconSize: [0, 0] }) }).addTo(mapa);
    });
    return () => { cancelado = true; mapa?.remove(); };
  }, []);
  return <div ref={div} className="h-full w-full" aria-label="Mapa de la oficina en Calle Canalejas 15, Linares" />;
}
