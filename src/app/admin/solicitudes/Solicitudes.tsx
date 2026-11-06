"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Protegido from "@/components/admin/Protegido";
import Marco from "@/components/admin/Marco";
import { useAviso } from "@/components/admin/Aviso";
import { listarSolicitudes, marcarAtendida, verFotosSolicitud, type Solicitud, type TipoSolicitud } from "@/lib/datos";
import { cn } from "@/lib/utils";
import { IconoTelefono, IconoWhatsApp, IconoEmail } from "@/components/Iconos";

const pestañas: { id: TipoSolicitud; texto: string }[] = [
  { id: "valoracion", texto: "Valoraciones" },
  { id: "avisame", texto: "Avísame" },
  { id: "contacto", texto: "Contacto" },
];

// Qué campos se muestran (y en qué orden) en cada tipo de solicitud
const campos: Record<TipoSolicitud, [string, string][]> = {
  valoracion: [["operacion", "Quiere"], ["tipo", "Tipo"], ["zona", "Zona"], ["metros", "m²"], ["habitaciones", "Habitaciones"], ["banos", "Baños"], ["planta", "Planta"], ["ascensor", "Ascensor"], ["terraza", "Terraza"], ["garaje", "Garaje"], ["estado", "Estado"], ["direccion", "Dirección"], ["comentarios", "Comentarios"]],
  avisame: [["operacion", "Quiere"], ["tipo", "Tipo"], ["zona", "Zona"], ["habitaciones", "Habitaciones mín."], ["precioMaximo", "Precio máx. (€)"]],
  contacto: [["mensaje", "Mensaje"]],
};

const telefonoLimpio = (t = "") => t.replace(/[^\d+]/g, "");
const paraWhatsApp = (t = "") => { const d = t.replace(/\D/g, ""); return d.length === 9 ? `34${d}` : d; };
const fecha = (iso: string) => new Date(iso).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function Solicitudes() {
  return <Protegido>{(u) => <Contenido email={u.email} />}</Protegido>;
}

