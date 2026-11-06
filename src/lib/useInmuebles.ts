"use client";

import { useEffect, useState } from "react";
import { inmueblesDeInicio, listarInmuebles, modoDemo, type InmuebleGuardado } from "./datos";

/**
 * Inmuebles visibles en la web pública.
 * Sin Supabase (demo): se muestran al instante los de muestra y, si en este
 * navegador se han cambiado desde el panel, se ven los cambios.
 * Con Supabase: se esperan los datos reales (el panel es la única fuente).
 */
export function useInmuebles() {
  const [lista, setLista] = useState<InmuebleGuardado[]>(modoDemo ? inmueblesDeInicio : []);
  const [cargando, setCargando] = useState(!modoDemo);
  useEffect(() => {
    let vivo = true;
    listarInmuebles()
      .then((l) => { if (vivo) setLista(l); })
      .catch(() => { /* si falla, se quedan los de muestra */ if (vivo && !modoDemo) setLista(inmueblesDeInicio); })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, []);
  return { inmuebles: lista, cargando };
}
