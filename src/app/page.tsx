"use client";
import Link from "next/link";
import { getCurrentUser } from "@/src/lib/auth";
import { useEffect, useState } from "react";

export default function Page() {
  let connected = false;
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

  try {
    connected = !!(getCurrentUser());
  } catch {}

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e3a8a 55%,#2563eb)",
        color: "white",
        fontFamily: "Arial,sans-serif",
      }}
    >
      {/* ===== NAV ===== */}
      <nav
        className="bm-home-nav bm-home-container"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <img
            src="/bizmanager-logo.svg"
            alt="BizManager - Gérez, suivez, développez"
            style={{
              display: "block",
              width: 220,
              maxWidth: "60vw",
              height: "auto",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {!isInstalled && (
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
          )}

          <Link
            href={connected ? "/dashboard" : "/register"}
            style={{
              color: "#0f172a",
              textDecoration: "none",
              background: "white",
              padding: "11px 18px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {connected ? "Ouvrir mon espace" : "Créer un compte"}
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section
        className="bm-home-hero bm-home-container"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "80px 28px 100px",
          display: "grid",
          gridTemplateColumns: "1.2fr .8fr",
          gap: 50,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 999,
              background: "#ffffff18",
              fontSize: 13,
            }}
          >
            Gestion d'entreprise · XAF · Cloud
          </div>
          <h1
            style={{
              fontSize: 52,
              lineHeight: 1.1,
              margin: "22px 0 18px",
              fontWeight: 900,
            }}
          >
            Gérez votre entreprise depuis un seul endroit.
          </h1>
          <p
            style={{
              fontSize: 17,
              opacity: 0.88,
              maxWidth: 620,
              lineHeight: 1.6,
            }}
          >
            Ventes, stock, achats, clients, fournisseurs, trésorerie, documents et
            rapports. Une plateforme pensée pour les entreprises modernes.
          </p>
          <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href={connected ? "/dashboard" : "/register"}
              style={{
                color: "#0f172a",
                textDecoration: "none",
                background: "white",
                padding: "14px 22px",
                borderRadius: 10,
                fontWeight: 700,
              }}
            >
              {connected ? "Ouvrir mon espace" : "Créer mon espace"}
            </Link>
            <a
              href="#features"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "14px 22px",
                borderRadius: 10,
                border: "1px solid #ffffff40",
              }}
            >
              Découvrir les fonctions →
            </a>
          </div>
        </div>

        <div
          className="bm-home-card"
          style={{
            background: "#ffffff12",
            border: "1px solid #ffffff22",
            backdropFilter: "blur(8px)",
            borderRadius: 24,
            padding: 26,
            boxShadow: "0 25px 80px #00000030",
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>
            TABLEAU DE BORD
          </div>
          <h3 style={{ fontSize: 24, margin: "0 0 18px" }}>Votre entreprise</h3>
          {[
            ["Chiffre d'affaires", "2 480 000 FCFA"],
            ["Trésorerie", "1 735 000 FCFA"],
            ["Stock", "248 produits"],
            ["Factures", "32 documents"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderTop: "1px solid #ffffff18",
                fontSize: 14,
              }}
            >
              <span style={{ opacity: 0.85 }}>{k}</span>
              <span style={{ fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section
        id="features"
        className="bm-home-features"
        style={{
          background: "#f8fafc",
          color: "#111827",
          padding: "65px 28px",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "auto" }}>
          <h2 style={{ fontSize: 32, marginTop: 0 }}>Tout ce qu'il faut pour piloter</h2>
          <p style={{ opacity: 0.7, maxWidth: 720 }}>
            BizManager centralise vos opérations : du point de vente aux rapports
            avancés, avec une expérience rapide et sécurisée.
          </p>
        </div>
      </section>
    </main>
  );
}
