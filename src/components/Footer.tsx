import Link from "next/link";
import Image from "next/image";
import { empresa } from "@/data/empresa";
import { IconoEmail, IconoPin, IconoReloj, IconoTelefono } from "./Iconos";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-tinta text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-azul-medio/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-2xl bg-white p-3">
            <Image src="/logo.png" alt="Inmobiliaria El Pasaje" width={248} height={78} className="h-12 w-auto" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
            Venta, alquiler, alquiler de temporada, alquiler con opción a compra, traspasos, obra nueva y valoración de inmuebles en Linares.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/90">
            <li className="flex gap-3"><IconoPin className="h-5 w-5 shrink-0 text-azul-medio" />{empresa.direccion}, {empresa.cp} {empresa.ciudad} ({empresa.provincia})</li>
            <li><a className="flex gap-3 hover:text-naranja" href={`tel:${empresa.telefonoLink}`}><IconoTelefono className="h-5 w-5 shrink-0 text-azul-medio" />{empresa.telefono} (teléfono y WhatsApp)</a></li>
            <li><a className="flex gap-3 break-all hover:text-naranja" href={`mailto:${empresa.email}`}><IconoEmail className="h-5 w-5 shrink-0 text-azul-medio" />{empresa.email}</a></li>
            <li className="flex gap-3"><IconoReloj className="h-5 w-5 shrink-0 text-azul-medio" />{empresa.horario}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Inmuebles</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/90">
            <li><Link className="hover:text-naranja" href="/inmuebles/?op=venta">Comprar</Link></li>
            <li><Link className="hover:text-naranja" href="/inmuebles/?op=alquiler">Alquilar</Link></li>
            <li><Link className="hover:text-naranja" href="/inmuebles/">Ver todos los inmuebles</Link></li>
            <li><Link className="hover:text-naranja" href="/valora-tu-casa/">Valora tu casa</Link></li>
            <li><Link className="hover:text-naranja" href="/#avisame">Avísame por WhatsApp</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <p>© {new Date().getFullYear()} {empresa.nombre}</p>
            <Link className="hover:text-white" href="/aviso-legal/">Aviso legal</Link>
            <Link className="hover:text-white" href="/privacidad/">Privacidad</Link>
            <Link className="hover:text-white" href="/cookies/">Cookies</Link>
          </div>
          <p>Propuesta de diseño para Inmobiliaria El Pasaje</p>
        </div>
      </div>
    </footer>
  );
}
