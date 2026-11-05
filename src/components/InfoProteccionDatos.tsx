import Link from "next/link";
import { empresa } from "@/data/empresa";

/** Primera capa informativa (RGPD) que se muestra junto a cada formulario. */
export default function InfoProteccionDatos({ finalidad }: { finalidad: string }) {
  return (
    <details className="rounded-2xl bg-azul/50 p-4 text-xs leading-relaxed text-tinta-suave">
      <summary className="cursor-pointer font-semibold text-tinta">Información básica sobre protección de datos</summary>
      <dl className="mt-2 grid gap-1 sm:grid-cols-[110px_1fr]">
        <dt className="font-semibold">Responsable:</dt><dd>{empresa.nombre} [PENDIENTE: razón social y NIF]</dd>
        <dt className="font-semibold">Finalidad:</dt><dd>{finalidad}</dd>
        <dt className="font-semibold">Legitimación:</dt><dd>Tu consentimiento al enviar este formulario.</dd>
        <dt className="font-semibold">Destinatarios:</dt><dd>No se cederán datos a terceros, salvo obligación legal.</dd>
        <dt className="font-semibold">Derechos:</dt><dd>Acceso, rectificación, supresión, oposición y portabilidad escribiendo a {empresa.email}.</dd>
      </dl>
      <p className="mt-2">Más información en la <Link href="/privacidad/" className="font-semibold text-tinta underline">política de privacidad</Link>.</p>
    </details>
  );
}
