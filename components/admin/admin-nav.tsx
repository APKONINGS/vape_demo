"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Receipt, FolderTree, Layers, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/collections", label: "Collections", icon: Layers },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r bg-secondary/20 p-4">
      <div className="mb-8 px-2 text-lg font-bold">4F Admin</div>
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Button variant="ghost" className="justify-start gap-2" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
}
