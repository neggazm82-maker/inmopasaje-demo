import type { Metadata } from "next";
import Acceso from "./Acceso";

export const metadata: Metadata = { title: "Acceso" };

export default function PaginaAcceso() {
  return <Acceso />;
}
