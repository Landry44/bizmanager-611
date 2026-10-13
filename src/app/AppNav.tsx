"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links: [string, string, string][] = [
  ["/dashboard", "Vue d’ensemble", "basic"],
  ["/products", "Produits & stock", "basic"],
  ["/sales", "Ventes / caisse", "basic"],
  ["/customers", "Clients", "basic"],
  ["/purchases", "Achats", "basic"],
  ["/suppliers", "Fournisseurs", "basic"],
  ["/finance", "Finance & paie", "basic"],
  ["/documents", "Documents", "advanced"],
  ["/reports", "Rapports avancés", "advanced"],
  ["/subscription", "Mon abonnement", "basic"],
  ["/settings", "Paramètres", "basic"],
];

export default function AppNav() {
  const path = usePathname();
  const [superadmin, setSuperadmin] = useState(false);
  const [plan, setPlan] = useState("FREE");
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setOpen(false);
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(async (d) => {
        setSuperadmin(!!d?.user?.isSuperAdmin);
        const cid = d?.user?.companies?.[0]?.id;
        if (cid) {
          const sr = await fetch(`/api/companies/${cid}/subscription`);
          if (sr.ok) {
            const x = await sr.json();
            setPlan(x.subscription?.plan || "FREE");
          }
        }
      })
      .catch(() => {});
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUnread(d?.unread || 0))
      .catch(() => {});
  }, [path]);

  // Détection de l'installation PWA
  useEffect(() => {
    const onInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
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

  async function installApp() {
    if (isInstalled) return;
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setIsInstalled(true);
    } else {
      alert(
        "Pour installer BizManager :\n\n" +
          "• Sur iPhone (Safari) : bouton Partager → « Sur l'écran d'accueil »\n" +
          "• Sur Android (Chrome) : menu ⋮ → « Installer l'application »\n" +
          "• Sur PC (Chrome/Edge) : icône ⊕ dans la barre d'adresse"
      );
    }
  }

  // Bouton Installer réutilisable
  const InstallButton = (
    <button
      onClick={installApp}
      title="Installer BizManager sur cet appareil"
      style={{
        background: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "9px 14px",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      ↓ Installer
    </button>
  );

  // Pages publiques : uniquement le bouton Installer
  if (path === "/" || path === "/login" || path === "/register") {
    if (isInstalled) return null;
    return (
      <header
        style={{
          background: "#0f172a",
          padding: "10px 18px",
          display: "flex",
          justifyContent: "flex-end",
          boxShadow: "0 3px 15px #0f172a22",
        }}
      >
        {InstallButton}
      </header>
    );
  }

  // Pages connectées : navigation complète
  return (
    <header
      className="bm-mobile-nav"
      style={{
        background: "#0f172a",
        color: "white",
        padding: "12px 18px",
        boxShadow: "0 3px 15px #0f172a22",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Link
          href="/dashboard"
          style={{
            color: "white",
            fontWeight: 900,
            fontSize: 20,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ♥ BizManager{" "}
          <span style={{ fontSize: 10, color: "#93c5fd", fontWeight: 600 }}>
            PRO
          </span>
        </Link>
        <button
          className="bm-nav-toggle"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      <nav
        className={`bm-nav-menu${open ? " open" : ""}`}
        style={{
          gap: 5,
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: open ? 10 : 0,
        }}
      >
        {superadmin && (
          <Link
            href="/superadmin"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: 13,
              padding: "9px 11px",
              borderRadius: 8,
              background: path.startsWith("/superadmin") ? "#7c3aed" : "#7c3aedcc",
            }}
          >
            Superadmin
          </Link>
        )}

        {links.map(([href, label, level]) => (
          <Link
            key={href}
            href={href}
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: 13,
              padding: "9px 11px",
              borderRadius: 8,
              background:
                path === href || path.startsWith(href + "/")
                  ? "#2563eb"
                  : "#ffffff12",
            }}
          >
            {label}
            {level === "advanced" && plan !== "ENTERPRISE" ? (
              <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.75 }}>
                Avancé
              </span>
            ) : null}
          </Link>
        ))}

        <Link
          href="/notifications"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: 13,
            padding: "9px 11px",
            borderRadius: 8,
            background: path.startsWith("/notifications")
              ? "#2563eb"
              : "#ffffff12",
          }}
        >
          Notifications{" "}
          {unread > 0 && (
            <span
              style={{
                marginLeft: 5,
                background: "#ef4444",
                borderRadius: 999,
                padding: "2px 6px",
                fontSize: 10,
              }}
            >
              {unread}
            </span>
          )}
        </Link>

        {!isInstalled && InstallButton}

        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          style={{
            background: "#ffffff12",
            color: "white",
            border: "1px solid #ffffff30",
            borderRadius: 8,
            padding: "9px 12px",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Déconnexion
        </button>
      </nav>
    </header>
  );
}
