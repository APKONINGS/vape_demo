"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useAccessibilityStore } from "@/store/accessibility-store";

/** A small ambient float+wobble loop for decorative badges/stickers — skipped entirely
 * when motion is reduced (either the site's own toggle or the OS-level preference). */
export function FloatingBadge({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useAccessibilityStore((s) => s.reduceMotion);
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = reduceMotion || prefersReducedMotion;

  if (disableMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0], rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
