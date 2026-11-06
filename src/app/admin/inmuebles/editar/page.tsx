import type { Metadata } from "next";
import Editor from "./Editor";

export const metadata: Metadata = { title: "Inmueble" };

export default function Pagina() {
  return <Editor />;
}
