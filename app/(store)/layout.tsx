import type { ReactNode } from "react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { CartHydration } from "@/components/cart-hydration";
import { WishlistProvider } from "@/components/wishlist-context";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const wishlistedProductIds = session?.user?.id
    ? (
        await prisma.wishlistItem.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      ).map((w) => w.productId)
    : [];

  return (
    <WishlistProvider initialIds={wishlistedProductIds}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
        <CartHydration />
      </div>
    </WishlistProvider>
  );
}
