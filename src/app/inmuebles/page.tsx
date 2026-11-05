import type { Metadata } from "next";
import { Suspense } from "react";
import Listado from "./Listado";

export const metadata: Metadata = { title: "Pisos, casas y locales en Linares" };

export default function PaginaInmuebles() {
  return (
    <div className="bg-gradient-to-b from-azul to-white to-[420px] pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center">Cargando inmuebles…</p>}>
          <Listado />
        </Suspense>
      </div>
    </div>
  );
}
