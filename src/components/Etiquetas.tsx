import type { Inmueble } from "@/data/inmuebles";
import { etiquetas, cn } from "@/lib/utils";

export default function Etiquetas({ i, className }: { i: Inmueble & { estado?: string }; className?: string }) {
  const e = etiquetas(i);
  if (!e.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {e.map((x) => (
        <span
          key={x.texto}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm",
            x.estilo === "naranja" ? "bg-naranja text-tinta" : x.estilo === "oscuro" ? "bg-tinta text-white" : "bg-azul text-tinta ring-1 ring-azul-medio",
          )}
        >
          {x.texto}
        </span>
      ))}
    </div>
  );
}
