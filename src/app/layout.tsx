import React from "react";
import type { Metadata, Viewport } from "next";
import AppNav from "./AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizManager",
  description: "Gestion de commerce, stock, ventes et clients",
  manifest: "/manifest.json",
  applicationName: "BizManager",
  appleWebApp: {
    capable: true,
    title: "BizManager",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/bizmanager-logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/bizmanager-logo.svg", sizes: "180x180", type: "image/svg+xml" }],
    shortcut: ["/bizmanager-logo.svg"],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/bizmanager-logo.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BizManager" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0f172a" />
      </head>
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
