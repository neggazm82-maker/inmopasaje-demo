"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconoCasa, IconoEtiqueta, IconoGrafico, IconoLlave, IconoTienda, IconoEdificio, IconoFlecha } from "./Iconos";
import Reveal from "./Reveal";

const servicios = [
  { icono: IconoEtiqueta, titulo: "Venta", texto: "Pisos, casas, locales, cocheras y solares en Linares. Te enseñamos el inmueble y te acompañamos hasta la firma.", href: "/inmuebles/?op=venta", cta: "Ver inmuebles en venta" },
  { icono: IconoLlave, titulo: "Alquiler", texto: "Alquiler de larga duración y alquiler de temporada, para viviendas y locales.", href: "/inmuebles/?op=alquiler", cta: "Ver alquileres" },
  { icono: IconoCasa, titulo: "Alquiler con opción a compra", texto: "Empieza alquilando y decide después si compras la vivienda.", href: "/#contacto", cta: "Pregúntanos" },
  { icono: IconoTienda, titulo: "Traspasos", texto: "Traspaso de negocios y locales comerciales en funcionamiento.", href: "/#contacto", cta: "Pregúntanos" },
  { icono: IconoEdificio, titulo: "Obra nueva", texto: "Promociones de viviendas nuevas. Pregúntanos por las próximas.", href: "/#contacto", cta: "Pregúntanos" },
  { icono: IconoGrafico, titulo: "Valoración de inmuebles", texto: "¿Cuánto vale tu casa? Te damos una valoración real y gratuita en menos de 24 horas.", href: "/valora-tu-casa/", cta: "Valora tu casa" },
];

export default function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-tinta-suave">Servicios</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Todo lo que necesitas, <span className="text-naranja-texto">en un solo sitio</span></h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map((s, k) => (
            <motion.div
              key={s.titulo}
              initial={{ opacity: 0, y: 40, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: (k % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 900 }}
            >
              <Link href={s.href} className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-azul-medio/60 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(31,58,95,.5)]">
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-naranja transition-transform duration-500 group-hover:scale-x-100" />
                <span className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-azul transition-transform duration-500 group-hover:scale-150" />
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-azul text-tinta ring-1 ring-azul-medio transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-naranja group-hover:ring-naranja">
                  <s.icono className="h-7 w-7" />
                </span>
                <h3 className="relative mt-5 text-xl font-bold">{s.titulo}</h3>
                <p className="relative mt-2 flex-1 text-tinta-suave">{s.texto}</p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 font-semibold text-tinta">
                  {s.cta} <IconoFlecha className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
