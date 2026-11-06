"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

/** Mensajito temporal ("Guardado", "Error…"). */
export function useAviso() {
  const [texto, setTexto] = useState<{ t: string; error?: boolean } | null>(null);
  const reloj = useRef<ReturnType<typeof setTimeout>>(undefined);
  const avisar = useCallback((t: string, error = false) => {
    setTexto({ t, error });
    clearTimeout(reloj.current);
    reloj.current = setTimeout(() => setTexto(null), error ? 6000 : 2800);
  }, []);
  const nodo = (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-8" aria-live="polite">
      <AnimatePresence>
        {texto && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`rounded-full px-5 py-3 text-sm font-semibold shadow-xl ${texto.error ? "bg-[#B42318] text-white" : "bg-tinta text-white"}`}>
            {texto.t}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
  return { avisar, nodo };
}
