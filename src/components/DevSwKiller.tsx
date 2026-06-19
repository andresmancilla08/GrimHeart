"use client";
import { useEffect } from "react";

// In development, unregister any stale service workers that may serve
// cached assets (old images, etc.) instead of the fresh dev server files.
export function DevSwKiller() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
  }, []);
  return null;
}
