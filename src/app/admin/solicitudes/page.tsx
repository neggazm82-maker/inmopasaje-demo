import type { Metadata } from "next";
import Solicitudes from "./Solicitudes";

export const metadata: Metadata = { title: "Solicitudes" };

export default function Pagina() {
  return <Solicitudes />;
}
