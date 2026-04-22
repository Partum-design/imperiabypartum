"use client";

import { BellRing, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "imperia_notifications_prompted";

export function NotificationPermissionPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    const alreadyPrompted = localStorage.getItem(STORAGE_KEY);
    if (!alreadyPrompted && Notification.permission === "default") {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      localStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);

      if (permission === "granted") {
        // TODO: register service worker + send push subscription to Supabase.
      }
    } catch {
      dismiss();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-white/25 bg-white/70 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-start gap-3">
        <BellRing className="mt-0.5 h-5 w-5 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-semibold">Habilitar Notificaciones</p>
          <p className="text-xs text-muted-foreground">Recibe alertas de cumpleaños y vencimientos de dominios/suscripciones en tiempo real.</p>
          <div className="mt-3 flex gap-2">
            <Button onClick={requestPermission}>Habilitar</Button>
            <Button variant="ghost" onClick={dismiss}>Ahora no</Button>
          </div>
        </div>
        <button type="button" onClick={dismiss} className="rounded p-1 text-muted-foreground hover:bg-accent">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
