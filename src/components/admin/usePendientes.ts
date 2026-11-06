"use client";

import { useEffect, useState } from "react";
import { listarSolicitudes } from "@/lib/datos";

/** Número de solicitudes sin atender (para el globito de la pestaña). */
export function usePendientes() {
  const [n, setN] = useState(0);
  useEffect(() => { listarSolicitudes().then((l) => setN(l.filter((s) => !s.atendida).length)).catch(() => {}); }, []);
  return n;
}
