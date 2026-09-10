"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Receipt, FolderTree, Layers, LogOut, TrendingUp, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Sales Analytics", icon: TrendingUp },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/collections", label: "Collections", icon: Layers },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        const linkEl = (
          <Link
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
        return onNavigate ? (
          <SheetClose asChild key={link.href}>
            {linkEl}
          </SheetClose>
        ) : (
          <div key={link.href}>{linkEl}</div>
        );
      })}
    </nav>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile: a sticky top bar + slide-out sheet, same pattern as the customer site header. */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background p-4 md:hidden">
        <span className="text-lg font-bold">4F Admin</span>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open admin menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-64 flex-col overflow-y-auto">
            <SheetHeader>
              <SheetTitle>4F Admin</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-1 flex-col">
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: fixed sidebar. */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r bg-secondary/20 p-4 md:flex">
        <div className="mb-8 px-2 text-lg font-bold">4F Admin</div>
        <NavLinks pathname={pathname} />
        <Button variant="ghost" className="justify-start gap-2" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </aside>
    </>
  );
}
