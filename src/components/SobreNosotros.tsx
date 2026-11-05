"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { empresa } from "@/data/empresa";
import Reveal from "./Reveal";
import { IconoCamara } from "./Iconos";

export default function SobreNosotros() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".nos-foto", { y: 60 }, { y: -60, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".nos-sello", { rotate: -20 }, { rotate: 20, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="nosotros" className="scroll-mt-20 overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative">
          <div className="nos-foto relative grid aspect-[4/3] place-items-center rounded-[2rem] border-2 border-dashed border-azul-medio bg-gradient-to-br from-azul to-white text-center">
            <div className="p-6">
              <IconoCamara className="mx-auto h-12 w-12 text-tinta-suave" />
              <p className="mt-3 font-semibold text-tinta">[FOTO DEL EQUIPO O DE LA OFICINA]</p>
              <p className="text-sm text-tinta-suave">{empresa.direccion}, {empresa.ciudad}</p>
            </div>
          </div>
          <div className="nos-sello absolute -bottom-6 -right-2 grid h-32 w-32 place-items-center rounded-full bg-naranja text-center text-tinta shadow-xl shadow-naranja/30 sm:-right-6">
            <div>
              <p className="text-xs font-semibold uppercase">desde</p>
              <p className="text-3xl font-bold leading-none">{empresa.fundacion}</p>
            </div>
          </div>
        </div>
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-tinta-suave">Sobre nosotros</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Tu inmobiliaria <span className="text-naranja-texto">en Linares</span></h2>
          {/* Texto tomado de la página "Empresa" de inmopasaje.es */}
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-tinta/90">
            <p>Nuestra empresa está formada por un equipo profesional joven y dinámico con un objetivo común: satisfacer las demandas de nuestros clientes.</p>
            <p>Disponemos de una amplia oferta inmobiliaria de viviendas nuevas y de segunda mano, chalets y fincas por toda la provincia, alquileres y traspasos.</p>
          </div>
          <p className="mt-6 rounded-2xl bg-azul p-4 text-sm text-tinta">
            [PENDIENTE: historia de la empresa, nombre del equipo y qué os diferencia. Este texto es el de vuestra web actual.]
          </p>
        </Reveal>
      </div>
    </section>
  );
}
