import type { Metadata } from "next";
import Ficha from "./Ficha";

export const metadata: Metadata = { title: "Inmueble en Linares" };

// Una sola página para todas las fichas: /inmuebles/1440/ se sirve desde aquí
// (regla en netlify.toml), así los inmuebles nuevos del panel tienen ficha al momento.
export default function PaginaFicha() {
  return <Ficha />;
}
