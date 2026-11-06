import type { Inmueble } from "@/data/inmuebles";

/** 129900 -> "129.900" (siempre con punto de miles, también en 4 cifras). */
export const miles = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const euros = (n: number) => miles(n) + " €";

export const m2 = (n: number) =>
  new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(n) + " m²";

export const precioTexto = (i: Inmueble) =>
  euros(i.precio) + (i.operacion === "alquiler" ? "/mes" : "");

export const rebaja = (i: Inmueble) =>
  i.precioAnterior && i.precioAnterior > i.precio
    ? { ahorro: i.precioAnterior - i.precio, pct: Math.round((1 - i.precio / i.precioAnterior) * 100) }
    : null;

export const etiquetas = (i: Inmueble & { estado?: string }) => {
  const e: { texto: string; estilo: "naranja" | "azul" | "oscuro" }[] = [];
  if (i.estado === "vendido") return [{ texto: "Vendido", estilo: "oscuro" as const }];
  if (i.estado === "alquilado") return [{ texto: "Alquilado", estilo: "oscuro" as const }];
  if (i.nuevo) e.push({ texto: "Nuevo", estilo: "naranja" });
  if (rebaja(i)) e.push({ texto: "Rebajado", estilo: "naranja" });
  if (i.operacion === "alquiler") e.push({ texto: "Alquiler", estilo: "azul" });
  return e;
};

export const nombreCategoria: Record<string, string> = {
  piso: "Piso",
  casa: "Casa",
  local: "Local",
  cochera: "Cochera",
  solar: "Solar",
};

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