function Contenido({ email }: { email: string }) {
  const [lista, setLista] = useState<Solicitud[] | null>(null);
  const [tab, setTab] = useState<TipoSolicitud>("valoracion");
  const [verAtendidas, setVerAtendidas] = useState(false);
  const { avisar, nodo } = useAviso();

  const cargar = useCallback(() => listarSolicitudes().then(setLista).catch((e) => avisar(e.message, true)), [avisar]);
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("tab") as TipoSolicitud | null;
    if (t && pestañas.some((p) => p.id === t)) setTab(t);
    cargar();
  }, [cargar]);

  const pendientes = (lista ?? []).filter((s) => !s.atendida).length;
  const deTab = (lista ?? []).filter((s) => s.tipo === tab);
  const visibles = deTab.filter((s) => verAtendidas || !s.atendida);

  const atender = async (s: Solicitud) => {
    setLista((l) => l?.map((x) => (x.id === s.id ? { ...x, atendida: !s.atendida } : x)) ?? null);
    try { await marcarAtendida(s.id, !s.atendida); avisar(s.atendida ? "Vuelve a estar pendiente" : "Marcada como atendida"); }
    catch (e) { avisar((e as Error).message, true); cargar(); }
  };

  const descargar = async () => {
    const { default: writeExcelFile } = await import("write-excel-file/browser");
    const cols: [string, string][] = [["nombre", "Nombre"], ["telefono", "Teléfono"], ["email", "Email"], ...campos[tab]];
    const cabecera = ["Fecha", ...cols.map(([, t]) => t), "Fotos", "Atendida"].map((v) => ({ value: v, fontWeight: "bold" as const, backgroundColor: "#DCEBFA" }));
    const filas = deTab.map((s) => [
      { value: new Date(s.creado), type: Date, format: "dd/mm/yyyy hh:mm" },
      ...cols.map(([k]) => ({ value: s.datos[k] ?? "" })),
      { value: s.fotos.length },
      { value: s.atendida ? "Sí" : "No" },
    ]);
    const hoy = new Date().toISOString().slice(0, 10);
    await writeExcelFile([cabecera, ...filas] as never, { columns: [{ width: 18 }, ...cols.map(() => ({ width: 22 })), { width: 8 }, { width: 10 }] } as never)
      .toFile(`solicitudes-${tab}-${hoy}.xlsx`);
  };

  return (
    <Marco titulo="Solicitudes" email={email} pendientes={pendientes}>
      <div className="grid grid-cols-3 gap-1 rounded-full bg-white p-1 ring-1 ring-azul" role="tablist">
        {pestañas.map((p) => {
          const n = (lista ?? []).filter((s) => s.tipo === p.id && !s.atendida).length;
          return (
            <button key={p.id} role="tab" aria-selected={tab === p.id} onClick={() => setTab(p.id)}
              className={cn("relative rounded-full px-1 py-2.5 text-[13px] font-semibold sm:text-sm", tab === p.id ? "text-white" : "text-tinta")}>
              {tab === p.id && <motion.span layoutId="tab-sol" className="absolute inset-0 -z-0 rounded-full bg-tinta" />}
              <span className="relative">{p.texto}{n > 0 && <span className="ml-1 rounded-full bg-naranja px-1.5 text-[11px] text-tinta">{n}</span>}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={verAtendidas} onChange={(e) => setVerAtendidas(e.target.checked)} className="h-5 w-5 accent-[#1F3A5F]" />
          Ver también las atendidas
        </label>
        <button onClick={descargar} disabled={!deTab.length} className="rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-azul-medio disabled:opacity-40">
          ⬇ Descargar Excel
        </button>
      </div>

      {lista === null ? (
        <div className="mt-4 space-y-3">{[0, 1].map((k) => <div key={k} className="h-48 animate-pulse rounded-3xl bg-white" />)}</div>
      ) : (
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          <AnimatePresence initial={false}>
            {visibles.map((s) => <TarjetaSolicitud key={s.id} s={s} atender={() => atender(s)} />)}
          </AnimatePresence>
          {visibles.length === 0 && (
            <li className="rounded-3xl bg-white p-8 text-center text-tinta-suave lg:col-span-2">
              {deTab.length ? "¡Todo atendido! 🎉" : "Todavía no hay solicitudes de este tipo."}
            </li>
          )}
        </ul>
      )}
      {nodo}
    </Marco>
  );
}

function TarjetaSolicitud({ s, atender }: { s: Solicitud; atender: () => void }) {
  const [fotos, setFotos] = useState<string[]>([]);
  useEffect(() => { verFotosSolicitud(s).then(setFotos).catch(() => {}); }, [s]);
  const d = s.datos;
  const saludo = s.tipo === "valoracion"
    ? `Hola ${d.nombre ?? ""}, te escribo de Inmobiliaria El Pasaje por la valoración de tu ${(d.tipo ?? "inmueble").toLowerCase()} en ${d.zona ?? "Linares"}.`
    : s.tipo === "avisame"
      ? `Hola ${d.nombre ?? ""}, te escribo de Inmobiliaria El Pasaje: tenemos un inmueble que puede encajar con lo que buscas.`
      : `Hola ${d.nombre ?? ""}, te escribo de Inmobiliaria El Pasaje por tu mensaje en la web.`;
  const datos = campos[s.tipo].filter(([k]) => d[k] && d[k] !== "-");

  return (
    <motion.li layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}
      className={cn("overflow-hidden rounded-3xl bg-white shadow-sm ring-1", s.atendida ? "ring-azul opacity-70" : "ring-azul-medio")}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{d.nombre || "Sin nombre"}</p>
            <p className="text-xs text-tinta-suave">{fecha(s.creado)}</p>
          </div>
          {s.atendida ? <span className="shrink-0 rounded-full bg-azul px-2.5 py-1 text-xs font-semibold">✓ Atendida</span>
            : <span className="shrink-0 rounded-full bg-naranja px-2.5 py-1 text-xs font-bold">Nueva</span>}
        </div>
        <div className="mt-2 space-y-0.5 text-sm">
          {d.telefono && <p className="font-semibold">{d.telefono}</p>}
          {d.email && <p className="break-all text-tinta-suave">{d.email}</p>}
        </div>
        {datos.length > 0 && (
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-2xl bg-azul/50 p-3 text-sm">
            {datos.map(([k, t]) => (
              <div key={k} className={k === "comentarios" || k === "mensaje" || k === "direccion" ? "col-span-2" : ""}>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-tinta-suave">{t}</dt>
                <dd className="whitespace-pre-line font-medium">{k === "precioMaximo" ? Number(d[k]).toLocaleString("es-ES") : d[k]}</dd>
              </div>
            ))}
          </dl>
        )}
        {fotos.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {fotos.map((f, k) => (
              <a key={k} href={f} target="_blank" rel="noopener noreferrer" className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f} alt={`Foto ${k + 1} del inmueble`} className="h-20 w-24 rounded-xl object-cover" loading="lazy" />
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-px border-t border-azul bg-azul text-sm font-semibold">
        {d.telefono ? (
          <>
            <a href={`tel:${telefonoLimpio(d.telefono)}`} className="flex items-center justify-center gap-1.5 bg-white py-3 hover:bg-azul/40"><IconoTelefono className="h-4 w-4" /> Llamar</a>
            <a href={`https://wa.me/${paraWhatsApp(d.telefono)}?text=${encodeURIComponent(saludo)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-white py-3 hover:bg-azul/40"><IconoWhatsApp className="h-4 w-4 text-[#128C4A]" /> WhatsApp</a>
          </>
        ) : d.email ? (
          <a href={`mailto:${d.email}`} className="col-span-2 flex items-center justify-center gap-1.5 bg-white py-3"><IconoEmail className="h-4 w-4" /> Responder por email</a>
        ) : <span className="col-span-2 bg-white" />}
        <button onClick={atender} className={cn("py-3", s.atendida ? "bg-white text-tinta-suave" : "bg-tinta text-white")}>
          {s.atendida ? "Desmarcar" : "Marcar como atendida"}
        </button>
      </div>
    </motion.li>
  );
}
