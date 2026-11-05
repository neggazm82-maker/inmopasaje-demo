"use client";

import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import AvisoMuestra from "./AvisoMuestra";

const MapaInmuebles = dynamic(() => import("./MapaInmuebles"), { ssr: false, loading: () => <div className="h-full animate-pulse bg-azul" /> });

export default function SeccionMapa() {
  return (
    <section id="mapa" className="scroll-mt-20 bg-azul py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-tinta-suave">Mapa de Linares</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Busca <span className="text-naranja-texto">en el mapa</span>
          </h2>
          <p className="mt-3 text-tinta-suave">Toca un precio para ver la foto y entrar en el inmueble. Los puntos indican la zona, no el portal exacto.</p>
          <div className="mt-4"><AvisoMuestra /></div>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 h-[460px] overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-tinta/10 ring-4 ring-white sm:h-[560px]">
          <MapaInmuebles />
        </Reveal>
      </div>
    </section>
  );
}
