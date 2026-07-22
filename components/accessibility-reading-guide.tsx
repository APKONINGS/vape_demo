"use client";

import { useEffect, useState } from "react";

import { useAccessibilityStore } from "@/store/accessibility-store";

/** A horizontal highlight bar that follows the cursor vertically, helping users track
 * their place line-by-line while reading (ADHD / cognitive / low-vision profiles). */
export function AccessibilityReadingGuide() {
  const readingGuide = useAccessibilityStore((s) => s.readingGuide);
  const [y, setY] = useState<number | null>(null);

  useEffect(() => {
    if (!readingGuide) {
      setY(null);
      return;
    }

    function handleMouseMove(e: MouseEvent) {
      setY(e.clientY);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [readingGuide]);

  if (!readingGuide || y === null) return null;

  return <div className="a11y-reading-guide" style={{ top: y - 20 }} aria-hidden="true" />;
}
