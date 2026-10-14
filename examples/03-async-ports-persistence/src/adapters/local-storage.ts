import type { StorageAdapter } from "microform";

/**
 * Adaptador de almacenamiento real sobre `window.localStorage`.
 * Cumple estrictamente con el puerto `StorageAdapter`.
 */
export function createLocalStorageAdapter(): StorageAdapter {
  return {
    get: (key: string): string | null => {
      if (typeof window === "undefined") return null;
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.warn(`[LocalStorageAdapter] Error leyendo "${key}":`, e);
        return null;
      }
    },
    set: (key: string, value: string): void => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.warn(`[LocalStorageAdapter] Error guardando "${key}":`, e);
      }
    },
    remove: (key: string): void => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.warn(`[LocalStorageAdapter] Error eliminando "${key}":`, e);
      }
    },
  };
}
