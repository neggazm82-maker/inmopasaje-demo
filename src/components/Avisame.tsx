"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zonasLinares } from "@/data/zonas";
import { enviarFormulario } from "@/lib/formularios";
import { cn, miles } from "@/lib/utils";
import { IconoCampana, IconoWhatsApp } from "./Iconos";
import InfoProteccionDatos from "./InfoProteccionDatos";
import Reveal from "./Reveal";

const Chip = ({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} aria-pressed={activo}
    className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1 transition", activo ? "bg-tinta text-white ring-tinta" : "bg-white text-tinta ring-azul-medio hover:bg-azul")}>
    {children}
  </button>
);

export default function Avisame() {
  const [op, setOp] = useState("Comprar");
  const [tipo, setTipo] = useState("Piso");
  const [zona, setZona] = useState("Cualquier zona");
  const [hab, setHab] = useState("3");
  const [max, setMax] = useState(80000);
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | "vista" | "error">("");

  const alquiler = op === "Alquilar";
  const rango = alquiler ? { min: 200, max: 2000, paso: 50 } : { min: 20000, max: 400000, paso: 5000 };
  const vivienda = tipo === "Piso" || tipo === "Casa";
  const frase = `${tipo.toLowerCase()}${vivienda ? ` de ${hab}${hab.endsWith("+") ? "" : ""} habitaciones` : ""} ${zona === "Cualquier zona" ? "en Linares" : `en ${zona}`} para ${alquiler ? "alquilar" : "comprar"}, hasta ${miles(max)} €${alquiler ? "/mes" : ""}`;
  const valido = nombre.trim() && /^[\d\s+]{9,}$/.test(tel.trim()) && acepto;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valido) return;
    setEstado("enviando");
    const r = await enviarFormulario("avisame", {
      operacion: op, tipo, zona, habitaciones: vivienda ? hab : "-", precioMaximo: String(max), nombre, telefono: tel,
      resumen: `🔔 AVÍSAME: ${nombre} (${tel}) busca ${frase}.`,
    });
    setEstado(r.ok ? (r.vistaPrevia ? "vista" : "ok") : "error");
  };

  return (
    <section id="avisame" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-azul to-white py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-naranja/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <motion.div
            className="grid h-16 w-16 place-items-center rounded-2xl bg-naranja text-tinta shadow-lg shadow-naranja/30"
            animate={{ rotate: [0, -14, 12, -8, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
          >
            <IconoCampana className="h-8 w-8" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
            ¿No encuentras lo que buscas? <span className="text-naranja-texto">Avísame por WhatsApp</span>
          </h2>
          <p className="mt-4 text-lg text-tinta-suave">
            Dinos qué buscas y te escribimos en cuanto entre un inmueble así. Sin tener que mirar la web cada día.
          </p>
          <ul className="mt-6 space-y-2 text-tinta">
            <li>✓ Gratis y sin compromiso</li>
            <li>✓ Solo te avisamos si encaja con lo que pides</li>
            <li>✓ Puedes darte de baja cuando quieras</li>
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-[2rem] bg-white p-5 shadow-2xl shadow-tinta/10 ring-1 ring-azul sm:p-8">
            <AnimatePresence mode="wait">
              {estado === "ok" || estado === "vista" ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                    className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#25D366] text-[#0b3d1f]">
                    <IconoWhatsApp className="h-10 w-10" />
                  </motion.div>
                  <h3 className="mt-5 text-2xl font-bold">¡Hecho, {nombre.split(" ")[0]}!</h3>
                  <p className="mt-2 text-tinta-suave">Te escribiremos al <strong className="text-tinta">{tel}</strong> cuando tengamos un {frase}.</p>
                  {estado === "vista" && <p className="mx-auto mt-4 max-w-sm rounded-xl bg-azul p-3 text-xs">Vista previa: el aviso por email funcionará cuando la web esté publicada en Netlify.</p>}
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={enviar} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="flex flex-wrap gap-2">{["Comprar", "Alquilar"].map((o) => <Chip key={o} activo={op === o} onClick={() => { setOp(o); setMax(o === "Alquilar" ? 500 : 80000); }}>{o}</Chip>)}</div>
                  <div className="flex flex-wrap gap-2">{["Piso", "Casa", "Local", "Cochera", "Solar"].map((t) => <Chip key={t} activo={tipo === t} onClick={() => setTipo(t)}>{t}</Chip>)}</div>
                  {vivienda && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">Habitaciones (mínimo)</p>
                      <div className="flex flex-wrap gap-2">{["1", "2", "3", "4+"].map((h) => <Chip key={h} activo={hab === h} onClick={() => setHab(h)}>{h}</Chip>)}</div>
                    </div>
                  )}
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">Zona</span>
                    <select className="campo" value={zona} onChange={(e) => setZona(e.target.value)}>
                      <option>Cualquier zona</option>
                      {zonasLinares.map((z) => <option key={z.nombre}>{z.nombre}</option>)}
                    </select>
                  </label>
                  <div>
                    <p className="mb-2 flex justify-between text-sm font-semibold"><span>Precio máximo</span><span className="text-naranja-texto">{miles(max)} €{alquiler ? "/mes" : ""}</span></p>
                    <input type="range" min={rango.min} max={rango.max} step={rango.paso} value={max} onChange={(e) => setMax(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[#F28C28]" aria-label="Precio máximo"
                      style={{ background: `linear-gradient(to right,#F28C28 ${((max - rango.min) / (rango.max - rango.min)) * 100}%,#A9CCEB 0)` }} />
                  </div>
                  <p className="rounded-2xl bg-azul p-4 text-sm">Buscas: <strong>{frase}</strong></p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="campo" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" aria-label="Tu nombre" />
                    <input className="campo" placeholder="Tu WhatsApp" type="tel" inputMode="tel" value={tel} onChange={(e) => setTel(e.target.value)} autoComplete="tel" aria-label="Tu teléfono de WhatsApp" />
                  </div>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} className="mt-1 h-5 w-5 accent-[#1F3A5F]" />
                    <span>Acepto que me avisen por WhatsApp de inmuebles que encajen con mi búsqueda.</span>
                  </label>
                  <InfoProteccionDatos finalidad="Avisarte de inmuebles que encajen con lo que buscas." />
                  {estado === "error" && <p className="text-sm font-semibold">No se ha podido enviar. Llámanos al 617 365 204.</p>}
                  <button type="submit" disabled={!valido || estado === "enviando"} className="btn-naranja w-full disabled:cursor-not-allowed disabled:opacity-40">
                    <IconoWhatsApp className="h-5 w-5" /> {estado === "enviando" ? "Guardando…" : "Avisadme por WhatsApp"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
