"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { InmuebleGuardado } from "@/lib/datos";
import { empresa } from "@/data/empresa";
import { CAPA_MAPA } from "@/lib/mapa";
import { precioTexto, rebaja, euros } from "@/lib/utils";

export default function MapaInmuebles({ inmuebles }: { inmuebles: InmuebleGuardado[] }) {
  const div = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mapa: import("leaflet").Map | undefined;
    let cancelado = false;
    import("leaflet").then((L) => {
      if (cancelado || !div.current) return;
      mapa = L.map(div.current, { scrollWheelZoom: false });
      L.tileLayer(CAPA_MAPA.url, { attribution: CAPA_MAPA.attribution, maxZoom: 19 }).addTo(mapa);

      const puntos: [number, number][] = [];
      inmuebles.filter((i) => i.estado === "disponible").forEach((i, k) => {
        const precioCorto = precioTexto(i);
        const icono = L.divIcon({
          className: "",
          html: `<div class="marcador" style="animation-delay:${k * 90}ms">${precioCorto}</div>`,
          iconSize: [0, 0],
        });
        const r = rebaja(i);
        L.marker([i.lat, i.lng], { icon: icono, title: `${i.tipo} en ${i.zona}, ${precioTexto(i)}` })
          .addTo(mapa!)
          .bindPopup(
            `<a href="/inmuebles/${i.ref}/" class="popup-inmueble">
               <img src="${i.fotos[0]}" alt="" />
               <div>
                 ${r ? `<span class="antes">Antes ${euros(i.precioAnterior!)}</span>` : ""}
                 <strong>${precioTexto(i)}</strong>
                 <span>${i.tipo} · ${i.zona}</span>
                 <em>Ver inmueble →</em>
               </div>
             </a>`,
            { closeButton: true, offset: [0, -14] },
          );
        puntos.push([i.lat, i.lng]);
      });

      L.marker([empresa.oficina.lat, empresa.oficina.lng], {
        icon: L.divIcon({ className: "", html: `<div class="marcador oficina">El Pasaje</div>`, iconSize: [0, 0] }),
        title: "Oficina de Inmobiliaria El Pasaje",
        zIndexOffset: 1000,
      }).addTo(mapa).bindPopup(`<div class="popup-oficina"><strong>Nuestra oficina</strong><span>${empresa.direccion}, ${empresa.ciudad}</span></div>`);

      if (puntos.length) mapa.fitBounds(L.latLngBounds(puntos), { padding: [50, 50], maxZoom: 16 });
      else mapa.setView([empresa.oficina.lat, empresa.oficina.lng], 14);
    });
    return () => { cancelado = true; mapa?.remove(); };
  }, [inmuebles]);
  return <div ref={div} className="h-full w-full" aria-label="Mapa de Linares con los inmuebles" />;
}
