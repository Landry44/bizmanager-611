import React from "react";
import type { Metadata, Viewport } from "next";
import AppNav from "./AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizManager",
  description: "Gestion de commerce, stock, ventes et clients",
  manifest: "/manifest.json",
  icons: {
    icon: "/bizmanager-logo.svg",
    apple: "/bizmanager-logo.svg",
  },
  appleWebApp: {
    capable: true,
    title: "BizManager",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: "Inter, Arial, sans-serif",
          background: "#f4f7fb",
          color: "#0f172a",
        }}
      >
        <AppNav />
        {children}
      </body>
    </html>
  );
}
