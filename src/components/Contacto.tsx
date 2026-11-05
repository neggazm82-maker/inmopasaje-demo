"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { empresa, whatsappUrl } from "@/data/empresa";
import { enviarFormulario } from "@/lib/formularios";
import Reveal from "./Reveal";
import InfoProteccionDatos from "./InfoProteccionDatos";
import { IconoCheck, IconoEmail, IconoPin, IconoReloj, IconoTelefono, IconoWhatsApp } from "./Iconos";

const MapaOficina = dynamic(() => import("./MapaOficina"), { ssr: false, loading: () => <div className="h-full animate-pulse bg-azul" /> });

export default function Contacto() {
  const [f, setF] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [acepto, setAcepto] = useState(false);
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | "vista" | "error">("");
  const valido = f.nombre.trim() && (f.telefono.trim() || f.email.trim()) && f.mensaje.trim() && acepto;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valido) return;
    setEstado("enviando");
    const r = await enviarFormulario("contacto", f);
    setEstado(r.ok ? (r.vistaPrevia ? "vista" : "ok") : "error");
  };

  const datos = [
    { icono: IconoPin, titulo: "Oficina", texto: `${empresa.direccion}, ${empresa.cp} ${empresa.ciudad} (${empresa.provincia})`, href: `https://www.openstreetmap.org/?mlat=${empresa.oficina.lat}&mlon=${empresa.oficina.lng}#map=18/${empresa.oficina.lat}/${empresa.oficina.lng}` },
    { icono: IconoTelefono, titulo: "Teléfono", texto: empresa.telefono, href: `tel:${empresa.telefonoLink}` },
    { icono: IconoWhatsApp, titulo: "WhatsApp", texto: empresa.telefono, href: whatsappUrl("Hola, os escribo desde vuestra web.") },
    { icono: IconoEmail, titulo: "Email", texto: empresa.email, href: `mailto:${empresa.email}` },
    { icono: IconoReloj, titulo: "Horario", texto: empresa.horario },
  ];

  return (
    <section id="contacto" className="scroll-mt-20 bg-gradient-to-b from-white to-azul py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-tinta-suave">Contacto</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Ven a vernos <span className="text-naranja-texto">o escríbenos</span></h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="flex flex-col gap-4">
            <ul className="grid gap-3 sm:grid-cols-2">
              {datos.map((d) => {
                const dentro = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-azul text-tinta ring-1 ring-azul-medio"><d.icono className="h-5 w-5" /></span>
                    <span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-wide text-tinta-suave">{d.titulo}</span><span className="block break-words font-semibold">{d.texto}</span></span>
                  </>
                );
                return (
                  <li key={d.titulo} className={d.titulo === "Oficina" ? "sm:col-span-2" : ""}>
                    {d.href ? (
                      <a href={d.href} target={d.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex h-full items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-azul transition hover:-translate-y-0.5 hover:shadow-md">{dentro}</a>
                    ) : (
                      <div className="flex h-full items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-azul">{dentro}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="h-72 min-h-72 flex-1 overflow-hidden rounded-3xl ring-4 ring-white shadow-lg shadow-tinta/10">
              <MapaOficina />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-tinta/10 ring-1 ring-azul sm:p-8">
            <AnimatePresence mode="wait">
              {estado === "ok" || estado === "vista" ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="grid h-full place-items-center py-12 text-center">
                  <div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-naranja text-tinta"><IconoCheck className="h-10 w-10" /></motion.div>
                    <h3 className="mt-5 text-2xl font-bold">¡Mensaje enviado!</h3>
                    <p className="mt-2 text-tinta-suave">Te responderemos lo antes posible.</p>
                    {estado === "vista" && <p className="mx-auto mt-4 max-w-sm rounded-xl bg-azul p-3 text-xs">Vista previa: el envío por email funcionará cuando la web esté publicada en Netlify.</p>}
                  </div>
                </motion.div>
              ) : (
                <motion.form key="f" onSubmit={enviar} exit={{ opacity: 0 }} className="space-y-4">
                  <h3 className="text-xl font-bold">Escríbenos</h3>
                  <label className="block"><span className="mb-1 block text-sm font-semibold">Nombre *</span>
                    <input className="campo" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} autoComplete="name" /></label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block"><span className="mb-1 block text-sm font-semibold">Teléfono</span>
                      <input className="campo" type="tel" inputMode="tel" value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} autoComplete="tel" /></label>
                    <label className="block"><span className="mb-1 block text-sm font-semibold">Email</span>
                      <input className="campo" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></label>
                  </div>
                  <label className="block"><span className="mb-1 block text-sm font-semibold">¿En qué podemos ayudarte? *</span>
                    <textarea className="campo min-h-32" value={f.mensaje} onChange={(e) => setF({ ...f, mensaje: e.target.value })} /></label>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} className="mt-1 h-5 w-5 accent-[#1F3A5F]" />
                    <span>He leído la información sobre protección de datos y acepto que me contactéis.</span>
                  </label>
                  <InfoProteccionDatos finalidad="Responder a tu consulta." />
                  {estado === "error" && <p className="text-sm font-semibold">No se ha podido enviar. Llámanos al {empresa.telefono}.</p>}
                  <p className="text-xs text-tinta-suave">* Obligatorio. Déjanos al menos un teléfono o un email.</p>
                  <button type="submit" disabled={!valido || estado === "enviando"} className="btn-naranja w-full disabled:cursor-not-allowed disabled:opacity-40">
                    {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
