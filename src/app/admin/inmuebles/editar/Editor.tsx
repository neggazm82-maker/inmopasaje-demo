"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import Protegido from "@/components/admin/Protegido";
import Marco from "@/components/admin/Marco";
import { useAviso } from "@/components/admin/Aviso";
import { usePendientes } from "@/components/admin/usePendientes";
import { zonasLinares } from "@/data/zonas";
import { empresa } from "@/data/empresa";
import type { Categoria } from "@/data/inmuebles";
import { guardarInmueble, listarInmuebles, siguienteReferencia, subirFotoInmueble, type InmuebleGuardado } from "@/lib/datos";
import { cn, euros, miles } from "@/lib/utils";
import { IconoCamara, IconoCerrar } from "@/components/Iconos";

const tipos: [string, Categoria][] = [
  ["Piso", "piso"], ["Dúplex", "piso"], ["Ático", "piso"], ["Casa", "casa"], ["Chalet", "casa"], ["Adosado", "casa"],
  ["Finca rústica", "casa"], ["Local comercial", "local"], ["Nave industrial", "local"], ["Cochera", "cochera"], ["Solar", "solar"],
];
const extrasHabituales = [
  "Ascensor", "Terraza", "Balcón", "Garaje incluido", "Trastero", "Piscina comunitaria", "Aire acondicionado", "Calefacción",
  "Armarios empotrados", "Amueblado", "Patio", "Exterior", "Luminoso", "Acceso sin barreras (PMR)",
];
const estados = ["", "Para reformar", "Buen estado", "Semireformado", "Reformado", "A estrenar"];

type Foto = { id: string; url: string; subiendo?: boolean };

type Form = {
  ref: string; operacion: "venta" | "alquiler"; tipo: string; titulo: string; zona: string;
  precio: string; precioAnterior: string; m2: string; habitaciones: number; banos: number; planta: string;
  conservacion: string; extras: string[]; descripcion: string; nuevo: boolean;
};

const vacio: Form = {
  ref: "", operacion: "venta", tipo: "Piso", titulo: "", zona: "Centro Ciudad", precio: "", precioAnterior: "",
  m2: "", habitaciones: 3, banos: 1, planta: "", conservacion: "", extras: [], descripcion: "", nuevo: true,
};

export default function Editor() {
  return <Protegido>{(u) => <Contenido email={u.email} />}</Protegido>;
}

