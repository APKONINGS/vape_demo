"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useAccessibilityStore } from "@/store/accessibility-store";

export function TapScale({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useAccessibilityStore((s) => s.reduceMotion);
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = reduceMotion || prefersReducedMotion;

  if (disableMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
      {children}
    </motion.div>
  );
}
