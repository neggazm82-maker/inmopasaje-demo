"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { modoDemo, salir } from "@/lib/datos";
import { cn } from "@/lib/utils";
import { IconoCasa, IconoEmail, IconoFlecha } from "@/components/Iconos";

const pestañas = [
  { href: "/admin/inmuebles/", texto: "Inmuebles", icono: IconoCasa },
  { href: "/admin/solicitudes/", texto: "Solicitudes", icono: IconoEmail },
];

/** Marco de la app: barra superior y, en el móvil, barra de pestañas abajo. */
export default function Marco({ titulo, email, pendientes, accion, children }: {
  titulo: string; email: string; pendientes?: number; accion?: React.ReactNode; children: React.ReactNode;
}) {
  const ruta = usePathname();
  const router = useRouter();
  const cerrar = async () => { await salir(); router.replace("/admin/"); };

  return (
    <div className="pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-10">
      <header className="sticky top-0 z-30 bg-tinta pt-[env(safe-area-inset-top)] text-white shadow-lg shadow-tinta/20">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-sm font-bold">EP</span>
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold">{titulo}</h1>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Secciones">
            {pestañas.map((p) => (
              <Link key={p.href} href={p.href} className={cn("relative rounded-full px-4 py-1.5 text-sm font-semibold", ruta?.startsWith(p.href) ? "bg-white text-tinta" : "text-white/80 hover:bg-white/10")}>
                {p.texto}
                {p.href.includes("solicitudes") && !!pendientes && <span className="ml-1.5 rounded-full bg-naranja px-1.5 text-xs text-tinta">{pendientes}</span>}
              </Link>
            ))}
            <a href="/" target="_blank" className="rounded-full px-4 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/10">Ver web ↗</a>
          </nav>
          <details className="relative">
            <summary className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full bg-white/10 text-sm font-bold uppercase" aria-label="Mi cuenta">
              {email[0]}
            </summary>
            <div className="absolute right-0 top-11 w-60 rounded-2xl bg-white p-2 text-tinta shadow-xl ring-1 ring-azul">
              <p className="truncate px-3 py-2 text-xs text-tinta-suave">{email}</p>
              <a href="/" target="_blank" className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-azul md:hidden">Ver la web ↗</a>
              <button onClick={cerrar} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-azul">Cerrar sesión</button>
            </div>
          </details>
        </div>
      </header>

      {modoDemo && (
        <div className="bg-naranja/90 px-4 py-2 text-center text-xs font-medium text-tinta">
          Modo demo: los cambios se guardan solo en este navegador. Al conectar Supabase se guardarán para todos.
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-5">
        {accion && <div className="mb-4">{accion}</div>}
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-azul bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Secciones">
        {pestañas.map((p) => {
          const activo = ruta?.startsWith(p.href);
          return (
            <Link key={p.href} href={p.href} className={cn("relative flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold", activo ? "text-tinta" : "text-tinta-suave")}>
              <span className={cn("grid h-8 w-14 place-items-center rounded-full transition", activo && "bg-azul")}><p.icono className="h-5 w-5" /></span>
              {p.texto}
              {p.href.includes("solicitudes") && !!pendientes && <span className="absolute right-[calc(50%-26px)] top-1.5 min-w-5 rounded-full bg-naranja px-1 text-center text-[11px] text-tinta">{pendientes}</span>}
            </Link>
          );
        })}
        <a href="/" target="_blank" className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-tinta-suave">
          <span className="grid h-8 w-14 place-items-center rounded-full"><IconoFlecha className="h-5 w-5 -rotate-45" /></span>
          Ver web
        </a>
      </nav>
    </div>
  );
}
