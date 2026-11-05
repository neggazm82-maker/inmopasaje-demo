import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";
import DatosTitular from "@/components/DatosTitular";

export const metadata: Metadata = { title: "Aviso legal" };

export default function AvisoLegal() {
  return (
    <PaginaLegal titulo="Aviso legal">
      <h2>1. Datos del titular</h2>
      <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de esta web:</p>
      <DatosTitular />
      <h2>2. Objeto</h2>
      <p>Esta web informa sobre los servicios de intermediación inmobiliaria de la empresa: venta, alquiler, alquiler de temporada, alquiler con opción a compra, traspasos, obra nueva y valoración de inmuebles.</p>
      <h2>3. Información de los inmuebles</h2>
      <p>Los datos, fotografías y precios de los inmuebles son orientativos y no tienen valor contractual. De acuerdo con el Decreto 218/2005 de la Junta de Andalucía, los gastos notariales, registrales, de gestoría, impuestos y honorarios de intermediación no están incluidos en el precio salvo que se indique lo contrario. El consumidor tiene derecho a solicitar el documento informativo abreviado de cada vivienda.</p>
      <h2>4. Propiedad intelectual</h2>
      <p>Los textos, fotografías, logotipos y diseño de esta web pertenecen a su titular o se usan con autorización. No se permite su reproducción sin permiso.</p>
      <h2>5. Responsabilidad</h2>
      <p>El titular no se hace responsable del mal uso de la web ni de los contenidos de webs externas a las que se enlace.</p>
      <h2>6. Legislación aplicable</h2>
      <p>Este aviso se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan según la ley.</p>
    </PaginaLegal>
  );
}
