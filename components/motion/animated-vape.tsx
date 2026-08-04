"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useAccessibilityStore } from "@/store/accessibility-store";
import { cn } from "@/lib/utils";

/** An original, abstract "flat icon" style vape pen — built from basic shapes (rects,
 * circles, simple straight-line paths), not traced from any real device, brand, or icon
 * set — so there's zero trademark/copyright risk, same as sourcing real product photos
 * would carry. */
export function AnimatedVape({ className }: { className?: string }) {
  const reduceMotion = useAccessibilityStore((s) => s.reduceMotion);
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = reduceMotion || prefersReducedMotion;

  return (
    <div className={cn("relative", className)}>
      <motion.svg
        viewBox="0 0 160 220"
        role="img"
        aria-label="Illustration of a vape device with rising vapor"
        className="relative h-auto w-full"
        initial={disableMotion ? undefined : { y: 20, opacity: 0 }}
        animate={
          disableMotion
            ? undefined
            : {
                y: [0, -6, 0],
                opacity: 1,
              }
        }
        transition={
          disableMotion
            ? undefined
            : {
                opacity: { duration: 0.7 },
                y: { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
              }
        }
      >
        <ellipse cx="80" cy="204" rx="46" ry="7" className="fill-foreground/10" />

        {/* mouthpiece */}
        <rect x="66" y="10" width="28" height="20" rx="6" className="fill-foreground" />

        {/* body */}
        <rect x="50" y="28" width="60" height="130" rx="14" className="fill-primary" />
        <rect x="58" y="44" width="44" height="98" rx="8" className="fill-background" opacity="0.15" />

        {/* accent glow line */}
        <rect x="58" y="120" width="44" height="6" rx="3" className="fill-background" opacity="0.85" />

        {/* fire button */}
        <circle cx="80" cy="100" r="7" className="fill-destructive" />

        {/* base */}
        <rect x="54" y="156" width="52" height="46" rx="10" className="fill-foreground" />

        {/* vapor puffs */}
        {!disableMotion &&
          [0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={80 + (i - 1) * 14}
              cy="10"
              r={7 - i}
              className="fill-foreground/20"
              animate={{ y: [0, -60], opacity: [0, 0.6, 0], scale: [0.6, 1.4] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
            />
          ))}
      </motion.svg>
    </div>
  );
}
