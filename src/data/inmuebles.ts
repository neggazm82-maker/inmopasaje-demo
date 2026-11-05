// =====================================================================
//  INMUEBLES DE MUESTRA
//  Copiados de www.inmopasaje.es el 05/11/2026 (precios y datos tal cual).
//  En la web final esta lista se rellenará sola desde Inmovilla.
//
//  Para cambiar un inmueble a mano: edita sus datos entre { } y guarda.
//   - precio: número sin puntos (129900 = 129.900 €). En alquiler, € al mes.
//   - precioAnterior: solo si está rebajado (se muestra tachado).
//   - nuevo: true  -> muestra la etiqueta "Nuevo".
//   - fotos: rutas dentro de la carpeta /public.
// =====================================================================

export type Operacion = "venta" | "alquiler";
export type Categoria = "piso" | "casa" | "local" | "cochera" | "solar";

export interface Inmueble {
  ref: string;
  codigo: number;
  operacion: Operacion;
  tipo: string;
  categoria: Categoria;
  titulo: string;
  zona: string;
  precio: number;
  precioAnterior?: number;
  nuevo?: boolean;
  m2Construidos?: number;
  m2Utiles?: number;
  m2Parcela?: number;
  habitaciones?: number;
  banos?: number;
  planta?: number;
  conservacion?: string;
  antiguedad?: number;
  gastosComunidad?: string;
  ibi?: string;
  caracteristicas: string[];
  descripcion: string[];
  fotos: string[];
  lat: number;
  lng: number;
  fechaAlta: string;
  urlOriginal: string;
}

