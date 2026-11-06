import Link from "next/link";
import Hero from "@/components/Hero";
import Contadores from "@/components/Contadores";
import Destacados from "@/components/Destacados";
import AvisoMuestra from "@/components/AvisoMuestra";
import Reveal from "@/components/Reveal";
import BandaValoracion from "@/components/BandaValoracion";
import Avisame from "@/components/Avisame";
import SeccionMapa from "@/components/SeccionMapa";
import Servicios from "@/components/Servicios";
import SobreNosotros from "@/components/SobreNosotros";
import Contacto from "@/components/Contacto";
import { IconoFlecha } from "@/components/Iconos";

export default function Inicio() {
  return (
    <>
      <Hero />
      <Contadores />

      <section id="destacados" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold uppercase tracking-widest text-tinta-suave text-sm">Inmuebles destacados</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                Tu próxima casa <span className="text-naranja-texto">te espera</span>
              </h2>
              <div className="mt-4"><AvisoMuestra /></div>
            </div>
            <Link href="/inmuebles/" className="btn-borde self-start sm:self-auto">
              Ver todos <IconoFlecha className="h-4 w-4" />
            </Link>
          </Reveal>

          <Destacados />
        </div>
      </section>

      <SeccionMapa />
      <BandaValoracion />
      <Servicios />
      <Avisame />
      <SobreNosotros />
      <Contacto />
    </>
  );
}
