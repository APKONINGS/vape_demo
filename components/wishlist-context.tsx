"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface WishlistContextValue {
  count: number;
  isWishlisted: (productId: string) => boolean;
  setWishlisted: (productId: string, wishlisted: boolean) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

/** Site-wide "is this product in my wishlist" lookup, seeded server-side (see
 * app/(store)/layout.tsx) so any <ProductCard> anywhere can render its wishlist state
 * without every listing page having to fetch and prop-drill it individually. */
export function WishlistProvider({ initialIds, children }: { initialIds: string[]; children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set(initialIds));

  function isWishlisted(productId: string) {
    return ids.has(productId);
  }

  function setWishlisted(productId: string, wishlisted: boolean) {
    setIds((prev) => {
      const next = new Set(prev);
      if (wishlisted) next.add(productId);
      else next.delete(productId);
      return next;
    });
  }

  return (
    <WishlistContext.Provider value={{ count: ids.size, isWishlisted, setWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
