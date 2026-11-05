"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { inmuebles } from "@/data/inmuebles";
import { IconoLupa } from "./Iconos";
import { cn, miles, nombreCategoria } from "@/lib/utils";

const zonas = Array.from(new Set(inmuebles.map((i) => i.zona))).sort();
const preciosVenta = [30000, 60000, 80000, 100000, 130000, 150000, 200000, 300000];
const preciosAlquiler = [300, 500, 700, 1000, 1500];

export default function Buscador({ compacto = false }: { compacto?: boolean }) {
  const router = useRouter();
  const [op, setOp] = useState<"venta" | "alquiler">("venta");
  const [tipo, setTipo] = useState("");
  const [zona, setZona] = useState("");
  const [max, setMax] = useState("");

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams({ op });
    if (tipo) p.set("tipo", tipo);
    if (zona) p.set("zona", zona);
    if (max) p.set("max", max);
    router.push(`/inmuebles/?${p.toString()}`);
  };

  const precios = op === "venta" ? preciosVenta : preciosAlquiler;

  return (
    <form
      onSubmit={buscar}
      className={cn("w-full rounded-3xl bg-white/95 p-3 shadow-2xl shadow-tinta/25 backdrop-blur", compacto ? "" : "sm:p-4")}
      role="search"
      aria-label="Buscar inmuebles"
    >
      <div className="relative mb-3 inline-grid grid-cols-2 rounded-full bg-azul p-1">
        {(["venta", "alquiler"] as const).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => { setOp(o); setMax(""); }}
            className={cn("relative z-10 rounded-full px-6 py-2 text-sm font-semibold transition-colors", op === o ? "text-tinta" : "text-tinta-suave")}
            aria-pressed={op === o}
          >
            {op === o && (
              <motion.span layoutId="pestana-op" className="absolute inset-0 -z-10 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            {o === "venta" ? "Comprar" : "Alquilar"}
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="sr-only">Tipo de inmueble</span>
          <select className="campo appearance-none" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Tipo de inmueble</option>
            {Object.entries(nombreCategoria).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Zona</span>
          <select className="campo appearance-none" value={zona} onChange={(e) => setZona(e.target.value)}>
            <option value="">Todas las zonas</option>
            {zonas.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Precio máximo</span>
          <select className="campo appearance-none" value={max} onChange={(e) => setMax(e.target.value)}>
            <option value="">Precio máximo</option>
            {precios.map((p) => (
              <option key={p} value={p}>Hasta {miles(p)} €{op === "alquiler" ? "/mes" : ""}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-naranja sm:col-span-2 lg:col-span-1 !py-3.5">
          <IconoLupa className="h-5 w-5" /> Buscar
        </button>
      </div>
    </form>
  );
}
