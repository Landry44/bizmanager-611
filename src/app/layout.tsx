import React from "react";
import type { Metadata, Viewport } from "next";
import AppNav from "./AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizManager — Gestion d'entreprise",
  description: "Gérez, suivez et développez votre entreprise.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/bizmanager-icon.svg", apple: "/bizmanager-icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "BizManager" },
};
export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body style={{ margin: 0, fontFamily: "Inter,Arial,sans-serif", background: "#f4f7fb", color: "#0f172a" }}>
    <AppNav />
    {children}
  </body></html>;
}
