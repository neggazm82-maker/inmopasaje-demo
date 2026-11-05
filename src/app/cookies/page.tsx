import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";

export const metadata: Metadata = { title: "Política de cookies" };

export default function Cookies() {
  return (
    <PaginaLegal titulo="Política de cookies">
      <h2>¿Qué son las cookies?</h2>
      <p>Son pequeños archivos que una web guarda en tu navegador para recordar información sobre tu visita.</p>
      <h2>Cookies que usa esta web</h2>
      <p>Esta web <strong>no utiliza cookies de publicidad ni de análisis</strong>. Solo puede usar elementos técnicos necesarios para que funcione, que no necesitan tu consentimiento.</p>
      <p>Los mapas se cargan desde OpenStreetMap, que recibe tu dirección IP para poder mostrar el mapa, y el botón de WhatsApp abre la aplicación o la web de WhatsApp, que tiene su propia política de privacidad.</p>
      <p>[PENDIENTE: si en la web final se añade Google Analytics, Facebook u otras herramientas de medición, habrá que mostrar un aviso de cookies y pedir consentimiento antes de activarlas.]</p>
      <h2>Cómo desactivarlas</h2>
      <p>Puedes borrar o bloquear las cookies desde la configuración de tu navegador (Chrome, Safari, Firefox o Edge).</p>
    </PaginaLegal>
  );
}
