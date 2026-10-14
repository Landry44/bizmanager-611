"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["/dashboard", "Vue d’ensemble", "basic"], ["/products", "Produits & stock", "basic"],
  ["/sales", "Ventes / caisse", "basic"], ["/customers", "Clients", "basic"],
  ["/purchases", "Achats", "basic"], ["/suppliers", "Fournisseurs", "basic"],
  ["/finance", "Finance & paie", "basic"], ["/documents", "Documents", "advanced"],
  ["/reports", "Rapports avancés", "advanced"], ["/subscription", "Mon abonnement", "basic"],
  ["/settings", "Paramètres", "basic"]
];

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> };

export default function AppNav() {
  const path = usePathname();
  const [superadmin, setSuperadmin] = useState(false);
  const [plan, setPlan] = useState("FREE");
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setOpen(false);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
    setIsInstalled(standalone);
    const onInstall = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPrompt); };
    const onInstalled = () => { setIsInstalled(true); setInstallPrompt(null); };
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("appinstalled", onInstalled);

    fetch("/api/me", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(async d => {
      setSuperadmin(!!d?.user?.isSuperAdmin);
      const cid = d?.user?.companies?.[0]?.id;
      if (cid) {
        const sr = await fetch(`/api/companies/${cid}/subscription`, { cache: "no-store" });
        if (sr.ok) { const x = await sr.json(); setPlan(x.subscription?.plan || "FREE"); }
      }
    }).catch(() => {});
    fetch("/api/notifications", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(d => setUnread(d?.unread || 0)).catch(() => {});
    return () => { window.removeEventListener("beforeinstallprompt", onInstall); window.removeEventListener("appinstalled", onInstalled); };
  }, [path]);

  if (path === "/" || path === "/login" || path === "/register") return null;

  async function installApp() {
    if (isInstalled) return;
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setIsInstalled(true);
      setInstallPrompt(null);
      return;
    }
    alert("Pour installer BizManager :\n\n• Android : ouvrez le menu ⋮ du navigateur puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».\n• Ordinateur : cherchez l’icône Installer dans la barre d’adresse du navigateur.\n\nSi cette option n’apparaît pas, vérifiez que le site est en HTTPS et que la dernière version est déployée.");
  }

  return <header className="bm-mobile-nav" style={{ background: "#0f172a", color: "white", padding: "12px 18px", boxShadow: "0 3px 15px #0f172a22" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <Link href="/dashboard" style={{ color: "white", fontWeight: 900, fontSize: 20, textDecoration: "none", whiteSpace: "nowrap" }}>
        <img src="/bizmanager-logo.svg" alt="BizManager" style={{ display: "block", width: 205, height: 55, objectFit: "contain" }} />
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!isInstalled && <button onClick={installApp} aria-label="Installer BizManager" style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "white", border: "1px solid #ffffff35", borderRadius: 10, padding: "10px 12px", minHeight: 44, fontWeight: 800, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>↓ Installer</button>}
        <button className="bm-nav-toggle" aria-label="Ouvrir le menu" onClick={() => setOpen(v => !v)}>{open ? "×" : "☰"}</button>
      </div>
    </div>
    <nav className={`bm-nav-menu${open ? " open" : ""}`} style={{ gap: 5, flexWrap: "wrap", alignItems: "center", marginTop: open ? 10 : 0 }}>
      {superadmin && <Link href="/superadmin" style={{ color: "white", textDecoration: "none", fontSize: 13, padding: "9px 11px", borderRadius: 8, background: path.startsWith("/superadmin") ? "#7c3aed" : "#7c3aedcc" }}>Superadmin</Link>}
      {links.map(([href, label, level]) => <Link key={href} href={href} style={{ color: "white", textDecoration: "none", fontSize: 13, padding: "9px 11px", borderRadius: 8, background: path === href || path.startsWith(href + "/") ? "#2563eb" : "#ffffff12" }}>{label}{level === "advanced" && plan !== "ENTERPRISE" ? <span style={{ fontSize: 9, marginLeft: 4, opacity: .75 }}>Avancé</span> : null}</Link>)}
      <Link href="/notifications" style={{ color: "white", textDecoration: "none", fontSize: 13, padding: "9px 11px", borderRadius: 8, background: path.startsWith("/notifications") ? "#2563eb" : "#ffffff12" }}>Notifications {unread > 0 && <span style={{ marginLeft: 5, background: "#ef4444", borderRadius: 999, padding: "2px 6px", fontSize: 10 }}>{unread}</span>}</Link>
      <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; }} style={{ background: "#ffffff12", color: "white", border: "1px solid #ffffff30", borderRadius: 8, padding: "9px 12px", cursor: "pointer", fontSize: 13 }}>Déconnexion</button>
    </nav>
  </header>;
}
