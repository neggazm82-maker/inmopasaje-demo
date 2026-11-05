import type { Metadata } from "next";
import Asistente from "./Asistente";

export const metadata: Metadata = {
  title: "¿Cuánto vale tu casa? Valoración en 2 minutos",
  description: "Cuéntanos cómo es tu inmueble en Linares y un experto de El Pasaje te llamará en menos de 24 horas con la valoración.",
};

export default function Valora() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-azul via-white to-azul pt-24 pb-20">
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-azul-medio/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-naranja/15 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Asistente />
      </div>
    </div>
  );
}
