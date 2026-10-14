"use client";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("appinstalled", onInstalled);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (isInstalled) return;
    if (!deferredPrompt) {
      alert(
        "Pour installer BizManager :\n\n" +
          "• Sur iPhone (Safari) : bouton Partager → « Sur l'écran d'accueil »\n" +
          "• Sur Android (Chrome) : menu ⋮ → « Installer l'application »\n" +
          "• Sur PC (Chrome/Edge) : icône ⊕ dans la barre d'adresse"
      );
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  }

  if (isInstalled) return null;

  return (
    <button
      onClick={handleInstall}
      style={{
        background: "#22c55e",
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "11px 18px",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      ↓ Installer
    </button>
  );
}
