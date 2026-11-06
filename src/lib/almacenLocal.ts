// Pequeño almacén en el navegador (IndexedDB) para el MODO DEMO.
const BD = "pasaje-demo";
const TABLA = "kv";

function abrir(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(BD, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(TABLA);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function leer<T>(clave: string): Promise<T | undefined> {
  const db = await abrir();
  return new Promise((res, rej) => {
    const r = db.transaction(TABLA).objectStore(TABLA).get(clave);
    r.onsuccess = () => res(r.result as T | undefined);
    r.onerror = () => rej(r.error);
  });
}

export async function escribir<T>(clave: string, valor: T): Promise<void> {
  const db = await abrir();
  return new Promise((res, rej) => {
    const t = db.transaction(TABLA, "readwrite");
    t.objectStore(TABLA).put(valor, clave);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}
