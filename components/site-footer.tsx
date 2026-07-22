import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, type LucideIcon } from "lucide-react";

import { SOCIAL_LINKS } from "@/lib/constants";

const HELP_LINKS = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Fitment Guide", href: "/fitment-guide" },
  { label: "Contact", href: "/contact" },
] as const;

const SOCIAL_ICONS: Record<(typeof SOCIAL_LINKS)[number]["icon"], LucideIcon> = {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
};

export function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="container flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight">4F STORE</p>
          <p className="mt-1 text-sm text-muted-foreground">Self-hosted e-commerce starter.</p>
          <div className="mt-4 flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon];
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        <nav aria-label="Customer service" className="flex flex-col gap-2 sm:flex-row sm:gap-8">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Customer Service
          </span>
          <ul className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
            {HELP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container mt-8 border-t pt-6 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} 4F Store. All rights reserved.
      </div>
    </footer>
  );
}
