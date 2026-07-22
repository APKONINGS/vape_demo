import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 12;

interface RecentlyViewedState {
  slugs: string[];
  addSlug: (slug: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      slugs: [],
      addSlug: (slug) => {
        const rest = get().slugs.filter((s) => s !== slug);
        set({ slugs: [slug, ...rest].slice(0, MAX_ITEMS) });
      },
    }),
    {
      name: "4f-recently-viewed",
      // Same SSR-mismatch rationale as store/cart-store.ts — this store only ever
      // renders on the client (product page), so skip auto-hydration and rehydrate
      // manually once mounted.
      skipHydration: true,
    }
  )
);
