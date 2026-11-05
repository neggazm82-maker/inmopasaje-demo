"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Buscador from "./Buscador";

const palabras = ["Encontramos", "la", "casa", "de", "tus", "sueños", "en"];

export default function Hero() {
  const seccion = useRef<HTMLElement>(null);
  const foto = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Zoom lento y continuo de la foto
      gsap.fromTo(foto.current, { scale: 1.02 }, { scale: 1.16, duration: 22, ease: "none", repeat: -1, yoyo: true });
      // Parallax: la foto baja más despacio que la página
      gsap.to(".hero-capa", {
        yPercent: 22,
        ease: "none",
        scrollTrigger: { trigger: seccion.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, seccion);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={seccion} className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-10 pt-28 sm:items-center sm:pb-16">
      <div className="hero-capa absolute inset-0 -z-10">
        <div
          ref={foto}
          className="absolute inset-0 bg-cover bg-[center_30%] will-change-transform"
          style={{ backgroundImage: "url(/portada.jpg)" }}
          role="img"
          aria-label="Terraza con vistas a los tejados de Linares (inmueble ref. 1388)"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-tinta/70 via-tinta/55 to-tinta/90" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-tinta/60 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.p
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="h-2 w-2 rounded-full bg-naranja" /> Inmobiliaria en Linares (Jaén)
        </motion.p>

        <h1 className="max-w-4xl text-[2.25rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {palabras.map((p, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              >
                {p}&nbsp;
              </motion.span>
            </span>
          ))}
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="relative inline-block text-naranja"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 + palabras.length * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              Linares
              <motion.svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full" aria-hidden>
                <motion.path
                  d="M2 9 C 50 2, 150 2, 198 8"
                  fill="none"
                  stroke="#F28C28"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 1.3 }}
                />
              </motion.svg>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-5 max-w-xl text-base text-white [text-shadow:0_1px_12px_rgba(15,30,50,.6)] sm:mt-6 sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          Pisos, casas, locales, cocheras y solares en venta y alquiler. Te acompañamos desde la primera visita hasta la firma.
        </motion.p>

        <motion.div
          className="mt-8 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Buscador />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-white/70 sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-hidden
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/60 p-1"><div className="mx-auto h-2 w-1 rounded-full bg-white/80" /></div>
      </motion.div>
    </section>
  );
}
