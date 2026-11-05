// Datos de la inmobiliaria. Cambia aquí y se actualiza en toda la web.
export const empresa = {
  nombre: "Inmobiliaria El Pasaje",
  direccion: "Calle Canalejas, 15",
  cp: "23700",
  ciudad: "Linares",
  provincia: "Jaén",
  telefono: "617 365 204",
  telefonoLink: "+34617365204",
  whatsapp: "34617365204",
  email: "inmobiliariaelpasaje@hotmail.es",
  horario: "[PENDIENTE: horario de apertura]",
  // Punto aproximado de Calle Canalejas en el mapa (OpenStreetMap).
  oficina: { lat: 38.09656, lng: -3.63704 },
  // Cifras para los contadores. Las marcadas como null salen como [PENDIENTE].
  inmueblesDisponibles: 41, // total publicado en inmopasaje.es el 05/11/2026
  // El logo de la empresa dice "desde 1.991". Confirmar con el gerente.
  fundacion: 1991,
  anosEnLinares: (new Date().getFullYear() - 1991) as number | null,
  familiasAtendidas: null as number | null,
};

export const whatsappUrl = (mensaje: string) =>
  `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(mensaje)}`;
