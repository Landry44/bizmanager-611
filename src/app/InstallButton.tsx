"use client";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Enregistrement du Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then(reg => console.log("Service Worker enregistré:", reg.scope))
        .catch(err => console.error("Erreur Service Worker:", err));
    }

    // Écoute de l'événement d'installation
    const onInstall = (e: any) => {
      console.log("beforeinstallprompt déclenché !");
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
    
    // Si le navigateur n'a pas encore validé la PWA
    if (!deferredPrompt) {
      alert(
        "L'application n'est pas encore prête à s'installer automatiquement.\n\n" +
        "• Sur PC : Cliquez sur l'icône ⊕ dans la barre d'adresse (Chrome/Edge).\n" +
        "• Sur Android : Menu ⋮ > Installer l'application.\n" +
        "• Sur iPhone : Partager > Sur l'écran d'accueil.\n\n" +
        "Astuce : Revenez visiter le site dans quelques minutes, Chrome valide le site automatiquement."
      );
      return;
    }
    
    // Déclenchement de l'installation native
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Choix de l'utilisateur:", outcome);
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
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