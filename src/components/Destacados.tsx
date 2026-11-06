"use client";

import { useInmuebles } from "@/lib/useInmuebles";
import TarjetaInmueble from "./TarjetaInmueble";

export default function Destacados() {
  const { inmuebles, cargando } = useInmuebles();
  const lista = [...inmuebles.filter((i) => i.estado === "disponible"), ...inmuebles.filter((i) => i.estado !== "disponible")].slice(0, 6);
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cargando
        ? Array.from({ length: 3 }).map((_, k) => <div key={k} className="h-96 animate-pulse rounded-3xl bg-azul" />)
        : lista.map((i, n) => <TarjetaInmueble key={i.id} i={i} indice={n} />)}
    </div>
  );
}
