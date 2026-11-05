// Envío de formularios con Netlify Forms (gratis hasta 100 envíos al mes).
// Netlify reenvía cada envío por email al gerente (se activa en el panel de Netlify).

export type Resultado = { ok: true; vistaPrevia: boolean } | { ok: false };

export async function enviarFormulario(nombre: string, datos: Record<string, string>, archivos: File[] = []): Promise<Resultado> {
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
    if (r.ok) return { ok: true, vistaPrevia: false };
    // En la vista previa (fuera de Netlify) no hay quien reciba el formulario.
    if (esVistaPrevia()) return { ok: true, vistaPrevia: true };
    return { ok: false };
  } catch {
    return esVistaPrevia() ? { ok: true, vistaPrevia: true } : { ok: false };
  }
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
