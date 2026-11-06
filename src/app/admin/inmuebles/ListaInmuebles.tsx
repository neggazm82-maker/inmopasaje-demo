"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Protegido from "@/components/admin/Protegido";
import Marco from "@/components/admin/Marco";
import Confirmar from "@/components/admin/Confirmar";
import { useAviso } from "@/components/admin/Aviso";
import { usePendientes } from "@/components/admin/usePendientes";
import { cambiarInmueble, eliminarInmueble, listarInmuebles, type InmuebleGuardado } from "@/lib/datos";
import { cn, euros, precioTexto } from "@/lib/utils";
import { IconoLupa } from "@/components/Iconos";

const filtros = [
  { id: "todos", texto: "Todos" },
  { id: "disponible", texto: "En venta / alquiler" },
  { id: "cerrado", texto: "Vendidos / alquilados" },
  { id: "oculto", texto: "Ocultos" },
] as const;

export default function ListaInmuebles() {
  return <Protegido>{(u) => <Contenido email={u.email} />}</Protegido>;
}

function Contenido({ email }: { email: string }) {
  const [lista, setLista] = useState<InmuebleGuardado[] | null>(null);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todos");
  const [busca, setBusca] = useState("");
  const [borrar, setBorrar] = useState<InmuebleGuardado | null>(null);
  const { avisar, nodo } = useAviso();
  const pendientes = usePendientes();

  const cargar = useCallback(() => listarInmuebles({ incluirOcultos: true }).then(setLista).catch((e) => avisar(e.message, true)), [avisar]);
  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = async (i: InmuebleGuardado, cambios: Parameters<typeof cambiarInmueble>[1], mensaje: string) => {
    setLista((l) => l?.map((x) => (x.id === i.id ? { ...x, ...cambios } : x)) ?? null);
    try { await cambiarInmueble(i.id, cambios); avisar(mensaje); } catch (e) { avisar((e as Error).message, true); cargar(); }
  };

  const confirmarBorrado = async () => {
    if (!borrar) return;
    const i = borrar; setBorrar(null);
    setLista((l) => l?.filter((x) => x.id !== i.id) ?? null);
    try { await eliminarInmueble(i.id); avisar(`Ref. ${i.ref} eliminada`); } catch (e) { avisar((e as Error).message, true); cargar(); }
  };

  const q = busca.trim().toLowerCase();
  const visibles = (lista ?? []).filter((i) =>
    (filtro === "todos" || (filtro === "oculto" ? i.oculto : filtro === "disponible" ? i.estado === "disponible" && !i.oculto : i.estado !== "disponible")) &&
    (!q || `${i.ref} ${i.titulo} ${i.zona} ${i.tipo}`.toLowerCase().includes(q)),
  );

  return (
    <Marco titulo="Inmuebles" email={email} pendientes={pendientes}
      accion={
        <Link href="/admin/inmuebles/editar/" className="btn-naranja w-full !py-3.5 text-base sm:w-auto">+ Añadir inmueble</Link>
      }>
      <div className="relative">
        <IconoLupa className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tinta-suave" />
        <input className="campo !rounded-full !pl-11" placeholder="Buscar por ref., calle o zona" value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar inmueble" />
      </div>
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {filtros.map((f) => (
          <button key={f.id} onClick={() => setFiltro(f.id)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold", filtro === f.id ? "bg-tinta text-white" : "bg-white text-tinta ring-1 ring-azul-medio")}>{f.texto}</button>
        ))}
      </div>

      {lista === null ? (
        <div className="mt-4 space-y-3">{[0, 1, 2].map((k) => <div key={k} className="h-40 animate-pulse rounded-3xl bg-white" />)}</div>
      ) : (
        <>
          <p className="mt-4 text-sm text-tinta-suave">{visibles.length} {visibles.length === 1 ? "inmueble" : "inmuebles"}</p>
          <ul className="mt-2 grid gap-3 lg:grid-cols-2">
            <AnimatePresence initial={false}>
              {visibles.map((i) => (
                <motion.li key={i.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }}
                  className={cn("overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-azul", i.oculto && "opacity-70")}>
                  <div className="flex gap-3 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {i.fotos[0] ? <img src={i.fotos[0]} alt="" className={cn("h-24 w-28 shrink-0 rounded-2xl object-cover", i.estado !== "disponible" && "grayscale")} loading="lazy" />
                      : <div className="grid h-24 w-28 shrink-0 place-items-center rounded-2xl bg-azul text-xs text-tinta-suave">Sin foto</div>}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-azul px-2 py-0.5 text-[11px] font-semibold">Ref. {i.ref}</span>
                        {i.operacion === "alquiler" && <span className="rounded-full bg-azul-medio/60 px-2 py-0.5 text-[11px] font-semibold">Alquiler</span>}
                        {i.estado !== "disponible" && <span className="rounded-full bg-tinta px-2 py-0.5 text-[11px] font-semibold uppercase text-white">{i.estado}</span>}
                        {i.oculto && <span className="rounded-full bg-[#FDECEA] px-2 py-0.5 text-[11px] font-semibold text-[#8A1C12]">Oculto</span>}
                        {i.precioAnterior && <span className="rounded-full bg-naranja px-2 py-0.5 text-[11px] font-semibold">Rebajado</span>}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{i.titulo}</p>
                      <p className="mt-0.5 truncate text-xs text-tinta-suave">{i.tipo} · {i.zona}</p>
                      <p className="mt-1 font-bold text-naranja-texto">
                        {i.precioAnterior && <span className="mr-1.5 text-xs font-normal text-tinta-suave line-through">{euros(i.precioAnterior)}</span>}
                        {precioTexto(i)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px border-t border-azul bg-azul text-sm font-semibold sm:grid-cols-4">
                    <Link href={`/admin/inmuebles/editar/?id=${encodeURIComponent(i.id)}`} className="bg-white py-3 text-center hover:bg-azul/40">Editar</Link>
                    <button className="bg-white py-3 hover:bg-azul/40"
                      onClick={() => i.estado === "disponible"
                        ? cambiar(i, { estado: i.operacion === "alquiler" ? "alquilado" : "vendido" }, i.operacion === "alquiler" ? "Marcado como alquilado" : "Marcado como vendido")
                        : cambiar(i, { estado: "disponible" }, "Vuelve a estar disponible")}>
                      {i.estado === "disponible" ? (i.operacion === "alquiler" ? "Marcar alquilado" : "Marcar vendido") : "Volver a disponible"}
                    </button>
                    <button className="bg-white py-3 hover:bg-azul/40" onClick={() => cambiar(i, { oculto: !i.oculto }, i.oculto ? "Ya se ve en la web" : "Oculto: ya no sale en la web")}>
                      {i.oculto ? "Mostrar" : "Ocultar"}
                    </button>
                    <button className="bg-white py-3 text-[#B42318] hover:bg-[#FDECEA]" onClick={() => setBorrar(i)}>Eliminar</button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {visibles.length === 0 && <p className="mt-6 rounded-3xl bg-white p-8 text-center text-tinta-suave">No hay inmuebles aquí.</p>}
        </>
      )}

      <Confirmar abierto={!!borrar} peligro titulo={`¿Eliminar la ref. ${borrar?.ref}?`} boton="Sí, eliminar"
        texto="Se borrará de la web y del panel, con sus datos. Esto no se puede deshacer. Si solo quieres quitarlo de la web un tiempo, usa «Ocultar»."
        onSi={confirmarBorrado} onNo={() => setBorrar(null)} />
      {nodo}
    </Marco>
  );
}
