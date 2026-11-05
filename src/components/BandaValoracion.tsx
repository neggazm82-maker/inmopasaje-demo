"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";
import { IconoFlecha } from "./Iconos";

/** Banda con foto en parallax que invita a los propietarios a valorar su casa. */
export default function BandaValoracion() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".banda-foto", { yPercent: -15 }, { yPercent: 15, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="banda-foto absolute -inset-y-[20%] inset-x-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url(/inmuebles/30347971/1.jpg)" }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-tinta/90 via-tinta/75 to-tinta/40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-azul-medio">¿Tienes una casa para vender o alquilar?</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            ¿Cuánto vale tu casa? <span className="text-naranja">Te lo decimos en 24 horas</span>
          </h2>
          <p className="mt-4 text-lg text-white/90">Responde 5 preguntas rápidas desde el móvil. Un experto de El Pasaje estudia tu inmueble y te llama con una valoración real.</p>
          <Link href="/valora-tu-casa/" className="btn-naranja mt-8 !px-8 !py-4 text-lg">
            Valora tu casa gratis <IconoFlecha className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
