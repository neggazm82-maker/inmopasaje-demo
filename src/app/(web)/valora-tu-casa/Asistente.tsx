"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { zonasLinares } from "@/data/zonas";
import { whatsappUrl } from "@/data/empresa";
import { comprimirFoto, enviarFormulario } from "@/lib/formularios";
import { cn } from "@/lib/utils";
import CasaAnimada from "@/components/CasaAnimada";
import InfoProteccionDatos from "@/components/InfoProteccionDatos";
import {
  IconoCamara, IconoCasa, IconoCerrar, IconoCoche, IconoDer, IconoEdificio, IconoIzq, IconoSolar, IconoTienda, IconoWhatsApp,
} from "@/components/Iconos";

const MapaZonas = dynamic(() => import("./MapaZonas"), { ssr: false, loading: () => <div className="h-64 animate-pulse bg-azul sm:h-72" /> });

const tipos = [
  { id: "Piso", icono: IconoEdificio },
  { id: "Casa", icono: IconoCasa },
  { id: "Local", icono: IconoTienda },
  { id: "Cochera", icono: IconoCoche },
  { id: "Solar", icono: IconoSolar },
];
const pasos = ["Tipo", "Zona", "Detalles", "Fotos", "Contacto"];

type Datos = {
  tipo: string; zona: string; metros: number; habitaciones: string; banos: string; planta: string;
  ascensor: string; terraza: string; garaje: string; estado: string; direccion: string;
  operacion: string; nombre: string; telefono: string; email: string; comentarios: string; acepto: boolean;
};

const inicial: Datos = {
  tipo: "", zona: "", metros: 90, habitaciones: "3", banos: "1", planta: "", ascensor: "", terraza: "", garaje: "",
  estado: "", direccion: "", operacion: "", nombre: "", telefono: "", email: "", comentarios: "", acepto: false,
};

