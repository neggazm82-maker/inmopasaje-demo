"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconoCerrar, IconoDer, IconoExpandir, IconoIzq } from "@/components/Iconos";
import { cn } from "@/lib/utils";

export default function Galeria({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [abierta, setAbierta] = useState(false);
  const [n, setN] = useState(0);
  const [dir, setDir] = useState(1);

  const ir = useCallback((d: number) => { setDir(d); setN((x) => (x + d + fotos.length) % fotos.length); }, [fotos.length]);
  const abrir = (k: number) => { setN(k); setAbierta(true); };

  useEffect(() => {
    if (!abierta) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierta(false);
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", tecla);
    return () => { window.removeEventListener("keydown", tecla); document.body.style.overflow = ""; };
  }, [abierta, ir]);

  return (
    <>
      {/* Mosaico */}
      <div className="grid h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[460px]">
        {fotos.slice(0, 5).map((f, k) => (
          <button
            key={f}
            onClick={() => abrir(k)}
            className={cn("group relative overflow-hidden bg-azul", k === 0 ? "col-span-4 row-span-2 sm:col-span-2" : "hidden sm:block")}
            aria-label={`Ver foto ${k + 1} de ${fotos.length} a pantalla completa`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f} alt={`${titulo}, foto ${k + 1}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading={k === 0 ? "eager" : "lazy"} />
            {k === 4 && fotos.length > 5 && (
              <span className="absolute inset-0 grid place-items-center bg-tinta/55 text-lg font-semibold text-white">+{fotos.length - 5} fotos</span>
            )}
          </button>
        ))}
      </div>
      <button onClick={() => abrir(0)} className="relative -mt-14 ml-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-tinta shadow-lg">
        <IconoExpandir className="h-4 w-4" /> Ver las {fotos.length} fotos
      </button>

      {/* Pantalla completa */}
      <AnimatePresence>
        {abierta && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-[#0d1b2e]/97"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            role="dialog" aria-modal="true" aria-label="Galería de fotos"
          >
            <div className="flex items-center justify-between p-4 text-white">
              <span className="text-sm font-medium">{n + 1} / {fotos.length}</span>
              <button onClick={() => setAbierta(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Cerrar galería">
                <IconoCerrar />
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir}>
                <motion.img
                  key={n}
                  src={fotos[n]}
                  alt={`${titulo}, foto ${n + 1}`}
                  custom={dir}
                  className="absolute inset-0 m-auto max-h-full max-w-full cursor-grab object-contain active:cursor-grabbing"
                  initial={{ x: dir * 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: dir * -300, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => { if (info.offset.x < -60) ir(1); else if (info.offset.x > 60) ir(-1); }}
                />
              </AnimatePresence>
              <button onClick={() => ir(-1)} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25" aria-label="Foto anterior"><IconoIzq /></button>
              <button onClick={() => ir(1)} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25" aria-label="Foto siguiente"><IconoDer /></button>
            </div>
            <div className="flex gap-2 overflow-x-auto p-4">
              {fotos.map((f, k) => (
                <button key={f} onClick={() => { setDir(k > n ? 1 : -1); setN(k); }} className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-lg transition", k === n ? "ring-2 ring-naranja" : "opacity-50 hover:opacity-100")} aria-label={`Ir a la foto ${k + 1}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
