"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { empresa } from "@/data/empresa";
import { IconoCerrar, IconoMenu, IconoTelefono } from "./Iconos";
import { cn } from "@/lib/utils";

export const enlacesMenu = [
  { href: "/inmuebles/?op=venta", texto: "Comprar" },
  { href: "/inmuebles/?op=alquiler", texto: "Alquilar" },
  { href: "/#destacados", texto: "Destacados" },
  { href: "/#avisame", texto: "Avísame" },
  { href: "/#contacto", texto: "Contacto" },
];

export default function Header() {
  const [scroll, setScroll] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const f = () => setScroll(window.scrollY > 20);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
  }, [abierto]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scroll ? "bg-azul/95 shadow-[0_6px_30px_-12px_rgba(31,58,95,.35)] backdrop-blur-md" : "bg-azul/80 backdrop-blur-sm",
      )}
    >
      <div className={cn("mx-auto flex max-w-7xl items-center justify-between px-4 transition-all sm:px-6", scroll ? "h-16" : "h-20")}>
        <Link href="/" className="shrink-0" aria-label="Inmobiliaria El Pasaje, inicio">
          <Image src="/logo.png" alt="Inmobiliaria El Pasaje" width={248} height={78} priority className={cn("w-auto transition-all", scroll ? "h-10" : "h-12")} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Menú principal">
          {enlacesMenu.map((e) => (
            <Link key={e.href} href={e.href} className="group relative text-[15px] font-medium text-tinta">
              {e.texto}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-naranja transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <a href={`tel:${empresa.telefonoLink}`} className="flex items-center gap-2 text-[15px] font-semibold text-tinta">
            <IconoTelefono className="h-4 w-4" /> {empresa.telefono}
          </a>
          <Link href="/valora-tu-casa/" className="btn-naranja !px-5 !py-2.5 text-sm">
            Valora tu casa
          </Link>
        </nav>

        <button
          className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-tinta lg:hidden"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
        >
          <IconoMenu />
        </button>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-azul lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 5%)" }}
            animate={{ clipPath: "circle(150% at 92% 5%)" }}
            exit={{ clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="flex h-20 items-center justify-between px-4">
              <Image src="/logo.png" alt="Inmobiliaria El Pasaje" width={248} height={78} className="h-12 w-auto" />
              <button className="grid h-11 w-11 place-items-center rounded-full bg-white text-tinta" onClick={() => setAbierto(false)} aria-label="Cerrar menú">
                <IconoCerrar />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-2 px-6 pt-6" aria-label="Menú móvil">
              {[{ href: "/", texto: "Inicio" }, ...enlacesMenu, { href: "/valora-tu-casa/", texto: "Valora tu casa" }].map((e, i) => (
                <motion.div key={e.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <Link href={e.href} onClick={() => setAbierto(false)} className="block border-b border-azul-medio py-4 text-2xl font-semibold text-tinta">
                    {e.texto}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="space-y-3 p-6">
              <a href={`tel:${empresa.telefonoLink}`} className="btn-borde w-full">
                <IconoTelefono className="h-5 w-5" /> Llamar al {empresa.telefono}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
