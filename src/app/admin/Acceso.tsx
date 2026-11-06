"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DEMO_CLAVE, DEMO_EMAIL, entrar, modoDemo, recuperarClave, usuarioActual } from "@/lib/datos";

export default function Acceso() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "recuperar">("entrar");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [ver, setVer] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  useEffect(() => { usuarioActual().then((u) => { if (u) router.replace("/admin/inmuebles/"); }); }, [router]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setOcupado(true);
    try {
      if (modo === "entrar") { await entrar(email, clave); router.replace("/admin/inmuebles/"); }
      else { await recuperarClave(email); setEnviado(true); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
    } finally { setOcupado(false); }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-azul to-white px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="mb-6 flex justify-center"><Image src="/logo.png" alt="Inmobiliaria El Pasaje" width={248} height={78} className="h-14 w-auto" priority /></div>
        <div className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-tinta/10 ring-1 ring-azul sm:p-8">
          <AnimatePresence mode="wait">
            <motion.form key={modo} onSubmit={enviar} initial={{ opacity: 0, x: modo === "entrar" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{modo === "entrar" ? "Panel de gestión" : "Recuperar contraseña"}</h1>
                <p className="mt-1 text-sm text-tinta-suave">
                  {modo === "entrar" ? "Entra con tu email y contraseña." : "Te enviaremos un email con un enlace para crear una contraseña nueva."}
                </p>
              </div>

              {enviado ? (
                <p className="rounded-2xl bg-azul p-4 text-sm">Si <strong>{email}</strong> tiene una cuenta, en unos minutos recibirá un email con el enlace. Mira también en la carpeta de correo no deseado.</p>
              ) : (
                <>
                  <label className="block"><span className="mb-1 block text-sm font-semibold">Email</span>
                    <input className="campo" type="email" inputMode="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                  {modo === "entrar" && (
                    <label className="block"><span className="mb-1 block text-sm font-semibold">Contraseña</span>
                      <div className="relative">
                        <input className="campo pr-20" type={ver ? "text" : "password"} autoComplete="current-password" required value={clave} onChange={(e) => setClave(e.target.value)} />
                        <button type="button" onClick={() => setVer(!ver)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-tinta-suave hover:bg-azul">{ver ? "Ocultar" : "Ver"}</button>
                      </div>
                    </label>
                  )}
                  {error && <p role="alert" className="rounded-xl bg-[#FDECEA] p-3 text-sm font-medium text-[#8A1C12]">{error}</p>}
                  <button type="submit" disabled={ocupado} className="btn-naranja w-full disabled:opacity-50">
                    {ocupado ? "Un momento…" : modo === "entrar" ? "Entrar" : "Enviar enlace"}
                  </button>
                </>
              )}

              <button type="button" onClick={() => { setModo(modo === "entrar" ? "recuperar" : "entrar"); setError(""); setEnviado(false); }}
                className="w-full text-center text-sm font-semibold text-tinta underline-offset-4 hover:underline">
                {modo === "entrar" ? "¿Has olvidado tu contraseña?" : "← Volver a entrar"}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>

        {modoDemo && (
          <div className="mt-4 rounded-2xl bg-white/80 p-4 text-center text-xs text-tinta ring-1 ring-azul-medio">
            <p className="font-semibold">Modo demo</p>
            <p className="mt-1">Email: <button className="font-mono underline" onClick={() => setEmail(DEMO_EMAIL)}>{DEMO_EMAIL}</button> · Contraseña: <button className="font-mono underline" onClick={() => setClave(DEMO_CLAVE)}>{DEMO_CLAVE}</button></p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
