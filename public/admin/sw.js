// Service worker del panel: permite instalarlo como app y abrirlo aunque falle la conexión.
const CACHE = "pasaje-admin-v1";
const BASICO = ["/admin/", "/admin/inmuebles/", "/admin/solicitudes/", "/admin/icono-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICO)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Primero la red (datos siempre al día); si no hay conexión, lo guardado.
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then((resp) => {
      if (resp.ok && (r.mode === "navigate" || r.url.includes("/_next/static/"))) {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put(r, copia));
      }
      return resp;
    }).catch(() => caches.match(r).then((m) => m || caches.match("/admin/")))
  );
});
