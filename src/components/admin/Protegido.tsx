"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usuarioActual, type Usuario } from "@/lib/datos";

/** Solo deja ver el contenido a quien ha iniciado sesión; si no, lleva a la pantalla de acceso. */
export default function Protegido({ children }: { children: (u: NonNullable<Usuario>) => React.ReactNode }) {
  const router = useRouter();
  const [u, setU] = useState<Usuario | undefined>(undefined);
  useEffect(() => {
    usuarioActual().then((x) => { setU(x); if (!x) router.replace("/admin/"); });
  }, [router]);
  if (!u) return <div className="grid min-h-[100dvh] place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-azul border-t-naranja" aria-label="Cargando" /></div>;
  return <>{children(u)}</>;
}
