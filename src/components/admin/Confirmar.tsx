"use client";

import { AnimatePresence, motion } from "framer-motion";

/** Ventana para confirmar acciones que no se pueden deshacer. */
export default function Confirmar({ abierto, titulo, texto, boton, peligro, onSi, onNo }: {
  abierto: boolean; titulo: string; texto: string; boton: string; peligro?: boolean; onSi: () => void; onNo: () => void;
}) {
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/50 p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onNo}>
          <motion.div
            role="alertdialog" aria-modal="true" aria-labelledby="confirmar-titulo"
            className="w-full max-w-sm rounded-3xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:pb-6"
            initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirmar-titulo" className="text-lg font-bold">{titulo}</h2>
            <p className="mt-2 text-sm text-tinta-suave">{texto}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={onNo} className="rounded-full bg-azul py-3 font-semibold text-tinta">Cancelar</button>
              <button onClick={onSi} className={peligro ? "rounded-full bg-[#B42318] py-3 font-semibold text-white" : "btn-naranja"}>{boton}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
