import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import "./globals.css";
import { auth } from "@/auth";
import { AuthSessionProvider } from "@/components/session-provider";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { AccessibilityReadingGuide } from "@/components/accessibility-reading-guide";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "4F Store — Disposables, Pod Systems, Mods & E-Liquids",
    template: "%s | 4F Store",
  },
  description:
    "Shop disposables, pod systems, mods & tanks, and e-liquids in every flavor at 4F Store. Secure checkout, easy returns. Must be 18+ to purchase.",
  openGraph: {
    type: "website",
    siteName: "4F Store",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthSessionProvider session={session}>
          {children}
          <Toaster />
          <AccessibilityProvider />
          <AccessibilityPanel />
          <AccessibilityReadingGuide />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
