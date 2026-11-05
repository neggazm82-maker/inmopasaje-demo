import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { inmuebles } from "@/data/inmuebles";
import { empresa, whatsappUrl } from "@/data/empresa";
import { m2 } from "@/lib/utils";
import Galeria from "./Galeria";
import MapaZona from "./MapaZona";
import Hipoteca from "./Hipoteca";
import Precio from "@/components/Precio";
import Etiquetas from "@/components/Etiquetas";
import Reveal from "@/components/Reveal";
import TarjetaInmueble from "@/components/TarjetaInmueble";
import AvisoMuestra from "@/components/AvisoMuestra";
import { IconoCheck, IconoIzq, IconoPin, IconoTelefono, IconoWhatsApp } from "@/components/Iconos";

export const dynamicParams = false;
export function generateStaticParams() {
  return inmuebles.map((i) => ({ ref: i.ref }));
}

export async function generateMetadata({ params }: { params: Promise<{ ref: string }> }): Promise<Metadata> {
  const { ref } = await params;
  const i = inmuebles.find((x) => x.ref === ref);
  return { title: i ? `${i.titulo} (ref. ${i.ref})` : "Inmueble" };
}

export default async function Ficha({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const i = inmuebles.find((x) => x.ref === ref);
  if (!i) notFound();

  const wa = whatsappUrl(`Hola, me interesa el inmueble ref. ${i.ref}`);
  const datos: [string, string | number | undefined][] = [
    ["Referencia", i.ref],
    ["Operación", i.operacion === "venta" ? "Venta" : "Alquiler"],
    ["Tipo", i.tipo],
    ["Zona", `${i.zona} (Linares)`],
    ["Superficie construida", i.m2Construidos ? m2(i.m2Construidos) : undefined],
    ["Superficie útil", i.m2Utiles ? m2(i.m2Utiles) : undefined],
    ["Superficie de parcela", i.m2Parcela ? m2(i.m2Parcela) : undefined],
    ["Habitaciones", i.habitaciones],
    ["Baños", i.banos],
    ["Planta", i.planta],
    ["Estado", i.conservacion],
    ["Año de construcción", i.antiguedad],
    ["Gastos de comunidad", i.gastosComunidad],
    ["IBI", i.ibi],
  ];
  const similares = inmuebles.filter((x) => x.ref !== i.ref && (x.categoria === i.categoria || x.zona === i.zona)).slice(0, 3);

  return (
    <article className="pt-24 pb-28 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/inmuebles/" className="inline-flex items-center gap-1 text-sm font-medium text-tinta-suave hover:text-tinta">
            <IconoIzq className="h-4 w-4" /> Volver a los inmuebles
          </Link>
          <AvisoMuestra />
        </div>

        <div className="mt-4">
          <Galeria fotos={i.fotos} titulo={i.titulo} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <Reveal>
              <Etiquetas i={i} />
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{i.titulo}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-tinta-suave">
                <IconoPin className="h-5 w-5 text-azul-medio" /> {i.tipo} en {i.zona}, Linares · Ref. {i.ref}
              </p>
              <div className="mt-5 lg:hidden"><Precio i={i} grande /></div>
            </Reveal>

            <Reveal className="mt-8">
              <h2 className="text-xl font-bold">Datos del inmueble</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {datos.filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-azul/60 p-4 ring-1 ring-azul">
                    <dt className="text-xs font-medium uppercase tracking-wide text-tinta-suave">{k}</dt>
                    <dd className="mt-1 font-semibold text-tinta">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {i.caracteristicas.length > 0 && (
              <Reveal className="mt-10">
                <h2 className="text-xl font-bold">Características</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {i.caracteristicas.map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-azul text-tinta"><IconoCheck className="h-4 w-4" /></span>
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal className="mt-10">
              <h2 className="text-xl font-bold">Descripción</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-tinta/90">
                {i.descripcion.map((p, n) => <p key={n}>{p}</p>)}
              </div>
              <p className="mt-6 rounded-2xl bg-azul/50 p-4 text-xs leading-relaxed text-tinta-suave">
                De conformidad con el Decreto 218/2005, de 11 de octubre, de la Junta de Andalucía, se informa de que los gastos notariales, registrales, de gestoría, impuestos (ITP, AJD o IVA), honorarios de intermediación y otros gastos inherentes a la compra no están incluidos en el precio. Estas características son meramente informativas y no tienen valor contractual.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="text-xl font-bold">Zona del inmueble</h2>
              <p className="mt-1 text-sm text-tinta-suave">Por privacidad mostramos la zona aproximada, no la dirección exacta.</p>
              <div className="mt-4 h-80 overflow-hidden rounded-3xl ring-1 ring-azul-medio">
                <MapaZona lat={i.lat} lng={i.lng} />
              </div>
            </Reveal>

            {i.operacion === "venta" && (
              <Reveal className="mt-10">
                <Hipoteca precio={i.precio} />
              </Reveal>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl bg-azul p-6 shadow-[0_20px_50px_-25px_rgba(31,58,95,.5)] ring-1 ring-azul-medio">
              <Precio i={i} grande />
              <p className="mt-4 text-sm text-tinta">¿Te interesa? Te atendemos al momento.</p>
              <div className="mt-4 grid gap-3">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-naranja w-full">
                  <IconoWhatsApp className="h-5 w-5" /> Preguntar por WhatsApp
                </a>
                <a href={`tel:${empresa.telefonoLink}`} className="btn-borde w-full bg-white">
                  <IconoTelefono className="h-5 w-5" /> Llamar al {empresa.telefono}
                </a>
              </div>
              <p className="mt-4 text-xs text-tinta-suave">{empresa.nombre} · {empresa.direccion}, {empresa.ciudad}</p>
            </div>
          </aside>
        </div>

        {similares.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold sm:text-3xl">También te puede <span className="text-naranja-texto">interesar</span></h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similares.map((s, n) => <TarjetaInmueble key={s.ref} i={s} indice={n} />)}
            </div>
          </section>
        )}
      </div>

      {/* Barra fija en el móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-azul-medio bg-white/95 p-3 backdrop-blur lg:hidden">
        <a href={`tel:${empresa.telefonoLink}`} className="btn-borde !px-3 !py-3 text-sm">
          <IconoTelefono className="h-5 w-5" /> Llamar
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-naranja !px-3 !py-3 text-sm">
          <IconoWhatsApp className="h-5 w-5" /> WhatsApp
        </a>
      </div>
    </article>
  );
}
