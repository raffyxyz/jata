"use client";

import { useEffect, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} style={{ color: "var(--success)" }} />,
  error: <AlertCircle size={16} style={{ color: "var(--danger)" }} />,
  warning: <AlertTriangle size={16} style={{ color: "var(--warning)" }} />,
  info: <Info size={16} style={{ color: "var(--accent)" }} />,
};

let addToastFn: ((toast: Omit<Toast, "id">) => void) | null = null;

export function toast(type: ToastType, message: string) {
  addToastFn?.({ type, message });
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" style={{ maxWidth: 320 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-in flex items-start gap-3 bg-bg-surface rounded-md p-3 shadow-[var(--shadow-md)]"
          style={{ borderRadius: "var(--radius-md)", width: 320 }}
        >
          <div className="mt-0.5 shrink-0">{icons[t.type]}</div>
          <p className="flex-1 text-sm text-text-primary" style={{ fontSize: 13, lineHeight: 1.5 }}>{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export { ToastContainer };
export type { Toast, ToastType };
