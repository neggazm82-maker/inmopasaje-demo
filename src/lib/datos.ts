"use client";

// =====================================================================
//  CAPA DE DATOS
//  Un único sitio para leer y guardar inmuebles, solicitudes y usuarios.
//  - Con Supabase configurado (src/data/conexion.ts): datos reales y compartidos.
//  - Sin Supabase: MODO DEMO, todo se guarda en este navegador.
// =====================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { conexion, modoDemo } from "@/data/conexion";
import { inmuebles as inmueblesIniciales, type Inmueble } from "@/data/inmuebles";
import { leer, escribir } from "./almacenLocal";

export type EstadoInmueble = "disponible" | "vendido" | "alquilado";
export type InmuebleGuardado = Inmueble & { id: string; estado: EstadoInmueble; oculto: boolean };

export type TipoSolicitud = "valoracion" | "avisame" | "contacto";
export interface Solicitud {
  id: string;
  tipo: TipoSolicitud;
  datos: Record<string, string>;
  fotos: string[]; // en Supabase: rutas privadas; en demo: imágenes en línea
  atendida: boolean;
  creado: string;
}

let cliente: SupabaseClient | null = null;
export { modoDemo };
function sb(): SupabaseClient {
  if (!cliente) cliente = createClient(conexion.url, conexion.claveAnon, { auth: { persistSession: true, detectSessionInUrl: true } });
  return cliente;
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));

// ---------------------------------------------------------------- inmuebles

const semilla = (): InmuebleGuardado[] =>
  inmueblesIniciales.map((i) => ({ ...i, id: i.ref, estado: "disponible", oculto: false }));

/** Inmuebles que trae la web ya construida (se muestran al instante mientras llegan los datos). */
export const inmueblesDeInicio = semilla();

const CLAVE_INM = "inmuebles";

type FilaInmueble = { id: string; ref: string; datos: Inmueble; estado: EstadoInmueble; oculto: boolean; orden: number };
const deFila = (f: FilaInmueble): InmuebleGuardado => ({ ...f.datos, ref: f.ref, id: f.id, estado: f.estado, oculto: f.oculto });

export async function listarInmuebles(opciones: { incluirOcultos?: boolean } = {}): Promise<InmuebleGuardado[]> {
  if (modoDemo) {
    const lista = (await leer<InmuebleGuardado[]>(CLAVE_INM)) ?? semilla();
    return opciones.incluirOcultos ? lista : lista.filter((i) => !i.oculto);
  }
  let q = sb().from("inmuebles").select("*").order("orden", { ascending: true }).order("creado", { ascending: false });
  if (!opciones.incluirOcultos) q = q.eq("oculto", false);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data as FilaInmueble[]).map(deFila);
}

export async function guardarInmueble(i: InmuebleGuardado): Promise<InmuebleGuardado> {
  if (modoDemo) {
    const lista = await listarInmuebles({ incluirOcultos: true });
    const k = lista.findIndex((x) => x.id === i.id);
    if (k >= 0) lista[k] = i; else lista.unshift(i);
    await escribir(CLAVE_INM, lista);
    return i;
  }
  const { id, estado, oculto, ...datos } = i;
  const fila = { ref: i.ref, datos, estado, oculto, actualizado: new Date().toISOString() };
  const r = id && !id.startsWith("nuevo-")
    ? await sb().from("inmuebles").update(fila).eq("id", id).select().single()
    : await sb().from("inmuebles").insert(fila).select().single();
  if (r.error) throw new Error(r.error.message);
  return deFila(r.data as FilaInmueble);
}

