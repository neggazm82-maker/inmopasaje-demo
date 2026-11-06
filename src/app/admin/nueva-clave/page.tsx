"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { alRecuperar, cambiarClave, usuarioActual } from "@/lib/datos";

/** Página a la que lleva el email de "¿Has olvidado tu contraseña?". */
export default function NuevaClave() {
  const router = useRouter();
  const [listo, setListo] = useState(false);
  const [clave, setClave] = useState("");
  const [repetir, setRepetir] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const quitar = alRecuperar(() => setListo(true));
    // Si el enlace ya abrió la sesión antes de escuchar, también vale.
    const t = setTimeout(() => usuarioActual().then((u) => u && setListo(true)), 800);
    return () => { quitar(); clearTimeout(t); };
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (clave.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (clave !== repetir) return setError("Las dos contraseñas no coinciden.");
    try { await cambiarClave(clave); setOk(true); setTimeout(() => router.replace("/admin/inmuebles/"), 1500); }
    catch (err) { setError(err instanceof Error ? err.message : "No se ha podido cambiar."); }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-b from-azul to-white px-4">
      <form onSubmit={guardar} className="w-full max-w-sm space-y-4 rounded-[2rem] bg-white p-6 shadow-2xl shadow-tinta/10 ring-1 ring-azul sm:p-8">
        <h1 className="text-2xl font-bold">Nueva contraseña</h1>
        {!listo ? (
          <p className="text-sm text-tinta-suave">Comprobando el enlace… Si tarda, vuelve a pedir el email desde <a className="font-semibold underline" href="/admin/">la pantalla de acceso</a>: el enlace caduca al cabo de un rato.</p>
        ) : ok ? (
          <p className="rounded-2xl bg-azul p-4 text-sm font-semibold">¡Contraseña cambiada! Entrando al panel…</p>
        ) : (
          <>
            <label className="block"><span className="mb-1 block text-sm font-semibold">Nueva contraseña</span>
              <input className="campo" type="password" autoComplete="new-password" value={clave} onChange={(e) => setClave(e.target.value)} /></label>
            <label className="block"><span className="mb-1 block text-sm font-semibold">Repite la contraseña</span>
              <input className="campo" type="password" autoComplete="new-password" value={repetir} onChange={(e) => setRepetir(e.target.value)} /></label>
            {error && <p role="alert" className="rounded-xl bg-[#FDECEA] p-3 text-sm font-medium text-[#8A1C12]">{error}</p>}
            <button className="btn-naranja w-full">Guardar contraseña</button>
          </>
        )}
      </form>
    </div>
  );
}
