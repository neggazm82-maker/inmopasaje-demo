import type { Inmueble } from "@/data/inmuebles";
import { euros, precioTexto, rebaja, cn } from "@/lib/utils";

/** Precio con explicación clara de la rebaja: antes tachado, ahora destacado. */
export default function Precio({ i, grande = false }: { i: Inmueble; grande?: boolean }) {
  const r = rebaja(i);
  return (
    <div>
      {r && (
        <p className={cn("flex flex-wrap items-center gap-x-2 text-tinta-suave", grande ? "text-base" : "text-sm")}>
          <span>Antes</span>
          <span className="line-through decoration-2 decoration-tinta-suave/70">{euros(i.precioAnterior!)}</span>
          <span className="rounded-full bg-azul px-2 py-0.5 text-xs font-semibold text-tinta">−{r.pct}%</span>
        </p>
      )}
      <p className={cn("font-bold tracking-tight text-naranja-texto", grande ? "text-4xl sm:text-5xl" : "text-2xl")}>
        {r && <span className={cn("mr-1 font-semibold text-tinta", grande ? "text-lg" : "text-sm")}>Ahora</span>}
        {precioTexto(i)}
      </p>
      {r && grande && <p className="mt-1 text-sm font-medium text-tinta">Te ahorras {euros(r.ahorro)} respecto al precio anterior</p>}
    </div>
  );
}
