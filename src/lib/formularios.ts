// Envío de los formularios de la web:
//  1) Se guardan como "Solicitud" en el panel /admin (Supabase, o este navegador en modo demo).
//  2) Se envían también a Netlify Forms, que reenvía un email al gerente (se activa en Netlify).

import { guardarSolicitud, type TipoSolicitud } from "./datos";

export type Resultado = { ok: true; vistaPrevia: boolean } | { ok: false };

async function aNetlify(nombre: string, datos: Record<string, string>, archivos: File[]): Promise<boolean> {
  const fd = new FormData();
  fd.append("form-name", nombre);
  Object.entries(datos).forEach(([k, v]) => fd.append(k, v));
  archivos.slice(0, 4).forEach((f, i) => fd.append(`foto${i + 1}`, f, f.name));
  try {
    const r = await fetch("/__forms.html", {
      method: "POST",
      body: archivos.length ? fd : new URLSearchParams(fd as unknown as Record<string, string>),
      headers: archivos.length ? undefined : { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function enviarFormulario(nombre: TipoSolicitud, datos: Record<string, string>, archivos: File[] = []): Promise<Resultado> {
  const [email, panel] = await Promise.allSettled([aNetlify(nombre, datos, archivos), guardarSolicitud(nombre, datos, archivos.slice(0, 4))]);
  const emailOk = email.status === "fulfilled" && email.value;
  const panelOk = panel.status === "fulfilled";
  if (!emailOk && !panelOk) return { ok: false };
  return { ok: true, vistaPrevia: !emailOk && esVistaPrevia() };
}

const esVistaPrevia = () => typeof window !== "undefined" && !/netlify\.app$|inmopasaje\.es$/.test(window.location.hostname);

/** Reduce una foto a 1400 px y JPEG para que el envío sea ligero. */
export async function comprimirFoto(f: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(f);
    const k = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob: Blob = await new Promise((res) => c.toBlob((b) => res(b!), "image/jpeg", 0.75));
    return new File([blob], f.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return f;
  }
}
