"use client";

import { useEffect } from "react";

/** Registra el service worker para que el panel se pueda instalar como app. */
export default function RegistrarApp() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/admin/sw.js", { scope: "/admin/" }).catch(() => {});
  }, []);
  return null;
}
