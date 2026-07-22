"use client";

import { useEffect } from "react";

import { useAccessibilityStore } from "@/store/accessibility-store";

/** Rehydrates persisted accessibility settings post-mount, then reflects them onto
 * <html> as data-attributes so plain CSS (globals.css) can style every page — including
 * /admin — without every component needing to read the store directly. */
export function AccessibilityProvider() {
  const {
    fontScale,
    highContrast,
    reduceMotion,
    underlineLinks,
    highlightHeadings,
    dyslexiaFriendly,
    textAlignLeft,
    largeCursor,
    hideImages,
    highlightHover,
    colorBlindMode,
  } = useAccessibilityStore();

  useEffect(() => {
    useAccessibilityStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fontScale = fontScale;
    root.dataset.contrast = highContrast ? "high" : "normal";
    root.dataset.reduceMotion = String(reduceMotion);
    root.dataset.underlineLinks = String(underlineLinks);
    root.dataset.highlightHeadings = String(highlightHeadings);
    root.dataset.dyslexiaFriendly = String(dyslexiaFriendly);
    root.dataset.textAlignLeft = String(textAlignLeft);
    root.dataset.largeCursor = String(largeCursor);
    root.dataset.hideImages = String(hideImages);
    root.dataset.highlightHover = String(highlightHover);
    root.dataset.colorBlind = colorBlindMode;
  }, [
    fontScale,
    highContrast,
    reduceMotion,
    underlineLinks,
    highlightHeadings,
    dyslexiaFriendly,
    textAlignLeft,
    largeCursor,
    hideImages,
    highlightHover,
    colorBlindMode,
  ]);

  return null;
}
