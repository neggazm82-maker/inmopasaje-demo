"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { IconoCheck, IconoFlecha } from "./Iconos";

/** Sección para captar propietarios: foto a un lado y texto con botón al otro. */
export default function BandaValoracion() {
  return (
    <section id="valora" className="relative overflow-hidden bg-azul py-16 sm:py-24">
      <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-azul-medio/40 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Foto: arriba en el móvil, a la izquierda en el ordenador */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-25px_rgba(31,58,95,.45)] ring-4 ring-white">
            <motion.img
              src="/img/valoracion-calle-andaluza-1024.webp"
              srcSet={[480, 768, 1024, 1506].map((w) => `/img/valoracion-calle-andaluza-${w}.webp ${w}w`).join(", ")}
              sizes="(min-width: 1024px) 45vw, 100vw"
              width={1506}
              height={2000}
              loading="lazy"
              decoding="async"
              alt="Calle andaluza con fachadas blancas, balcones de hierro forjado y una casa blanca al fondo"
              className="aspect-[4/5] w-full object-cover object-[50%_45%] lg:aspect-[6/7]"
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <motion.div
            className="absolute -bottom-5 right-4 rounded-2xl bg-white px-5 py-3 shadow-xl shadow-tinta/15 sm:right-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-xs font-medium text-tinta-suave">Te llamamos en</p>
            <p className="text-xl font-bold text-naranja-texto">menos de 24 h</p>
          </motion.div>
        </motion.div>

        {/* Texto */}
        <Reveal className="pt-4 lg:pt-0">
          <p className="text-sm font-semibold uppercase tracking-widest text-tinta-suave">¿Tienes una casa para vender o alquilar?</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            ¿Cuánto vale <span className="text-naranja-texto">tu casa?</span>
          </h2>
          <p className="mt-4 text-lg text-tinta/90">
            Responde 5 preguntas rápidas desde el móvil. Un experto de El Pasaje estudia tu inmueble y te llama con una valoración real, no un cálculo automático.
          </p>
          <ul className="mt-6 space-y-3">
            {["Gratis y sin compromiso", "Puedes añadir fotos de tu inmueble", "Para vender o para alquilar"].map((t) => (
              <li key={t} className="flex items-center gap-3 font-medium">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-tinta ring-1 ring-azul-medio"><IconoCheck className="h-4 w-4" /></span>
                {t}
              </li>
            ))}
          </ul>
          <Link href="/valora-tu-casa/" className="btn-naranja mt-8 !px-8 !py-4 text-lg">
            Valora tu casa en 2 minutos <IconoFlecha className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