function Opciones({ valor, set, opciones, nombre }: { valor: string; set: (v: string) => void; opciones: string[]; nombre: string }) {
  return (
    <div role="radiogroup" aria-label={nombre} className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={valor === o} onClick={() => set(o)}
          className={cn("min-w-12 rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 transition",
            valor === o ? "bg-tinta text-white ring-tinta" : "bg-white text-tinta ring-azul-medio hover:bg-azul")}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Fila({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-tinta">{titulo}</p>
      {children}
    </div>
  );
}

export default function Asistente() {
  const [paso, setPaso] = useState(0);
  const [dir, setDir] = useState(1);
  const [d, setD] = useState<Datos>(inicial);
  const [fotos, setFotos] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<"" | "ok" | "vista" | "error">("");

  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => setD((x) => ({ ...x, [k]: v }));
  const ir = (n: number) => { setDir(n > paso ? 1 : -1); setPaso(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const vivienda = d.tipo === "Piso" || d.tipo === "Casa";
  const conPlanta = d.tipo === "Piso" || d.tipo === "Local";

  const puede = [
    !!d.tipo,
    !!d.zona,
    d.metros > 0,
    true,
    !!d.nombre.trim() && /^[\d\s+]{9,}$/.test(d.telefono.trim()) && !!d.operacion && d.acepto,
  ][paso];

  const resumen = useMemo(() => {
    const l = [
      `🏠 NUEVA SOLICITUD DE VALORACIÓN`,
      `Quiere: ${d.operacion || "-"}`,
      `Tipo: ${d.tipo} · Zona: ${d.zona}`,
      `Superficie: ${d.metros} m²`,
      vivienda ? `Habitaciones: ${d.habitaciones} · Baños: ${d.banos}` : "",
      conPlanta && d.planta ? `Planta: ${d.planta}` : "",
      d.ascensor ? `Ascensor: ${d.ascensor}` : "",
      d.terraza ? `Terraza: ${d.terraza}` : "",
      d.garaje ? `Garaje: ${d.garaje}` : "",
      d.estado ? `Estado: ${d.estado}` : "",
      d.direccion ? `Dirección: ${d.direccion}` : "",
      `Fotos adjuntas: ${fotos.length}`,
      `👤 ${d.nombre} · Tel. ${d.telefono}${d.email ? ` · ${d.email}` : ""}`,
      d.comentarios ? `Comentarios: ${d.comentarios}` : "",
    ];
    return l.filter(Boolean).join("\n");
  }, [d, fotos.length, vivienda, conPlanta]);

  const anadirFotos = async (lista: FileList | null) => {
    if (!lista) return;
    const nuevas = await Promise.all(Array.from(lista).filter((f) => f.type.startsWith("image/")).slice(0, 4 - fotos.length).map(comprimirFoto));
    setFotos((f) => [...f, ...nuevas].slice(0, 4));
  };

  const enviar = async () => {
    setEnviando(true);
    const { acepto, ...campos } = d;
    void acepto;
    const r = await enviarFormulario("valoracion", { ...Object.fromEntries(Object.entries(campos).map(([k, v]) => [k, String(v)])), resumen }, fotos);
    setEnviando(false);
    setEstado(r.ok ? (r.vistaPrevia ? "vista" : "ok") : "error");
  };

  if (estado === "ok" || estado === "vista") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] bg-white p-8 text-center shadow-2xl shadow-tinta/15 ring-1 ring-azul sm:p-12">
        <CasaAnimada />
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.2 }} className="mt-4 text-3xl font-bold sm:text-4xl">
          ¡Gracias, {d.nombre.split(" ")[0]}!
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.4 }} className="mx-auto mt-3 max-w-md text-lg text-tinta">
          Un experto de El Pasaje te llamará en <span className="font-bold text-naranja-texto">menos de 24 horas</span> con la valoración.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.7 }} className="mt-8 space-y-3">
          <a href={whatsappUrl(resumen)} target="_blank" rel="noopener noreferrer" className="btn-naranja">
            <IconoWhatsApp className="h-5 w-5" /> Enviar también por WhatsApp
          </a>
          <p className="text-xs text-tinta-suave">Opcional: así nos llega también a nuestro WhatsApp con todos tus datos.</p>
          {estado === "vista" && (
            <p className="mx-auto max-w-md rounded-xl bg-azul p-3 text-xs text-tinta">
              Vista previa: el envío por email funcionará cuando la web esté publicada en Netlify.
            </p>
          )}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-tinta shadow-sm ring-1 ring-azul-medio">
          <span className="h-2 w-2 animate-pulse rounded-full bg-naranja" /> Gratis y sin compromiso
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          ¿Cuánto vale tu casa? <span className="text-naranja-texto">Valoración en 2 minutos</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-tinta-suave">Cuéntanos cómo es tu inmueble. Un experto de El Pasaje estudiará tu inmueble y te dará un precio real, no un cálculo automático.</p>
      </div>

      {/* Barra de progreso */}
      <ol className="mt-8 grid grid-cols-5 gap-2" aria-label="Pasos">
        {pasos.map((p, k) => (
          <li key={p} className="text-center">
            <div className="h-2 overflow-hidden rounded-full bg-white ring-1 ring-azul-medio">
              <motion.div className="h-full bg-naranja" initial={false} animate={{ width: k <= paso ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
            </div>
            <span className={cn("mt-1.5 hidden text-xs font-medium sm:block", k === paso ? "text-tinta" : "text-tinta-suave")}>{k + 1}. {p}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-center text-xs text-tinta-suave sm:hidden">Paso {paso + 1} de 5 · {pasos[paso]}</p>

      <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-tinta/10 ring-1 ring-azul">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={paso}
            custom={dir}
            initial={{ x: dir * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir * -60, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="p-5 sm:p-8"
          >
            {paso === 0 && (
              <>
                <h2 className="text-xl font-bold sm:text-2xl">¿Qué tipo de inmueble tienes?</h2>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {tipos.map((t, k) => (
                    <motion.button
                      key={t.id} type="button"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.06 }}
                      whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}
                      onClick={() => { set("tipo", t.id); setTimeout(() => ir(1), 250); }}
                      className={cn("flex flex-col items-center gap-3 rounded-2xl p-5 font-semibold ring-2 transition-colors",
                        d.tipo === t.id ? "bg-naranja text-tinta ring-naranja" : "bg-azul/60 text-tinta ring-transparent hover:ring-azul-medio",
                        k === 4 && "col-span-2 sm:col-span-1")}
                      aria-pressed={d.tipo === t.id}
                    >
                      <t.icono className="h-12 w-12" strokeWidth={1.4} />
                      {t.id}
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {paso === 1 && (
              <>
                <h2 className="text-xl font-bold sm:text-2xl">¿En qué zona de Linares está?</h2>
                <p className="mt-1 text-sm text-tinta-suave">Elige en la lista o toca un punto del mapa.</p>
                <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1.2fr]">
                  <div className="flex flex-col gap-2">
                    {[...zonasLinares.map((z) => z.nombre), "Otra zona / fuera de Linares"].map((z) => (
                      <button key={z} type="button" onClick={() => set("zona", z)} aria-pressed={d.zona === z}
                        className={cn("rounded-xl px-4 py-3 text-left text-sm font-semibold ring-1 transition",
                          d.zona === z ? "bg-naranja text-tinta ring-naranja" : "bg-white ring-azul-medio hover:bg-azul")}>
                        {z}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-hidden rounded-2xl ring-1 ring-azul-medio">
                    <MapaZonas elegida={d.zona} elegir={(z) => set("zona", z)} />
                  </div>
                </div>
              </>
            )}

            {paso === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold sm:text-2xl">Cuéntanos cómo es</h2>
                <Fila titulo="Superficie construida">
                  <div className="flex items-center gap-4">
                    <input type="range" min={10} max={600} step={5} value={d.metros} onChange={(e) => set("metros", Number(e.target.value))}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full accent-[#F28C28]"
                      style={{ background: `linear-gradient(to right,#F28C28 ${((d.metros - 10) / 590) * 100}%,#A9CCEB 0)` }} aria-label="Metros cuadrados" />
                    <span className="w-24 rounded-xl bg-azul px-3 py-2 text-center font-bold">{d.metros} m²</span>
                  </div>
                </Fila>
                {vivienda && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Fila titulo="Habitaciones"><Opciones nombre="Habitaciones" valor={d.habitaciones} set={(v) => set("habitaciones", v)} opciones={["1", "2", "3", "4", "5+"]} /></Fila>
                    <Fila titulo="Baños"><Opciones nombre="Baños" valor={d.banos} set={(v) => set("banos", v)} opciones={["1", "2", "3", "4+"]} /></Fila>
                  </div>
                )}
                {conPlanta && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Fila titulo="Planta"><Opciones nombre="Planta" valor={d.planta} set={(v) => set("planta", v)} opciones={["Bajo", "1ª", "2ª", "3ª", "4ª", "5ª+"]} /></Fila>
                    <Fila titulo="¿Tiene ascensor?"><Opciones nombre="Ascensor" valor={d.ascensor} set={(v) => set("ascensor", v)} opciones={["Sí", "No"]} /></Fila>
                  </div>
                )}
                {vivienda && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Fila titulo="¿Terraza?"><Opciones nombre="Terraza" valor={d.terraza} set={(v) => set("terraza", v)} opciones={["Sí", "No"]} /></Fila>
                    <Fila titulo="¿Garaje?"><Opciones nombre="Garaje" valor={d.garaje} set={(v) => set("garaje", v)} opciones={["Sí", "No"]} /></Fila>
                  </div>
                )}
                {d.tipo !== "Solar" && (
                  <Fila titulo="Estado">
                    <Opciones nombre="Estado" valor={d.estado} set={(v) => set("estado", v)} opciones={["Para reformar", "Buen estado", "Reformado"]} />
                  </Fila>
                )}
                <Fila titulo="Dirección (opcional)">
                  <input className="campo" value={d.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Calle y número" autoComplete="street-address" />
                </Fila>
              </div>
            )}

            {paso === 3 && (
              <>
                <h2 className="text-xl font-bold sm:text-2xl">¿Nos enseñas unas fotos? <span className="text-base font-medium text-tinta-suave">(opcional)</span></h2>
                <p className="mt-1 text-sm text-tinta-suave">Con fotos la valoración es más precisa. Hasta 4 fotos.</p>
                <label
                  className="mt-5 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-azul-medio bg-azul/40 p-8 text-center transition hover:bg-azul"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); anadirFotos(e.dataTransfer.files); }}
                >
                  <IconoCamara className="h-10 w-10 text-tinta" />
                  <span className="font-semibold">Toca para hacer o elegir fotos</span>
                  <span className="text-xs text-tinta-suave">{fotos.length}/4 fotos</span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => anadirFotos(e.target.files)} disabled={fotos.length >= 4} />
                </label>
                {fotos.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <AnimatePresence>
                      {fotos.map((f, k) => (
                        <motion.div key={f.name + k} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative aspect-square overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(f)} alt={`Foto ${k + 1}`} className="h-full w-full object-cover" />
                          <button type="button" onClick={() => setFotos((x) => x.filter((_, i) => i !== k))} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-tinta" aria-label={`Quitar foto ${k + 1}`}>
                            <IconoCerrar className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}

            {paso === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold sm:text-2xl">¿Cómo te llamamos?</h2>
                <Fila titulo="¿Quieres vender o alquilar?">
                  <Opciones nombre="Operación" valor={d.operacion} set={(v) => set("operacion", v)} opciones={["Vender", "Alquilar", "Aún no lo sé"]} />
                </Fila>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block"><span className="mb-1 block text-sm font-semibold">Nombre *</span>
                    <input className="campo" value={d.nombre} onChange={(e) => set("nombre", e.target.value)} autoComplete="name" required /></label>
                  <label className="block"><span className="mb-1 block text-sm font-semibold">Teléfono *</span>
                    <input className="campo" type="tel" inputMode="tel" value={d.telefono} onChange={(e) => set("telefono", e.target.value)} autoComplete="tel" placeholder="600 000 000" required /></label>
                </div>
                <label className="block"><span className="mb-1 block text-sm font-semibold">Email (opcional)</span>
                  <input className="campo" type="email" value={d.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></label>
                <label className="block"><span className="mb-1 block text-sm font-semibold">¿Algo más que debamos saber? (opcional)</span>
                  <textarea className="campo min-h-24" value={d.comentarios} onChange={(e) => set("comentarios", e.target.value)} placeholder="Mejor hora para llamarte, detalles del inmueble…" /></label>
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" checked={d.acepto} onChange={(e) => set("acepto", e.target.checked)} className="mt-1 h-5 w-5 accent-[#1F3A5F]" />
                  <span>He leído la información sobre protección de datos y acepto que me llaméis para darme la valoración.</span>
                </label>
                <InfoProteccionDatos finalidad="Valorar tu inmueble y contactarte para darte el resultado." />
                {estado === "error" && <p className="rounded-xl bg-azul p-3 text-sm font-semibold">No se ha podido enviar. Inténtalo de nuevo o llámanos al 617 365 204.</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 border-t border-azul bg-azul/30 p-4 sm:px-8">
          <button type="button" onClick={() => ir(paso - 1)} disabled={paso === 0}
            className="inline-flex items-center gap-1 rounded-full px-4 py-2.5 font-semibold text-tinta disabled:invisible">
            <IconoIzq className="h-5 w-5" /> Atrás
          </button>
          {paso < 4 ? (
            <button type="button" onClick={() => ir(paso + 1)} disabled={!puede} className="btn-naranja disabled:cursor-not-allowed disabled:opacity-40">
              {paso === 3 && fotos.length === 0 ? "Saltar" : "Siguiente"} <IconoDer className="h-5 w-5" />
            </button>
          ) : (
            <button type="button" onClick={enviar} disabled={!puede || enviando} className="btn-naranja disabled:cursor-not-allowed disabled:opacity-40">
              {enviando ? "Enviando…" : "Quiero mi valoración"}
            </button>
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-tinta-suave">No calculamos precios automáticos: te llamará una persona que conoce el mercado de Linares.</p>
    </div>
  );
}
