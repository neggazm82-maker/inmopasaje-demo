"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Inmueble } from "@/data/inmuebles";
import { m2 } from "@/lib/utils";
import Etiquetas from "./Etiquetas";
import Precio from "./Precio";
import { IconoBano, IconoCama, IconoFlecha, IconoMetros, IconoPin } from "./Iconos";

export default function TarjetaInmueble({ i, indice = 0 }: { i: Inmueble; indice?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (indice % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_-20px_rgba(31,58,95,.35)] ring-1 ring-azul transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(31,58,95,.5)]"
    >
      <Link href={`/inmuebles/${i.ref}/`} className="absolute inset-0 z-20" aria-label={`Ver inmueble ref. ${i.ref}: ${i.titulo}`} />
      <div className="relative aspect-[4/3] overflow-hidden bg-azul">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={i.fotos[0]}
          alt={i.titulo}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 grid place-items-center bg-tinta/0 transition-colors duration-500 group-hover:bg-tinta/40">
          <span className="flex translate-y-4 items-center gap-2 rounded-full bg-white px-5 py-2.5 font-semibold text-tinta opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Ver inmueble <IconoFlecha className="h-4 w-4" />
          </span>
        </div>
        <Etiquetas i={i} className="absolute left-3 top-3" />
        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-tinta">Ref. {i.ref}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Precio i={i} />
        <h3 className="line-clamp-2 font-semibold leading-snug text-tinta">{i.titulo}</h3>
        <p className="flex items-center gap-1.5 text-sm text-tinta-suave">
          <IconoPin className="h-4 w-4 text-azul-medio" /> {i.tipo} · {i.zona}
        </p>
        <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-azul pt-4 text-sm text-tinta">
          {i.m2Construidos != null && <li className="flex items-center gap-1.5"><IconoMetros className="h-4 w-4 text-tinta-suave" />{m2(i.m2Construidos)}</li>}
          {i.habitaciones != null && <li className="flex items-center gap-1.5"><IconoCama className="h-4 w-4 text-tinta-suave" />{i.habitaciones} hab.</li>}
          {i.banos != null && <li className="flex items-center gap-1.5"><IconoBano className="h-4 w-4 text-tinta-suave" />{i.banos} {i.banos === 1 ? "baño" : "baños"}</li>}
        </ul>
      </div>
    </motion.article>
  );
}
