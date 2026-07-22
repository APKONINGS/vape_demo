"use client";

import { useEffect, useState } from "react";

import { CollectionCarousel } from "@/components/collection-carousel";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { getRecentlyViewedProductsAction } from "@/app/(store)/product/actions";
import type { ProductDTO } from "@/lib/products";

export function RecentlyViewedSection({ currentSlug }: { currentSlug: string }) {
  const [products, setProducts] = useState<ProductDTO[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Rehydrate from localStorage (skipped automatically on the server/first paint —
      // see store/recently-viewed-store.ts), then record this view.
      await useRecentlyViewedStore.persist.rehydrate();
      useRecentlyViewedStore.getState().addSlug(currentSlug);

      const slugsToShow = useRecentlyViewedStore
        .getState()
        .slugs.filter((slug) => slug !== currentSlug)
        .slice(0, 8);

      if (slugsToShow.length === 0) {
        if (!cancelled) setProducts([]);
        return;
      }

      const result = await getRecentlyViewedProductsAction(slugsToShow);
      if (!cancelled) setProducts(result);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentSlug]);

  if (products.length === 0) return null;

  return <CollectionCarousel title="Recently Viewed" products={products} className="py-12" />;
}
