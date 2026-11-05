"use client";

import { useState } from "react";
import { animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { euros } from "@/lib/utils";
import { IconoCalculadora } from "@/components/Iconos";

function Deslizador({ etiqueta, valor, set, min, max, paso, formato }: {
  etiqueta: string; valor: number; set: (n: number) => void; min: number; max: number; paso: number; formato: (n: number) => string;
}) {
  const pct = ((valor - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex justify-between text-sm"><span className="text-tinta-suave">{etiqueta}</span><span className="font-semibold">{formato(valor)}</span></span>
      <input
        type="range" min={min} max={max} step={paso} value={valor}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#F28C28]"
        style={{ background: `linear-gradient(to right, #F28C28 ${pct}%, #A9CCEB ${pct}%)` }}
      />
    </label>
  );
}

export default function Hipoteca({ precio }: { precio: number }) {
  const [entrada, setEntrada] = useState(20);
  const [anos, setAnos] = useState(30);
  const [interes, setInteres] = useState(3);

  const prestamo = precio * (1 - entrada / 100);
  const r = interes / 100 / 12;
  const nCuotas = anos * 12;
  const cuota = r === 0 ? prestamo / nCuotas : (prestamo * r) / (1 - Math.pow(1 + r, -nCuotas));

  const ref = useRef<HTMLSpanElement>(null);
  const previo = useRef(cuota);
  useEffect(() => {
    const c = animate(previo.current, cuota, {
      duration: 0.5,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = euros(Math.round(v)); },
    });
    previo.current = cuota;
    return () => c.stop();
  }, [cuota]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-azul to-white p-6 ring-1 ring-azul-medio sm:p-8">
      <h2 className="flex items-center gap-2 text-xl font-bold"><IconoCalculadora className="h-6 w-6" /> Calcula tu hipoteca</h2>
      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_240px] md:items-center">
        <div className="space-y-6">
          <Deslizador etiqueta="Ahorros que aportas" valor={entrada} set={setEntrada} min={0} max={80} paso={5} formato={(n) => `${n}% (${euros(precio * n / 100)})`} />
          <Deslizador etiqueta="Plazo" valor={anos} set={setAnos} min={5} max={40} paso={1} formato={(n) => `${n} años`} />
          <Deslizador etiqueta="Tipo de interés (TIN)" valor={interes} set={setInteres} min={0.5} max={6} paso={0.1} formato={(n) => `${n.toFixed(1).replace(".", ",")} %`} />
        </div>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-azul">
          <p className="text-sm text-tinta-suave">Cuota mensual aproximada</p>
          <p className="mt-1 text-4xl font-bold text-naranja-texto"><span ref={ref}>{euros(Math.round(cuota))}</span></p>
          <p className="mt-2 text-xs text-tinta-suave">Préstamo: {euros(Math.round(prestamo))}</p>
        </div>
      </div>
      <p className="mt-6 text-xs text-tinta-suave">Cálculo orientativo sin gastos ni impuestos. No es una oferta de financiación: el banco fijará las condiciones reales.</p>
    </div>
  );
}
