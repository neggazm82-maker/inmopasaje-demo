"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { whatsappUrl } from "@/data/empresa";
import { IconoWhatsApp } from "./Iconos";

export default function WhatsAppFlotante() {
  // En la ficha del móvil hay una barra fija abajo: subimos el botón.
  const enFicha = /^\/inmuebles\/\d+/.test(usePathname() ?? "");
  return (
    <motion.a
      href={whatsappUrl("Hola, os escribo desde vuestra web. Me gustaría información.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`group fixed right-5 ${enFicha ? "bottom-24 lg:bottom-5" : "bottom-5"} z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-4 text-[#0b3d1f] shadow-xl shadow-black/20 print:hidden`}
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.06 }}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
      <IconoWhatsApp className="h-7 w-7" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap font-semibold transition-all duration-300 group-hover:max-w-40 sm:inline">
        ¿Hablamos?
      </span>
    </motion.a>
  );
}