function Contenido({ email }: { email: string }) {
  const router = useRouter();
  const { avisar, nodo } = useAviso();
  const pendientes = usePendientes();
  const [original, setOriginal] = useState<InmuebleGuardado | null>(null);
  const [f, setF] = useState<Form | null>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [extraNuevo, setExtraNuevo] = useState("");
  const [errores, setErrores] = useState<string[]>([]);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    (async () => {
      if (!id) { setF({ ...vacio, ref: await siguienteReferencia() }); return; }
      const i = (await listarInmuebles({ incluirOcultos: true })).find((x) => x.id === id);
      if (!i) { avisar("No se ha encontrado ese inmueble", true); router.replace("/admin/inmuebles/"); return; }
      setOriginal(i);
      setFotos(i.fotos.map((url, k) => ({ id: `${k}-${url.slice(-24)}`, url })));
      setF({
        ref: i.ref, operacion: i.operacion, tipo: i.tipo, titulo: i.titulo, zona: i.zona, precio: String(i.precio),
        precioAnterior: i.precioAnterior ? String(i.precioAnterior) : "", m2: i.m2Construidos ? String(i.m2Construidos) : "",
        habitaciones: i.habitaciones ?? 0, banos: i.banos ?? 0, planta: i.planta != null ? String(i.planta) : "",
        conservacion: i.conservacion ?? "", extras: i.caracteristicas, descripcion: i.descripcion.join("\n\n"), nuevo: !!i.nuevo,
      });
    })().catch((e) => avisar(e.message, true));
  }, [avisar, router]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => (x ? { ...x, [k]: v } : x));
  const categoria = tipos.find(([t]) => t === f?.tipo)?.[1] ?? "piso";
  const vivienda = categoria === "piso" || categoria === "casa";
  const tituloSugerido = useMemo(() => {
    if (!f) return "";
    const hab = vivienda && f.habitaciones ? ` de ${f.habitaciones} ${f.habitaciones === 1 ? "dormitorio" : "dormitorios"}` : "";
    return `${f.tipo}${hab} en ${f.zona}`;
  }, [f, vivienda]);

  const anadirFotos = async (lista: FileList | null) => {
    if (!lista?.length) return;
    const nuevas = Array.from(lista).filter((x) => x.type.startsWith("image/"));
    const temporales = nuevas.map((file) => ({ id: `t-${Math.random().toString(36).slice(2)}`, url: URL.createObjectURL(file), subiendo: true, file }));
    setFotos((x) => [...x, ...temporales.map(({ id, url, subiendo }) => ({ id, url, subiendo }))]);
    for (const t of temporales) {
      try {
        const url = await subirFotoInmueble(t.file);
        setFotos((x) => x.map((p) => (p.id === t.id ? { id: t.id, url } : p)));
      } catch (e) {
        setFotos((x) => x.filter((p) => p.id !== t.id));
        avisar(`No se ha podido subir una foto: ${(e as Error).message}`, true);
      }
    }
  };

  const guardar = async () => {
    if (!f) return;
    const precio = Number(f.precio.replace(/\D/g, ""));
    const anterior = Number(f.precioAnterior.replace(/\D/g, "")) || undefined;
    const e: string[] = [];
    if (!f.ref.trim()) e.push("Pon una referencia.");
    if (!precio) e.push("Pon el precio.");
    if (anterior && anterior <= precio) e.push("El precio anterior debe ser mayor que el actual (si no hay rebaja, déjalo vacío).");
    if (fotos.some((p) => p.subiendo)) e.push("Espera a que terminen de subirse las fotos.");
    const otros = await listarInmuebles({ incluirOcultos: true });
    if (otros.some((x) => x.ref === f.ref.trim() && x.id !== original?.id)) e.push(`Ya existe otro inmueble con la ref. ${f.ref}.`);
    setErrores(e);
    if (e.length) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    const zona = zonasLinares.find((z) => z.nombre === f.zona);
    const mismaZona = original && original.zona === f.zona;
    const i: InmuebleGuardado = {
      ...(original ?? {}),
      id: original?.id ?? `nuevo-${Date.now()}`,
      estado: original?.estado ?? "disponible",
      oculto: original?.oculto ?? false,
      ref: f.ref.trim(),
      codigo: original?.codigo ?? 0,
      operacion: f.operacion,
      tipo: f.tipo,
      categoria,
      titulo: f.titulo.trim() || tituloSugerido,
      zona: f.zona,
      precio,
      precioAnterior: anterior,
      nuevo: f.nuevo,
      m2Construidos: Number(f.m2.replace(",", ".")) || undefined,
      habitaciones: vivienda ? f.habitaciones : undefined,
      banos: vivienda || categoria === "local" ? f.banos || undefined : undefined,
      planta: f.planta === "" ? undefined : Number(f.planta),
      conservacion: f.conservacion || undefined,
      caracteristicas: f.extras,
      descripcion: f.descripcion.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean),
      fotos: fotos.map((p) => p.url),
      lat: mismaZona ? original!.lat : zona?.lat ?? empresa.oficina.lat,
      lng: mismaZona ? original!.lng : zona?.lng ?? empresa.oficina.lng,
      fechaAlta: original?.fechaAlta ?? new Date().toISOString().slice(0, 10),
      urlOriginal: original?.urlOriginal ?? "",
    };
    setGuardando(true);
    try {
      const g = await guardarInmueble(i);
      avisar(original ? "Cambios guardados y publicados" : "Inmueble publicado en la web");
      setTimeout(() => router.push(`/admin/inmuebles/?guardado=${encodeURIComponent(g.ref)}`), 700);
    } catch (err) {
      avisar((err as Error).message, true);
      setGuardando(false);
    }
  };

  if (!f) return <Marco titulo="Cargando…" email={email} pendientes={pendientes}><div className="h-96 animate-pulse rounded-3xl bg-white" /></Marco>;

  const precioN = Number(f.precio.replace(/\D/g, ""));
  const anteriorN = Number(f.precioAnterior.replace(/\D/g, ""));
  const rebaja = anteriorN > precioN && precioN > 0 ? Math.round((1 - precioN / anteriorN) * 100) : 0;

  return (
    <Marco titulo={original ? `Editar ref. ${original.ref}` : "Nuevo inmueble"} email={email} pendientes={pendientes}>
      <Link href="/admin/inmuebles/" className="text-sm font-semibold text-tinta-suave">← Volver a la lista</Link>

      {errores.length > 0 && (
        <div role="alert" className="mt-3 rounded-2xl bg-[#FDECEA] p-4 text-sm text-[#8A1C12]">
          {errores.map((e) => <p key={e}>• {e}</p>)}
        </div>
      )}

      <div className="mt-3 space-y-4 pb-24">
        <Tarjeta titulo="Fotos" ayuda="La primera es la portada. Mantén pulsado ⠿ y arrastra para cambiar el orden.">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-azul-medio bg-azul/40 p-5 font-semibold hover:bg-azul">
            <IconoCamara className="h-6 w-6" /> Subir fotos
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { anadirFotos(e.target.files); e.target.value = ""; }} />
          </label>
          {fotos.length > 0 && (
            <Reorder.Group axis="y" values={fotos} onReorder={setFotos} className="mt-3 space-y-2">
              {fotos.map((p, k) => <FilaFoto key={p.id} foto={p} indice={k} quitar={() => setFotos((x) => x.filter((y) => y.id !== p.id))} />)}
            </Reorder.Group>
          )}
        </Tarjeta>

        <Tarjeta titulo="Lo básico">
          <Campo etiqueta="¿Venta o alquiler?">
            <div className="grid grid-cols-2 gap-2">
              {(["venta", "alquiler"] as const).map((o) => (
                <button key={o} type="button" onClick={() => set("operacion", o)} aria-pressed={f.operacion === o}
                  className={cn("rounded-2xl py-3 font-semibold ring-1", f.operacion === o ? "bg-tinta text-white ring-tinta" : "bg-white ring-azul-medio")}>
                  {o === "venta" ? "Venta" : "Alquiler"}
                </button>
              ))}
            </div>
          </Campo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Tipo">
              <select aria-label="Tipo" className="campo" value={f.tipo} onChange={(e) => set("tipo", e.target.value)}>
                {tipos.map(([t]) => <option key={t}>{t}</option>)}
              </select>
            </Campo>
            <Campo etiqueta="Zona">
              <select aria-label="Zona" className="campo" value={f.zona} onChange={(e) => set("zona", e.target.value)}>
                {[...new Set([...zonasLinares.map((z) => z.nombre), f.zona])].map((z) => <option key={z}>{z}</option>)}
              </select>
            </Campo>
          </div>
          <Campo etiqueta="Título (opcional)" ayuda={`Si lo dejas vacío: «${tituloSugerido}»`}>
            <input aria-label="Título" className="campo" value={f.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder={tituloSugerido} maxLength={90} />
          </Campo>
          <Campo etiqueta="Referencia">
            <input aria-label="Referencia" className="campo" value={f.ref} onChange={(e) => set("ref", e.target.value)} inputMode="numeric" />
          </Campo>
        </Tarjeta>

        <Tarjeta titulo="Precio">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta={f.operacion === "alquiler" ? "Precio al mes (€)" : "Precio (€)"}>
              <input aria-label="Precio" className="campo text-lg font-semibold" inputMode="numeric" value={f.precio ? miles(Number(f.precio.replace(/\D/g, ""))) : ""} onChange={(e) => set("precio", e.target.value.replace(/\D/g, ""))} placeholder="0" />
            </Campo>
            <Campo etiqueta="Precio anterior (€)" ayuda="Solo si lo has rebajado. Saldrá tachado.">
              <input aria-label="Precio anterior" className="campo" inputMode="numeric" value={f.precioAnterior ? miles(Number(f.precioAnterior.replace(/\D/g, ""))) : ""} onChange={(e) => set("precioAnterior", e.target.value.replace(/\D/g, ""))} placeholder="Sin rebaja" />
            </Campo>
          </div>
          {rebaja > 0 && (
            <div className="rounded-2xl bg-azul p-4 text-sm">
              Así se verá: <span className="text-tinta-suave line-through">{euros(anteriorN)}</span>{" "}
              <span className="text-lg font-bold text-naranja-texto">{euros(precioN)}</span>{" "}
              <span className="rounded-full bg-naranja px-2 py-0.5 text-xs font-bold">Rebajado −{rebaja}%</span>
            </div>
          )}
        </Tarjeta>

        <Tarjeta titulo="Características">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Metros construidos (m²)">
              <input aria-label="Metros construidos" className="campo" inputMode="decimal" value={f.m2} onChange={(e) => set("m2", e.target.value.replace(/[^\d.,]/g, ""))} placeholder="Ej. 90" />
            </Campo>
            <Campo etiqueta="Estado">
              <select aria-label="Estado" className="campo" value={f.conservacion} onChange={(e) => set("conservacion", e.target.value)}>
                {estados.map((x) => <option key={x} value={x}>{x || "Sin indicar"}</option>)}
              </select>
            </Campo>
          </div>
          {(vivienda || categoria === "local") && (
            <div className="grid gap-4 sm:grid-cols-3">
              {vivienda && <Contador etiqueta="Habitaciones" valor={f.habitaciones} set={(n) => set("habitaciones", n)} />}
              <Contador etiqueta="Baños" valor={f.banos} set={(n) => set("banos", n)} />
              {categoria !== "casa" && (
                <Campo etiqueta="Planta">
                  <input aria-label="Planta" className="campo" inputMode="numeric" value={f.planta} onChange={(e) => set("planta", e.target.value.replace(/\D/g, ""))} placeholder="Ej. 2 (0 = bajo)" />
                </Campo>
              )}
            </div>
          )}
          <Campo etiqueta="Extras">
            <div className="flex flex-wrap gap-2">
              {[...new Set([...extrasHabituales, ...f.extras])].map((x) => {
                const si = f.extras.includes(x);
                return (
                  <button key={x} type="button" aria-pressed={si} onClick={() => set("extras", si ? f.extras.filter((y) => y !== x) : [...f.extras, x])}
                    className={cn("rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition", si ? "bg-tinta text-white ring-tinta" : "bg-white ring-azul-medio")}>
                    {si ? "✓ " : "+ "}{x}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2">
              <input aria-label="Otro extra" className="campo" placeholder="Otro extra…" value={extraNuevo} onChange={(e) => setExtraNuevo(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && extraNuevo.trim()) { e.preventDefault(); set("extras", [...f.extras, extraNuevo.trim()]); setExtraNuevo(""); } }} />
              <button type="button" className="rounded-xl bg-azul px-4 font-semibold" onClick={() => { if (extraNuevo.trim()) { set("extras", [...f.extras, extraNuevo.trim()]); setExtraNuevo(""); } }}>Añadir</button>
            </div>
          </Campo>
        </Tarjeta>

        <Tarjeta titulo="Descripción" ayuda="Deja una línea en blanco para separar párrafos.">
          <textarea aria-label="Descripción" className="campo min-h-48 leading-relaxed" value={f.descripcion} onChange={(e) => set("descripcion", e.target.value)} placeholder="Cuenta cómo es el inmueble, la zona, lo mejor que tiene…" />
          <label className="flex items-center gap-3 text-sm font-medium">
            <input type="checkbox" checked={f.nuevo} onChange={(e) => set("nuevo", e.target.checked)} className="h-5 w-5 accent-[#1F3A5F]" />
            Mostrar la etiqueta «Nuevo»
          </label>
        </Tarjeta>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-20 border-t border-azul bg-white/95 p-3 backdrop-blur md:bottom-0">
        <div className="mx-auto flex max-w-5xl gap-2">
          {original && <a href={`/inmuebles/${original.ref}/`} target="_blank" className="btn-borde !px-4 text-sm">Ver en la web</a>}
          <button onClick={guardar} disabled={guardando} className="btn-naranja flex-1 !py-3.5 text-base disabled:opacity-50">
            {guardando ? "Guardando…" : original ? "Guardar cambios" : "Guardar y publicar"}
          </button>
        </div>
      </div>
      {nodo}
    </Marco>
  );
}

function FilaFoto({ foto, indice, quitar }: { foto: Foto; indice: number; quitar: () => void }) {
  const controles = useDragControls();
  return (
    <Reorder.Item value={foto} dragListener={false} dragControls={controles}
      className="flex items-center gap-3 rounded-2xl bg-white p-2 ring-1 ring-azul" whileDrag={{ scale: 1.03, boxShadow: "0 12px 30px -10px rgba(31,58,95,.4)" }}>
      <button type="button" onPointerDown={(e) => controles.start(e)} className="grid h-12 w-9 shrink-0 cursor-grab touch-none place-items-center rounded-xl bg-azul text-lg text-tinta-suave active:cursor-grabbing" aria-label={`Arrastrar foto ${indice + 1} para ordenar`}>⠿</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={foto.url} alt={`Foto ${indice + 1}`} className={cn("h-16 w-24 shrink-0 rounded-xl object-cover", foto.subiendo && "opacity-50")} draggable={false} />
      <div className="min-w-0 flex-1 text-sm">
        {foto.subiendo ? <span className="text-tinta-suave">Subiendo…</span>
          : indice === 0 ? <span className="rounded-full bg-naranja px-2.5 py-1 text-xs font-bold">Portada</span>
          : <span className="text-tinta-suave">Foto {indice + 1}</span>}
      </div>
      <button type="button" onClick={quitar} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-tinta-suave hover:bg-[#FDECEA] hover:text-[#B42318]" aria-label={`Quitar foto ${indice + 1}`}>
        <IconoCerrar className="h-5 w-5" />
      </button>
    </Reorder.Item>
  );
}

function Tarjeta({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-azul sm:p-6">
      <div>
        <h2 className="text-lg font-bold">{titulo}</h2>
        {ayuda && <p className="text-sm text-tinta-suave">{ayuda}</p>}
      </div>
      {children}
    </section>
  );
}

function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <p className="mb-1.5 text-sm font-semibold">{etiqueta}</p>
      {children}
      {ayuda && <p className="mt-1 text-xs text-tinta-suave">{ayuda}</p>}
    </div>
  );
}

function Contador({ etiqueta, valor, set }: { etiqueta: string; valor: number; set: (n: number) => void }) {
  return (
    <Campo etiqueta={etiqueta}>
      <div className="flex items-center justify-between rounded-xl bg-white ring-1 ring-azul-medio">
        <button type="button" onClick={() => set(Math.max(0, valor - 1))} className="h-12 w-12 text-2xl font-semibold" aria-label={`Menos ${etiqueta.toLowerCase()}`}>−</button>
        <span className="text-lg font-bold" aria-live="polite">{valor}</span>
        <button type="button" onClick={() => set(Math.min(20, valor + 1))} className="h-12 w-12 text-2xl font-semibold" aria-label={`Más ${etiqueta.toLowerCase()}`}>+</button>
      </div>
    </Campo>
  );
}
