import type { Metadata } from "next";
import ListaInmuebles from "./ListaInmuebles";

export const metadata: Metadata = { title: "Inmuebles" };

export default function Pagina() {
  return <ListaInmuebles />;
}
