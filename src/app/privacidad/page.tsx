import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";
import DatosTitular from "@/components/DatosTitular";
import { empresa } from "@/data/empresa";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <h2>1. Responsable del tratamiento</h2>
      <DatosTitular />
      <h2>2. Qué datos recogemos y para qué</h2>
      <ul>
        <li><strong>Formulario de contacto:</strong> nombre, teléfono, email y mensaje, para responder a tu consulta.</li>
        <li><strong>Valoración de tu inmueble:</strong> datos y fotos del inmueble y tus datos de contacto, para estudiar el inmueble y llamarte con la valoración y, si lo deseas, ofrecerlo en venta o alquiler.</li>
        <li><strong>Avísame por WhatsApp:</strong> nombre, teléfono y lo que buscas, para avisarte cuando entre un inmueble que encaje.</li>
        <li><strong>WhatsApp y teléfono:</strong> si nos escribes o llamas, usaremos tus datos para atenderte.</li>
      </ul>
      <h2>3. Base legal</h2>
      <p>Tu consentimiento al enviar cada formulario y, en su caso, la aplicación de medidas precontractuales a petición tuya (por ejemplo, organizar una visita o un encargo de venta).</p>
      <h2>4. Cuánto tiempo guardamos los datos</h2>
      <p>Mientras sean necesarios para la finalidad indicada o hasta que pidas su supresión, y después durante los plazos que exija la ley. [PENDIENTE: confirmar plazos con la empresa]</p>
      <h2>5. Destinatarios</h2>
      <p>No cedemos tus datos a terceros salvo obligación legal. Usamos proveedores que tratan los datos por nuestra cuenta (alojamiento web y gestión de formularios: Netlify; gestión inmobiliaria: Inmovilla). [PENDIENTE: confirmar proveedores finales]</p>
      <p>Los datos de los inmuebles que nos encargues podrán mostrarse en esta web, en portales inmobiliarios y a agencias colaboradoras.</p>
      <h2>6. Tus derechos</h2>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad, y retirar tu consentimiento, escribiendo a {empresa.email} o en nuestra oficina de {empresa.direccion}, {empresa.ciudad}. También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
    </PaginaLegal>
  );
}
