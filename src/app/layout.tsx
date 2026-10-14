import React from "react";
import type { Metadata, Viewport } from "next";
import AppNav from "./AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizManager - Gestion d'entreprise",
  description: "Gérez, suivez et développez votre entreprise.",
  manifest: "/manifest.json",
  icons: {
    icon: "/bizmanager-icon.svg",
    apple: "/bizmanager-icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BizManager",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/bizmanager-icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BizManager" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0f172a" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('SW registered:', reg.scope); },
                    function(err) { console.log('SW error:', err); }
                  );
                });
              }
            `,
          }}
        />
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
