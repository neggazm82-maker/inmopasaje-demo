import { empresa } from "@/data/empresa";

export default function DatosTitular() {
  return (
    <ul>
      <li>Titular: [PENDIENTE: razón social o nombre del titular] (nombre comercial: {empresa.nombre})</li>
      <li>NIF/CIF: [PENDIENTE]</li>
      <li>Domicilio: {empresa.direccion}, {empresa.cp} {empresa.ciudad} ({empresa.provincia})</li>
      <li>Teléfono: {empresa.telefono}</li>
      <li>Email: {empresa.email}</li>
      <li>Datos registrales: [PENDIENTE: Registro Mercantil, tomo, folio y hoja, si es sociedad]</li>
      <li>Inscripción en el Registro de Agentes Inmobiliarios de Andalucía: [PENDIENTE: número, si procede]</li>
    </ul>
  );
}
