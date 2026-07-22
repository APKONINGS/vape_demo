"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useAccessibilityStore } from "@/store/accessibility-store";
import { cn } from "@/lib/utils";

/** An original, abstract "flat icon" style car — built from basic shapes (rects, circles,
 * simple straight-line paths), not traced from any real vehicle, logo, or icon set — so
 * there's zero trademark/copyright risk, unlike sourcing real car photography would carry. */
export function AnimatedCar({ className }: { className?: string }) {
  const reduceMotion = useAccessibilityStore((s) => s.reduceMotion);
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = reduceMotion || prefersReducedMotion;

  return (
    <div className={cn("relative", className)}>
      {!disableMotion && (
        <div className="absolute right-[58%] top-[62%] hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-primary/40"
              style={{ width: 48 - i * 12 }}
              animate={{ x: [16, -24], opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      <motion.svg
        viewBox="0 0 240 130"
        role="img"
        aria-label="Illustration of a car driving"
        className="relative h-auto w-full"
        initial={disableMotion ? undefined : { x: -60, opacity: 0 }}
        animate={
          disableMotion
            ? undefined
            : {
                x: 0,
                opacity: 1,
                y: [0, -5, 0],
              }
        }
        transition={
          disableMotion
            ? undefined
            : {
                x: { duration: 0.7, ease: "easeOut" },
                opacity: { duration: 0.7 },
                y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
              }
        }
      >
        <ellipse cx="120" cy="122" rx="108" ry="6" className="fill-foreground/10" />

        {/* body */}
        <rect x="20" y="70" width="200" height="32" rx="10" className="fill-primary" />
        <path d="M58 70 L84 40 L156 40 L182 70 Z" className="fill-primary" />
        <path d="M68 65 L89 46 L151 46 L172 65 Z" className="fill-background" opacity="0.85" />

        {/* lights */}
        <circle cx="224" cy="82" r="4.5" className="fill-background" />
        <rect x="15" y="76" width="5" height="9" rx="1.5" className="fill-destructive" />

        {/* wheels */}
        {[70, 170].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="100" r="18" className="fill-foreground" />
            <circle cx={cx} cy="100" r="7" className="fill-background" />
            <motion.line
              x1={cx}
              y1="100"
              x2={cx}
              y2="84"
              strokeWidth="3"
              className="stroke-background"
              style={{ transformOrigin: `${cx}px 100px` }}
              animate={disableMotion ? undefined : { rotate: 360 }}
              transition={disableMotion ? undefined : { duration: 0.9, repeat: Infinity, ease: "linear" }}
            />
          </g>
        ))}
      </motion.svg>
    </div>
  );
}