export const inmuebles: Inmueble[] = [
  {
    "ref": "1440",
    "nuevo": true,
    "codigo": 30595734,
    "operacion": "venta",
    "tipo": "Piso",
    "categoria": "piso",
    "titulo": "Piso con piscina, garaje y trastero en pleno centro",
    "zona": "Centro Ciudad",
    "precio": 129900,
    "m2Construidos": 75,
    "m2Utiles": 68.18,
    "habitaciones": 2,
    "banos": 2,
    "planta": 1,
    "conservacion": "Buen estado",
    "antiguedad": 2005,
    "ibi": "277€",
    "caracteristicas": [
      "Garaje incluido",
      "Patio",
      "Ascensor",
      "Trastero",
      "Calefacción",
      "Aire acondicionado",
      "Piscina comunitaria",
      "Acceso sin barreras (PMR)",
      "Luminoso",
      "Preinstalación de aire acondicionado",
      "Urbanización con zonas comunes",
      "Exterior"
    ],
    "descripcion": [
      "Si buscas una vivienda cómoda, bien ubicada y con excelentes prestaciones, ¡esta puede ser tu oportunidad! Te presentamos este magnífico piso situado en un residencial con piscina en la calle Santiago, en pleno centro de Linares. Su excelente ubicación te permitirá disfrutar de comercios, servicios y todas las comodidades del día a día a pocos pasos de casa.",
      "La vivienda cuenta con 75,99 m² construidos y 68,50 m² útiles y se encuentra en un moderno edificio construido en 2005, con acceso sin barreras arquitectónicas y amplio ascensor.",
      "En su interior encontrarás un amplio y luminoso salón, dos dormitorios, uno de ellos con armario empotrado, una espaciosa cocina amueblada con acceso a lavadero y patio, y un amplio cuarto de baño completo. Una distribución práctica y funcional que aprovecha el espacio para ofrecer un hogar acogedor y confortable.",
      "En cuanto a sus calidades, destacan la elegante solería de mármol, las puertas lacadas en blanco, la preinstalación de aire acondicionado y la calefacción por gas natural. Además, dispone de un split de aire acondicionado frío/calor en el salón, para disfrutar de una temperatura agradable durante todo el año.",
      "Como valor añadido, la vivienda incluye una amplia plaza de garaje y un espacioso trastero, ambos situados en el mismo edificio, aportando un extra de comodidad y espacio de almacenamiento.",
      "Todo ello en un residencial con piscina y en pleno centro de Linares, una combinación ideal para quienes desean disfrutar de una ubicación privilegiada sin renunciar a las comodidades de un buen residencial.",
      "¡No dejes pasar esta oportunidad y ven a visitarlo!"
    ],
    "fotos": [
      "/inmuebles/30595734/1.jpg",
      "/inmuebles/30595734/2.jpg",
      "/inmuebles/30595734/3.jpg",
      "/inmuebles/30595734/4.jpg",
      "/inmuebles/30595734/5.jpg",
      "/inmuebles/30595734/6.jpg",
      "/inmuebles/30595734/7.jpg",
      "/inmuebles/30595734/8.jpg",
      "/inmuebles/30595734/9.jpg",
      "/inmuebles/30595734/10.jpg",
      "/inmuebles/30595734/11.jpg",
      "/inmuebles/30595734/12.jpg"
    ],
    "lat": 38.094848,
    "lng": -3.637386,
    "fechaAlta": "2026-10-27",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=30595734.13080&idio=1"
  },
  {
    "ref": "1401",
    "codigo": 29450725,
    "operacion": "venta",
    "tipo": "Piso",
    "categoria": "piso",
    "titulo": "Piso de 4 dormitorios en Calle Yanguas Mesías",
    "zona": "Centro Ciudad",
    "precio": 129900,
    "precioAnterior": 139000,
    "m2Construidos": 146.61,
    "habitaciones": 4,
    "banos": 2,
    "planta": 3,
    "conservacion": "Semireformado",
    "antiguedad": 1983,
    "gastosComunidad": "75€",
    "ibi": "311€",
    "caracteristicas": [
      "Ascensor",
      "Lavandería",
      "Exterior"
    ],
    "descripcion": [
      "Descubre esta magnífica vivienda situada en Calle Yanguas Mesías, una de las ubicaciones más privilegiadas de Linares, a escasos metros de Plaza San Francisco y rodeada de todos los servicios, comercios, colegios, zonas de ocio y transporte.",
      "Con una superficie construida de 146,61 m², este espacioso piso ofrece una distribución cómoda y funcional, ideal para familias que buscan amplitud y una ubicación inmejorable. La vivienda dispone de un amplio salón, cuatro dormitorios, cocina con despensa y lavadero y dos cuartos de baño, proporcionando estancias luminosas y versátiles para adaptarlas a las necesidades de cada hogar.",
      "El inmueble ha sido parcialmente reformado, destacando la renovación de la cocina y los dos cuartos de baño. La cocina, moderna y funcional, cuenta además con despensa y lavadero independiente, aportando un extra de comodidad para el día a día. Asimismo, las paredes se encuentran alisadas en el salón y en dos de los dormitorios, mejorando la estética y el acabado de la vivienda.",
      "Ubicado en un edificio con ascensor de tres plazas y acceso sin barreras arquitectónicas, resulta especialmente cómodo y accesible para personas con movilidad reducida, familias con niños o personas mayores.",
      "Destaca por sus generosas dimensiones, su excelente ubicación y las múltiples posibilidades que ofrece para adaptarlo a las necesidades de su futuro propietario, convirtiéndose en una excelente oportunidad tanto como vivienda habitual como inversión.",
      "Solicite más información y concertemos una visita."
    ],
    "fotos": [
      "/inmuebles/29450725/1.jpg",
      "/inmuebles/29450725/2.jpg",
      "/inmuebles/29450725/3.jpg",
      "/inmuebles/29450725/4.jpg",
      "/inmuebles/29450725/5.jpg",
      "/inmuebles/29450725/6.jpg",
      "/inmuebles/29450725/7.jpg",
      "/inmuebles/29450725/8.jpg",
      "/inmuebles/29450725/9.jpg",
      "/inmuebles/29450725/10.jpg",
      "/inmuebles/29450725/11.jpg",
      "/inmuebles/29450725/12.jpg"
    ],
    "lat": 38.09438,
    "lng": -3.632697,
    "fechaAlta": "2026-06-18",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=29450725.13080&idio=1"
  },
  {
    "ref": "1388",
    "codigo": 29324846,
    "operacion": "venta",
    "tipo": "Piso",
    "categoria": "piso",
    "titulo": "Piso con terraza en Calle La Cruz",
    "zona": "Linarejos",
    "precio": 135000,
    "precioAnterior": 145000,
    "m2Construidos": 120,
    "habitaciones": 4,
    "banos": 2,
    "planta": 5,
    "conservacion": "Buen estado",
    "antiguedad": 1976,
    "caracteristicas": [
      "Terraza",
      "Ascensor",
      "Armarios empotrados",
      "Aire acondicionado",
      "Luminoso",
      "Exterior"
    ],
    "descripcion": [
      "¡Espacio, comodidad y una excelente ubicación en un solo hogar!",
      "Descubra este amplio piso situado en Calle La Cruz, una vivienda ideal para familias que buscan amplitud, funcionalidad y todos los servicios al alcance de la mano.",
      "Esta vivienda destaca por su luminoso salón con acceso a una magnífica terraza, un espacio perfecto para relajarse, disfrutar del aire libre o compartir momentos en familia. Dispone además de cocina independiente con lavadero cerrado, sala de estar, tres dormitorios y dos cuartos de baño, uno de ellos reformado y equipado con moderno plato de ducha.",
      "Entre sus calidades, cabe destacar la instalación de dos equipos de aire acondicionado frío/calor, que garantizan el máximo confort durante todo el año y un armario empotrado en uno de los dormitorios.",
      "El edificio cuenta con ascensor, aportando comodidad y accesibilidad para el día a día.",
      "Una vivienda amplia y bien distribuida, perfecta para quienes valoran el espacio y una ubicación consolidada. Solicite más información y venga a visitarla sin compromiso."
    ],
    "fotos": [
      "/inmuebles/29324846/1.jpg",
      "/inmuebles/29324846/2.jpg",
      "/inmuebles/29324846/3.jpg",
      "/inmuebles/29324846/4.jpg",
      "/inmuebles/29324846/5.jpg",
      "/inmuebles/29324846/6.jpg",
      "/inmuebles/29324846/7.jpg",
      "/inmuebles/29324846/8.jpg",
      "/inmuebles/29324846/9.jpg",
      "/inmuebles/29324846/10.jpg",
      "/inmuebles/29324846/11.jpg",
      "/inmuebles/29324846/12.jpg"
    ],
    "lat": 38.099101,
    "lng": -3.632616,
    "fechaAlta": "2026-06-03",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=29324846.13080&idio=1"
  },
  {
    "ref": "1356",
    "codigo": 28593329,
    "operacion": "venta",
    "tipo": "Casa",
    "categoria": "casa",
    "titulo": "Casa de dos plantas en el barrio de Belén",
    "zona": "La Zarzuela-San José-Belén",
    "precio": 62000,
    "precioAnterior": 80000,
    "m2Construidos": 158,
    "m2Parcela": 106.58,
    "habitaciones": 6,
    "banos": 2,
    "conservacion": "Para reformar",
    "antiguedad": 1960,
    "ibi": "206.38€",
    "caracteristicas": [
      "Patio",
      "Exterior"
    ],
    "descripcion": [
      "La vivienda se encuentra en el barrio Belén, un barrio tranquilo y bien conectado, ideal tanto para quienes buscan residencia habitual como para inversores interesados en un proyecto de reforma integral.",
      "Se trata de una casa de dos plantas con una superficie construida de 156 m², actualmente distribuida en salón-estar, cinco dormitorios, cocina, dos baños, amplio patio y azotea. La propiedad ofrece amplias posibilidades de redistribución y personalización, permitiendo adaptar cada espacio a diferentes necesidades y estilos de vida.",
      "La casa necesita REFORMA COMPLETA, incluyendo el tejado, lo que brinda una oportunidad única para diseñar un hogar totalmente a medida. Con su tamaño y distribución, se pueden crear espacios amplios y funcionales, potenciando al máximo su superficie.",
      "Una opción interesante para quienes buscan una casa con carácter y muchas posibilidades en una ubicación con encanto."
    ],
    "fotos": [
      "/inmuebles/28593329/1.jpg",
      "/inmuebles/28593329/2.jpg",
      "/inmuebles/28593329/3.jpg",
      "/inmuebles/28593329/4.jpg",
      "/inmuebles/28593329/5.jpg",
      "/inmuebles/28593329/6.jpg",
      "/inmuebles/28593329/7.jpg",
      "/inmuebles/28593329/8.jpg",
      "/inmuebles/28593329/9.jpg",
      "/inmuebles/28593329/10.jpg",
      "/inmuebles/28593329/11.jpg",
      "/inmuebles/28593329/12.jpg"
    ],
    "lat": 38.100577,
    "lng": -3.639812,
    "fechaAlta": "2026-03-25",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=28593329.13080&idio=1"
  },
  {
    "ref": "1425",
    "codigo": 30310415,
    "operacion": "venta",
    "tipo": "Piso",
    "categoria": "piso",
    "titulo": "Piso de 3 dormitorios junto a Calle Tetuán",
    "zona": "Centro Ciudad",
    "precio": 72000,
    "m2Construidos": 89,
    "habitaciones": 3,
    "banos": 1,
    "conservacion": "Para reformar",
    "antiguedad": 1970,
    "gastosComunidad": "60€ / Mensual",
    "ibi": "185€",
    "caracteristicas": [
      "Ascensor",
      "Exterior"
    ],
    "descripcion": [
      "Piso ubicado en la zona de Calle Tetuán, en un edificio con ascensor (con elevador para las escaleras de acceso al mismo)  y rodeado de servicios, comercios y todo lo necesario para el día a día.",
      "La vivienda cuenta con una superficie construida de 89 m² según catastro y necesita reforma, ofreciendo la posibilidad de actualizarla y adaptarla completamente al gusto y necesidades del nuevo propietario. Una buena oportunidad para quienes buscan una vivienda para transformar y conseguir un hogar personalizado.",
      "La distribución actual consta de salón con balcón, tres dormitorios, cocina amueblada con lavadero, trastero y cuarto de baño.",
      "Por sus características y ubicación, es una vivienda con buenas posibilidades, tanto para crear un hogar a medida como para aquellos compradores que busquen una propiedad con potencial de actualización.",
      "Si buscas un piso de tres dormitorios, con ascensor y 89 m² construidos en esta zona de Linares, ven a visitarlo y descubre todo su potencial."
    ],
    "fotos": [
      "/inmuebles/30310415/1.jpg",
      "/inmuebles/30310415/2.jpg",
      "/inmuebles/30310415/3.jpg",
      "/inmuebles/30310415/4.jpg",
      "/inmuebles/30310415/5.jpg",
      "/inmuebles/30310415/6.jpg",
      "/inmuebles/30310415/7.jpg",
      "/inmuebles/30310415/8.jpg",
      "/inmuebles/30310415/9.jpg",
      "/inmuebles/30310415/10.jpg",
      "/inmuebles/30310415/11.jpg",
      "/inmuebles/30310415/12.jpg"
    ],
    "lat": 38.095842,
    "lng": -3.639408,
    "fechaAlta": "2026-09-22",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=30310415.13080&idio=1"
  },
  {
    "ref": "1417",
    "codigo": 29944687,
    "operacion": "venta",
    "tipo": "Piso",
    "categoria": "piso",
    "titulo": "Piso de 5 dormitorios en Avenida de Andalucía",
    "zona": "La Zarzuela-San José-Belén",
    "precio": 198000,
    "m2Construidos": 195,
    "habitaciones": 5,
    "banos": 3,
    "planta": 6,
    "conservacion": "Buen estado",
    "antiguedad": 1978,
    "gastosComunidad": "80€ / Mensual",
    "caracteristicas": [
      "Ascensor",
      "Parking incluido",
      "Exterior"
    ],
    "descripcion": [
      "¡Descubre esta amplia y luminosa vivienda en Avenida de Andalucía, una de las zonas más demandadas de Linares! Un piso de 195 m² construidos (según catastro), semireformado y con grandes posibilidades para convertirse en el hogar que siempre has buscado.",
      "La vivienda cuenta con un elegante hall de entrada que da paso a un amplio y luminoso salón, con acceso directo a un bonito balcón, un espacio perfecto para disfrutar del exterior y aportar luminosidad a la estancia.",
      "Dispone de cinco dormitorios, una característica cada vez más difícil de encontrar, además de dos baños y un aseo. El dormitorio principal cuenta con baño en suite, aportando un extra de comodidad e intimidad.",
      "La cocina se encuentra reformada, amueblada y dispone además de lavadero independiente, ofreciendo un espacio práctico y funcional para el día a día.",
      "El edificio cuenta con ascensor y, además, el precio incluye plaza de garaje y un amplio trastero, dos elementos imprescindibles que aportan comodidad y un importante valor añadido a la vivienda.",
      "Una propiedad ideal para quienes buscan espacio, amplitud, buena ubicación y múltiples posibilidades de distribución, en una de las principales avenidas de Linares.",
      "195 m² construidos · 5 dormitorios · 2 baños + 1 aseo · Balcón · Ascensor · Garaje · Trastero"
    ],
    "fotos": [
      "/inmuebles/29944687/1.jpg",
      "/inmuebles/29944687/2.jpg",
      "/inmuebles/29944687/3.jpg",
      "/inmuebles/29944687/4.jpg",
      "/inmuebles/29944687/5.jpg",
      "/inmuebles/29944687/6.jpg",
      "/inmuebles/29944687/7.jpg",
      "/inmuebles/29944687/8.jpg",
      "/inmuebles/29944687/9.jpg",
      "/inmuebles/29944687/10.jpg",
      "/inmuebles/29944687/11.jpg",
      "/inmuebles/29944687/12.jpg"
    ],
    "lat": 38.09252,
    "lng": -3.642642,
    "fechaAlta": "2026-08-14",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=29944687.13080&idio=1"
  },
  {
    "ref": "1426",
    "codigo": 30347971,
    "operacion": "venta",
    "tipo": "Casa",
    "categoria": "casa",
    "titulo": "Casa con dos viviendas y solar junto al Paseo de Linarejos",
    "zona": "Linarejos",
    "precio": 150000,
    "m2Construidos": 192,
    "habitaciones": 5,
    "banos": 2,
    "conservacion": "Buen estado",
    "antiguedad": 1968,
    "caracteristicas": [
      "Exterior"
    ],
    "descripcion": [
      "Casa unifamiliar situada en la zona de Río Grande, junto a Paseo Linarejos, distribuida en dos viviendas independientes, una en cada planta, y una amplia terraza en la cubierta. La propiedad incluye además un solar de 135 m² con acceso para vehículos y posibilidad de piscina, que se vende conjuntamente con la casa.",
      "La vivienda de la planta baja, está distribuida en salón, cocina, tres dormitorios, cuarto de baño y patio con acceso directo al solar.",
      "La vivienda de la primera planta, está distribuida en salón, tres dormitorios, cocina y cuarto de baño. Su distribución independiente permite disponer de dos espacios diferenciados dentro de la misma propiedad, una opción interesante para familias que necesitan más espacio o desean contar con zonas de vivienda separadas.",
      "En la tercera planta encontramos una amplia terraza en la cubierta, ideal para disfrutar del aire libre y aprovechar el espacio exterior.",
      "La propiedad se completa con un solar de 135 m², que dispone de acceso para vehículos y una piscina actualmente fuera de uso, ofreciendo un espacio adicional con múltiples posibilidades de aprovechamiento.",
      "En conjunto, se trata de una propiedad con dos viviendas independientes, cinco dormitorios, dos cocinas, varios espacios de estar, patio, terraza y solar, ideal para quienes buscan amplitud, versatilidad y diferentes posibilidades de uso.",
      "La venta comprende conjuntamente las dos viviendas y el solar, ofreciendo una oportunidad interesante en la zona de Río Grande.",
      "Consulte con nosotros para ampliar información y concertar una visita."
    ],
    "fotos": [
      "/inmuebles/30347971/1.jpg",
      "/inmuebles/30347971/2.jpg",
      "/inmuebles/30347971/3.jpg",
      "/inmuebles/30347971/4.jpg",
      "/inmuebles/30347971/5.jpg",
      "/inmuebles/30347971/6.jpg",
      "/inmuebles/30347971/7.jpg",
      "/inmuebles/30347971/8.jpg",
      "/inmuebles/30347971/9.jpg",
      "/inmuebles/30347971/10.jpg",
      "/inmuebles/30347971/11.jpg",
      "/inmuebles/30347971/12.jpg"
    ],
    "lat": 38.102181,
    "lng": -3.627244,
    "fechaAlta": "2026-09-25",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=30347971.13080&idio=1"
  },
  {
    "ref": "1389",
    "codigo": 29322171,
    "operacion": "alquiler",
    "tipo": "Local comercial",
    "categoria": "local",
    "titulo": "Local comercial en esquina en Calle Sagunto",
    "zona": "Centro Ciudad",
    "precio": 700,
    "m2Construidos": 117,
    "conservacion": "Buen estado",
    "antiguedad": 1977,
    "caracteristicas": [
      "Exterior"
    ],
    "descripcion": [
      "Se alquila local comercial en Calle Sagunto, haciendo esquina con Calle Menéndez Pelayo, en una ubicación con gran visibilidad y paso de público.",
      "El inmueble cuenta con una superficie construida de 117 m² y dispone de amplios escaparates en fachada, lo que le proporciona una excelente exposición comercial y abundante luz natural.",
      "Gracias a su situación en esquina y a sus amplias posibilidades de distribución, resulta ideal para la implantación de cualquier tipo de negocio, oficina o actividad profesional.",
      "Se requieren dos meses de fianza. Existe la posibilidad de negociar un período de carencia para facilitar la adecuación y puesta en marcha de la actividad, según proyecto y condiciones.",
      "No deje pasar esta oportunidad y solicite más información sin compromiso."
    ],
    "fotos": [
      "/inmuebles/29322171/1.jpg",
      "/inmuebles/29322171/2.jpg",
      "/inmuebles/29322171/3.jpg",
      "/inmuebles/29322171/4.jpg",
      "/inmuebles/29322171/5.jpg",
      "/inmuebles/29322171/6.jpg",
      "/inmuebles/29322171/7.jpg",
      "/inmuebles/29322171/8.jpg",
      "/inmuebles/29322171/9.jpg",
      "/inmuebles/29322171/10.jpg",
      "/inmuebles/29322171/11.jpg",
      "/inmuebles/29322171/12.jpg"
    ],
    "lat": 38.093673,
    "lng": -3.630721,
    "fechaAlta": "2026-06-03",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=29322171.13080&idio=1"
  },
  {
    "ref": "1429",
    "codigo": 30368035,
    "operacion": "venta",
    "tipo": "Garaje",
    "categoria": "cochera",
    "titulo": "Plaza de garaje en Calle Castelar",
    "zona": "Centro Ciudad",
    "precio": 7600,
    "precioAnterior": 8000,
    "m2Construidos": 34,
    "conservacion": "Buen estado",
    "antiguedad": 2004,
    "caracteristicas": [
      "Exterior"
    ],
    "descripcion": [
      "Plaza de garaje situada en Calle Castelar, en pleno centro de Linares, una ubicación muy cómoda, próxima a comercios, servicios y principales puntos de interés de la ciudad.",
      "Cuenta con unas medidas aproximadas de 2,20 x 5,30 metros, con una superficie de 11,66 m². Por sus dimensiones, es adecuada para un coche pequeño.",
      "Una opción práctica para disponer de aparcamiento propio en una de las zonas más céntricas de Linares, tanto para uso particular como para inversión."
    ],
    "fotos": [
      "/inmuebles/30368035/1.jpg",
      "/inmuebles/30368035/2.jpg",
      "/inmuebles/30368035/3.jpg",
      "/inmuebles/30368035/4.jpg",
      "/inmuebles/30368035/5.jpg",
      "/inmuebles/30368035/6.jpg",
      "/inmuebles/30368035/7.jpg",
      "/inmuebles/30368035/8.jpg",
      "/inmuebles/30368035/9.jpg"
    ],
    "lat": 38.096148,
    "lng": -3.63718,
    "fechaAlta": "2026-09-29",
    "urlOriginal": "https://www.inmopasaje.es/fichapropiedad.php?datoofe=30368035.13080&idio=1"
  }
];
