# Web Inmobiliaria El Pasaje — Guía

## 1. Publicar la web en Netlify
**Opción A, conectada a GitHub (recomendada: se actualiza sola):**
1. https://app.netlify.com → **Add new project → Import an existing project → GitHub** → elige `inmopasaje-demo`.
2. No cambies nada (el archivo `netlify.toml` ya dice cómo construirla) → **Deploy**.

**Opción B, arrastrando la carpeta:** descomprime el .zip y arrastra la carpeta `web` a https://app.netlify.com/drop.

**Emails de los formularios:** en Netlify → **Forms** → **Enable form detection** → vuelve a publicar →
**Form notifications → Add notification → Email** con el email del gerente.

---

## 2. El panel de gestión: `/admin`
Dirección: `https://TU-WEB.netlify.app/admin/`

- **Inmuebles:** añadir, editar, marcar como vendido/alquilado, ocultar y eliminar. Al guardar, sale en la web al momento.
- **Solicitudes:** valoraciones, "Avísame" y contacto, con botones de llamar, WhatsApp, marcar como atendida y descargar Excel.

### Modo demo (mientras no se conecte Supabase)
- Entra con **demo@inmopasaje.es** / **demo1234**.
- Todo funciona, pero **los cambios se guardan solo en el navegador que los hace** (sirve para enseñarlo).

---

## 3. Conectar Supabase (datos reales y compartidos) — unos 15 minutos
Supabase es el "almacén" de la web: guarda los inmuebles, las fotos, las solicitudes y los usuarios. Plan gratuito.

1. Crea una cuenta en https://supabase.com y pulsa **New project**.
   - Nombre: `inmopasaje` · Región: **Europe (Frankfurt o París)** · Pon una contraseña de base de datos y guárdala.
2. Cuando termine de crearse, ve a **SQL Editor → New query**:
   - Copia y pega TODO el archivo `supabase/1-crear-base-de-datos.sql` → **Run**.
   - Nueva query con `supabase/2-inmuebles-de-muestra.sql` → **Run** (opcional: carga los 9 pisos de muestra).
3. **Project Settings → API**, copia dos datos:
   - **Project URL** (algo como `https://abcd.supabase.co`)
   - **anon public** key (una clave larga). ⚠️ No uses nunca la clave `service_role`.
4. En Netlify → **Site configuration → Environment variables → Add a variable**:
   - `NEXT_PUBLIC_SUPABASE_URL` = el Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = la clave anon public
   - Después: **Deploys → Trigger deploy → Deploy site**.
5. En Supabase → **Authentication → URL Configuration**:
   - **Site URL**: `https://TU-WEB.netlify.app`
   - **Redirect URLs** → Add URL: `https://TU-WEB.netlify.app/admin/nueva-clave/`
   (Así funciona el enlace de "¿Has olvidado tu contraseña?".)
6. Recomendado: **Authentication → Sign In / Providers → Email** → desactiva **Allow new users to sign up**
   (así nadie puede crearse una cuenta por su cuenta).

---

## 4. Crear los usuarios del cliente
Cada persona que vaya a usar el panel necesita **dos pasos**:

**Paso 1 — Crear el usuario**
Supabase → **Authentication → Users → Add user → Create new user**
- Email del gerente, una contraseña provisional, y marca **Auto Confirm User** → **Create user**.

**Paso 2 — Darle permiso de panel**
Supabase → **Table Editor → equipo → Insert → Insert row**
- `email`: el mismo email · `nombre`: su nombre → **Save**.
(O con el archivo `supabase/3-anadir-usuario-al-equipo.sql` en el SQL Editor.)

Listo: ya puede entrar en `/admin`. Si quiere su propia contraseña, que pulse **"¿Has olvidado tu contraseña?"**:
le llega un email para crearla.

**Quitar a alguien:** bórralo de la tabla `equipo` (deja de poder gestionar) y, si quieres, también de Authentication → Users.

> Los emails de "olvidé mi contraseña" los envía Supabase gratis, con un límite de pocos al día. Si se usan mucho,
> en Supabase se puede configurar un servicio de correo propio (Authentication → Emails → SMTP).

---

## 5. Instalar el panel como app en el móvil
- **iPhone (Safari):** abre `/admin` → botón **Compartir** (cuadrado con flecha) → **Añadir a pantalla de inicio**.
- **Android (Chrome):** abre `/admin` → menú **⋮** → **Instalar aplicación** (o **Añadir a pantalla de inicio**).

Aparece el icono "El Pasaje" y se abre a pantalla completa, como una app.

---

## 6. Cambiar textos y datos fijos
- Teléfono, email, horario, cifras: `src/data/empresa.ts`
- Zonas de Linares: `src/data/zonas.ts`

## Pendiente de la empresa ([PENDIENTE] en la web)
Horario · familias atendidas · confirmar "desde 1991" · razón social, NIF, registro y nº de agente (textos legales) ·
texto y foto de "Sobre nosotros".
