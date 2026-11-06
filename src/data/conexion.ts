// =====================================================================
//  CONEXIÓN CON SUPABASE (base de datos, fotos y usuarios del panel)
//  Si estos dos datos están vacíos, el panel /admin funciona en MODO DEMO:
//  los cambios se guardan solo en el navegador que los hace.
//
//  Se rellenan en Netlify (Site configuration → Environment variables):
//    NEXT_PUBLIC_SUPABASE_URL       → "Project URL" de Supabase
//    NEXT_PUBLIC_SUPABASE_ANON_KEY  → clave "anon public" de Supabase
//  (o escribiéndolos aquí abajo). La clave "anon" está pensada para ir en la
//  web: es pública. NUNCA pongas aquí la clave "service_role".
// =====================================================================
export const conexion = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  claveAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
};

/** Sin los dos datos de Supabase, el panel y la web funcionan en modo demo. */
export const modoDemo = !(conexion.url && conexion.claveAnon);
