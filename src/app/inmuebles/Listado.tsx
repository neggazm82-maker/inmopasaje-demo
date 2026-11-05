"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { inmuebles } from "@/data/inmuebles";
import TarjetaInmueble from "@/components/TarjetaInmueble";
import AvisoMuestra from "@/components/AvisoMuestra";
import { cn, miles, nombreCategoria } from "@/lib/utils";

const zonas = Array.from(new Set(inmuebles.map((i) => i.zona))).sort();

export default function Listado() {
  const sp = useSearchParams();
  const router = useRouter();
  const op = sp.get("op") ?? "";
  const tipo = sp.get("tipo") ?? "";
  const zona = sp.get("zona") ?? "";
  const max = Number(sp.get("max") ?? 0);
  const orden = sp.get("orden") ?? "";

  const poner = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    if (k === "op") p.delete("max");
    router.replace(`/inmuebles/?${p.toString()}`, { scroll: false });
  };

  let lista = inmuebles.filter(
    (i) => (!op || i.operacion === op) && (!tipo || i.categoria === tipo) && (!zona || i.zona === zona) && (!max || i.precio <= max),
  );
  if (orden === "asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
  if (orden === "desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
  if (orden === "rebajados") lista = lista.filter((i) => i.precioAnterior);

  const titulo = op === "alquiler" ? "Inmuebles en alquiler" : op === "venta" ? "Inmuebles en venta" : "Todos los inmuebles";

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        {titulo} <span className="text-naranja-texto">en Linares</span>
      </h1>
      <div className="mt-4"><AvisoMuestra /></div>

      <div className="sticky top-16 z-30 -mx-4 mt-8 bg-white/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:px-4 sm:shadow-sm sm:ring-1 sm:ring-azul">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
          {[["", "Todos"], ["venta", "Comprar"], ["alquiler", "Alquilar"]].map(([v, t]) => (
            <button key={v} onClick={() => poner("op", v)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition", op === v ? "bg-tinta text-white" : "bg-azul text-tinta hover:bg-azul-medio")}>
              {t}
            </button>
          ))}
          <select aria-label="Tipo de inmueble" value={tipo} onChange={(e) => poner("tipo", e.target.value)} className="shrink-0 rounded-full bg-azul px-4 py-2 text-sm font-semibold text-tinta">
            <option value="">Cualquier tipo</option>
            {Object.entries(nombreCategoria).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select aria-label="Zona" value={zona} onChange={(e) => poner("zona", e.target.value)} className="shrink-0 rounded-full bg-azul px-4 py-2 text-sm font-semibold text-tinta">
            <option value="">Todas las zonas</option>
            {zonas.map((z) => <option key={z}>{z}</option>)}
          </select>
          <select aria-label="Ordenar" value={orden} onChange={(e) => poner("orden", e.target.value)} className="shrink-0 rounded-full bg-azul px-4 py-2 text-sm font-semibold text-tinta">
            <option value="">Ordenar: destacados</option>
            <option value="asc">Precio: más barato</option>
            <option value="desc">Precio: más caro</option>
            <option value="rebajados">Solo rebajados</option>
          </select>
          {max > 0 && (
            <button onClick={() => poner("max", "")} className="shrink-0 rounded-full bg-naranja px-4 py-2 text-sm font-semibold text-tinta">
              Hasta {miles(max)} € ✕
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-tinta-suave" aria-live="polite">
        {lista.length} {lista.length === 1 ? "inmueble encontrado" : "inmuebles encontrados"}
      </p>

      <motion.div layout className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {lista.map((i, n) => (
            <motion.div key={i.ref} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <TarjetaInmueble i={i} indice={n} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {lista.length === 0 && (
        <div className="mt-6 rounded-3xl bg-azul p-8 text-center">
          <p className="text-lg font-semibold">No hay inmuebles con esos filtros ahora mismo.</p>
          <p className="mt-2 text-tinta-suave">Prueba a quitar algún filtro o deja tu búsqueda y te avisamos cuando entre uno.</p>
          <Link href="/#avisame" className="btn-naranja mt-5">Avisadme por WhatsApp</Link>
        </div>
      )}
    </>
  );
}
