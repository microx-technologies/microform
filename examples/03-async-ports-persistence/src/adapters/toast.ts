import type { NotifyAdapter } from "microform";

export interface ToastItem {
  id: string;
  type: "success" | "error";
  message: string;
  description?: string;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => this.listeners.delete(listener);
  }

  show(type: "success" | "error", message: string, description?: string) {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = { id, type, message, description };
    this.toasts = [...this.toasts, item];
    this.notify();

    setTimeout(() => {
      this.dismiss(id);
    }, 4000);
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener([...this.toasts]);
    }
  }
}

export const toastManager = new ToastManager();

/**
 * Adaptador de notificaciones que implementa el puerto `NotifyAdapter`.
 */
export const toastNotifyAdapter: NotifyAdapter = {
  success: (message: string) => {
    toastManager.show("success", message);
  },
  error: (message: string, description?: string) => {
    toastManager.show("error", message, description);
  },
};
