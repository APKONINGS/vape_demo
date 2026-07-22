"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useAccessibilityStore } from "@/store/accessibility-store";

export function CountBadge({ count }: { count: number }) {
  const reduceMotion = useAccessibilityStore((s) => s.reduceMotion);
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = reduceMotion || prefersReducedMotion;

  if (count <= 0) return null;

  if (disableMotion) {
    return (
      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
        {count}
      </span>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={count}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
      >
        {count}
      </motion.span>
    </AnimatePresence>
  );
}
