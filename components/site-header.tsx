"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { CountBadge } from "@/components/motion/count-badge";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useCartStore } from "@/store/cart-store";
import { useWishlist } from "@/components/wishlist-context";
import { NAV_VEHICLE_TYPES, PRODUCT_TYPES } from "@/lib/constants";

const COLLECTION_LINKS = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Winter Driving Essentials", href: "/collections/winter" },
  { label: "Sale", href: "/collections/sale" },
] as const;

export function SiteHeader() {
  const { data: session, status } = useSession();
  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.open);
  const { count: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-full flex-col overflow-y-auto sm:max-w-xs">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <form action="/search" method="GET" className="relative mt-4">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input name="q" placeholder="Search the catalog..." className="pl-8" />
              </form>

              {NAV_VEHICLE_TYPES.map((vehicleType) => (
                <div key={vehicleType.slug} className="mt-6">
                  <SheetClose asChild>
                    <Link
                      href={`/${vehicleType.slug}`}
                      className="block rounded-md px-2 py-1.5 text-base font-semibold hover:bg-accent"
                    >
                      {vehicleType.label}
                    </Link>
                  </SheetClose>
                  <div className="mt-1 flex flex-col gap-0.5 pl-2">
                    {PRODUCT_TYPES.map((type) => (
                      <SheetClose asChild key={type.type}>
                        <Link
                          href={`/${vehicleType.slug}/${type.type}`}
                          className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          {type.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              ))}

              <Separator className="my-4" />
              <nav className="flex flex-col gap-1">
                {COLLECTION_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-lg font-bold tracking-tight">
            4F STORE
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            {NAV_VEHICLE_TYPES.map((vehicleType) => (
              <div key={vehicleType.slug} className="group relative">
                <Link
                  href={`/${vehicleType.slug}`}
                  className="relative flex items-center rounded-md px-3 py-2 transition-colors hover:text-foreground/80"
                >
                  {vehicleType.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-foreground transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 flex w-[28rem] gap-6 rounded-lg border bg-popover p-4 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                  <div className="flex-1">
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Shop by Category
                    </p>
                    <Link
                      href={`/${vehicleType.slug}`}
                      className="block rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent"
                    >
                      All {vehicleType.label}
                    </Link>
                    {PRODUCT_TYPES.map((type) => (
                      <Link
                        key={type.type}
                        href={`/${vehicleType.slug}/${type.type}`}
                        className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {type.label}
                      </Link>
                    ))}
                  </div>
                  <Separator orientation="vertical" className="h-auto" />
                  <div className="flex-1">
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Collections
                    </p>
                    {COLLECTION_LINKS.map((collection) => (
                      <Link
                        key={collection.href}
                        href={collection.href}
                        className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {collection.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        <form action="/search" method="GET" className="relative hidden flex-1 max-w-sm md:flex">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" placeholder="Search the catalog..." className="pl-8" />
        </form>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />

          <Button variant="ghost" size="icon" className="md:hidden" asChild aria-label="Search">
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild aria-label="Wishlist">
            <Link href="/account/wishlist">
              <Heart className="h-5 w-5" />
              <CountBadge count={wishlistCount} />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={openCart} aria-label="Open cart">
            <ShoppingBag className="h-5 w-5" />
            <CountBadge count={count} />
          </Button>

          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 sm:px-3" aria-label="Account menu">
                  <User className="h-5 w-5" />
                  <span className="hidden max-w-[8rem] truncate text-sm font-medium sm:inline">
                    {session.user?.name?.split(" ")[0] ?? session.user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user?.name ?? session.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/wishlist">My Wishlist</Link>
                </DropdownMenuItem>
                {session.user?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild aria-label="Log in">
              <Link href="/account/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
