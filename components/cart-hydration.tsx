"use client";

import { useEffect } from "react";

import { useCartStore } from "@/store/cart-store";

/** Triggers the cart's localStorage rehydration once mounted client-side, after the
 * server-matching first paint — see the `skipHydration` note in store/cart-store.ts. */
export function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
