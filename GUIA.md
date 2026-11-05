# Demo web — Inmobiliaria El Pasaje

## Publicarla gratis en Netlify (sin programar)
1. Descomprime `inmopasaje-demo-web.zip`: sale una carpeta llamada `web`.
2. Entra en https://app.netlify.com/drop (crea una cuenta gratis si te lo pide).
3. Arrastra la carpeta `web` al recuadro. En unos segundos te da un enlace tipo `https://nombre-raro.netlify.app`.
4. Para cambiar el nombre: *Site configuration → Change site name* (por ejemplo `inmopasaje-demo`).

### Que los formularios lleguen por email
1. En Netlify, entra en tu sitio → **Forms** → pulsa **Enable form detection**.
2. Vuelve a arrastrar la carpeta `web` (en *Deploys*), para que Netlify detecte los 3 formularios: `valoracion`, `avisame` y `contacto`.
3. **Forms → Form notifications → Add notification → Email notification**: pon el email del gerente.
   Repite para cada formulario (o elige "Any form").
4. Prueba la valoración desde el móvil: el email llega en un minuto. Gratis hasta 100 envíos al mes.

## Cambiar datos
- Inmuebles: `src/data/inmuebles.ts`
- Teléfono, email, horario, cifras: `src/data/empresa.ts`
- Zonas del asistente de valoración: `src/data/zonas.ts`
Después de cambiar algo hay que volver a generar la web (`npm run build`) y subir la carpeta `out`.

## Pendiente de la empresa ([PENDIENTE] en la web)
- Horario de apertura.
- Número de familias atendidas.
- Confirmar "desde 1991" (sale en su logo).
- Razón social, NIF, datos registrales y nº de agente inmobiliario (textos legales).
- Texto de "Sobre nosotros" y foto del equipo o la oficina.