export async function cambiarInmueble(id: string, cambios: Partial<Pick<InmuebleGuardado, "estado" | "oculto">>) {
  if (modoDemo) {
    const lista = await listarInmuebles({ incluirOcultos: true });
    await escribir(CLAVE_INM, lista.map((x) => (x.id === id ? { ...x, ...cambios } : x)));
    return;
  }
  const { error } = await sb().from("inmuebles").update({ ...cambios, actualizado: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarInmueble(id: string) {
  if (modoDemo) {
    const lista = await listarInmuebles({ incluirOcultos: true });
    await escribir(CLAVE_INM, lista.filter((x) => x.id !== id));
    return;
  }
  const { error } = await sb().from("inmuebles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function siguienteReferencia(): Promise<string> {
  const lista = await listarInmuebles({ incluirOcultos: true });
  const max = Math.max(1440, ...lista.map((i) => Number(i.ref) || 0));
  return String(max + 1);
}

/** Reduce la foto (máx. 1600 px, JPEG) y la sube. Devuelve la dirección para usar en la web. */
export async function subirFotoInmueble(f: File): Promise<string> {
  const ligera = await reducir(f, modoDemo ? 1100 : 1600, modoDemo ? 0.7 : 0.8);
  if (modoDemo) return blobADataUrl(ligera);
  const ruta = `inmuebles/${uid()}.jpg`;
  const { error } = await sb().storage.from("fotos").upload(ruta, ligera, { contentType: "image/jpeg", cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return sb().storage.from("fotos").getPublicUrl(ruta).data.publicUrl;
}

// ---------------------------------------------------------------- solicitudes

const CLAVE_SOL = "solicitudes";

export async function guardarSolicitud(tipo: TipoSolicitud, datos: Record<string, string>, fotos: File[] = []): Promise<void> {
  if (modoDemo) {
    const urls = await Promise.all(fotos.map(async (f) => blobADataUrl(await reducir(f, 900, 0.7))));
    const lista = (await leer<Solicitud[]>(CLAVE_SOL)) ?? [];
    lista.unshift({ id: uid(), tipo, datos, fotos: urls, atendida: false, creado: new Date().toISOString() });
    await escribir(CLAVE_SOL, lista);
    return;
  }
  const rutas: string[] = [];
  for (const f of fotos) {
    const ruta = `${tipo}/${uid()}.jpg`;
    const { error } = await sb().storage.from("solicitudes").upload(ruta, f, { contentType: f.type || "image/jpeg" });
    if (!error) rutas.push(ruta);
  }
  const { error } = await sb().from("solicitudes").insert({ tipo, datos, fotos: rutas });
  if (error) throw new Error(error.message);
}

export async function listarSolicitudes(): Promise<Solicitud[]> {
  if (modoDemo) return (await leer<Solicitud[]>(CLAVE_SOL)) ?? [];
  const { data, error } = await sb().from("solicitudes").select("*").order("creado", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Solicitud[];
}

/** En Supabase las fotos de las valoraciones son privadas: se piden enlaces temporales (1 hora). */
export async function verFotosSolicitud(s: Solicitud): Promise<string[]> {
  if (modoDemo || !s.fotos.length) return s.fotos;
  const { data } = await sb().storage.from("solicitudes").createSignedUrls(s.fotos, 3600);
  return (data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[];
}

export async function marcarAtendida(id: string, atendida: boolean) {
  if (modoDemo) {
    const lista = (await leer<Solicitud[]>(CLAVE_SOL)) ?? [];
    await escribir(CLAVE_SOL, lista.map((s) => (s.id === id ? { ...s, atendida } : s)));
    return;
  }
  const { error } = await sb().from("solicitudes").update({ atendida }).eq("id", id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------- usuarios

export const DEMO_EMAIL = "demo@inmopasaje.es";
export const DEMO_CLAVE = "demo1234";
const CLAVE_SESION = "pasaje-demo-sesion";

export type Usuario = { email: string } | null;

export async function usuarioActual(): Promise<Usuario> {
  if (modoDemo) {
    try { return localStorage.getItem(CLAVE_SESION) ? { email: DEMO_EMAIL } : null; } catch { return null; }
  }
  const { data } = await sb().auth.getSession();
  return data.session?.user?.email ? { email: data.session.user.email } : null;
}

export async function entrar(email: string, clave: string): Promise<void> {
  if (modoDemo) {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || clave !== DEMO_CLAVE) throw new Error("Email o contraseña incorrectos.");
    try { localStorage.setItem(CLAVE_SESION, "1"); } catch { /* sin almacenamiento */ }
    return;
  }
  const { error } = await sb().auth.signInWithPassword({ email: email.trim(), password: clave });
  if (error) throw new Error(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos." : error.message);
}

export async function salir() {
  if (modoDemo) { try { localStorage.removeItem(CLAVE_SESION); } catch { /* nada */ } return; }
  await sb().auth.signOut();
}

export async function recuperarClave(email: string): Promise<void> {
  if (modoDemo) throw new Error("En el modo demo no se envían emails. La contraseña de prueba es demo1234.");
  const { error } = await sb().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/admin/nueva-clave/` });
  if (error) throw new Error(error.message);
}

/** Escucha el enlace del email de recuperación (Supabase abre una sesión temporal). */
export function alRecuperar(f: () => void): () => void {
  if (modoDemo) return () => {};
  const { data } = sb().auth.onAuthStateChange((evento) => { if (evento === "PASSWORD_RECOVERY") f(); });
  return () => data.subscription.unsubscribe();
}

export async function cambiarClave(nueva: string): Promise<void> {
  if (modoDemo) throw new Error("En el modo demo no se puede cambiar la contraseña.");
  const { error } = await sb().auth.updateUser({ password: nueva });
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------- utilidades

async function reducir(f: File | Blob, max: number, calidad: number): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(f);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b ?? f), "image/jpeg", calidad));
  } catch {
    return f;
  }
}

const blobADataUrl = (b: Blob) =>
  new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(b); });
