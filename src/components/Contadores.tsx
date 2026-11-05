"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { empresa } from "@/data/empresa";
import { miles } from "@/lib/utils";
import { IconoCasa, IconoReloj, IconoLlave } from "./Iconos";
import Reveal from "./Reveal";

function Numero({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visto) return;
    const c = animate(0, valor, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [visto, valor]);
  return <span ref={ref}>{miles(n)}</span>;
}

export default function Contadores() {
  const datos = [
    { icono: IconoCasa, valor: empresa.inmueblesDisponibles, texto: "inmuebles disponibles" },
    { icono: IconoReloj, valor: empresa.anosEnLinares, texto: "años en Linares", nota: `desde ${empresa.fundacion}` },
    { icono: IconoLlave, valor: empresa.familiasAtendidas, texto: "familias atendidas" },
  ];
  return (
    <section className="relative bg-azul py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
        {datos.map((d, i) => (
          <Reveal key={d.texto} delay={i * 0.12} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-col sm:text-center">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-azul text-tinta ring-1 ring-azul-medio">
              <d.icono className="h-7 w-7" />
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight text-naranja-texto sm:text-5xl">
                {d.valor == null ? <span className="text-2xl text-tinta-suave">[PENDIENTE]</span> : <Numero valor={d.valor} />}
              </p>
              <p className="mt-1 font-medium text-tinta">{d.texto}</p>
              {d.nota && d.valor != null && <p className="text-xs text-tinta-suave">{d.nota}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
