import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FontScale = "normal" | "large" | "xlarge" | "xxlarge";
export type ColorBlindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";
export type ProfileName =
  | "visionImpaired"
  | "blind"
  | "motorImpairment"
  | "seizureSafe"
  | "adhdFriendly"
  | "cognitiveLearning";

interface AccessibilitySettings {
  fontScale: FontScale;
  highContrast: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
  highlightHeadings: boolean;
  dyslexiaFriendly: boolean;
  textAlignLeft: boolean;
  largeCursor: boolean;
  hideImages: boolean;
  highlightHover: boolean;
  readingGuide: boolean;
  colorBlindMode: ColorBlindMode;
  activeProfile: ProfileName | null;
}

interface AccessibilityState extends AccessibilitySettings {
  setFontScale: (scale: FontScale) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleUnderlineLinks: () => void;
  toggleHighlightHeadings: () => void;
  toggleDyslexiaFriendly: () => void;
  toggleTextAlignLeft: () => void;
  toggleLargeCursor: () => void;
  toggleHideImages: () => void;
  toggleHighlightHover: () => void;
  toggleReadingGuide: () => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  applyProfile: (profile: ProfileName) => void;
  reset: () => void;
}

const defaults: AccessibilitySettings = {
  fontScale: "normal",
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
  highlightHeadings: false,
  dyslexiaFriendly: false,
  textAlignLeft: false,
  largeCursor: false,
  hideImages: false,
  highlightHover: false,
  readingGuide: false,
  colorBlindMode: "none",
  activeProfile: null,
};

// Mirrors the standard disability-profile taxonomy used by mainstream accessibility
// widgets (UserWay, accessiBe, EqualWeb): each profile is a one-click bundle of the
// individual controls below, not a separate feature set of its own.
const PROFILE_SETTINGS: Record<ProfileName, Partial<AccessibilitySettings>> = {
  visionImpaired: { fontScale: "xlarge", highContrast: true, highlightHover: true },
  blind: { highlightHover: true, underlineLinks: true },
  motorImpairment: { largeCursor: true, highlightHover: true, reduceMotion: true },
  seizureSafe: { reduceMotion: true },
  adhdFriendly: { reduceMotion: true, readingGuide: true, hideImages: true },
  cognitiveLearning: { dyslexiaFriendly: true, textAlignLeft: true, readingGuide: true },
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...defaults,
      setFontScale: (fontScale) => set({ fontScale, activeProfile: null }),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast, activeProfile: null })),
      toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion, activeProfile: null })),
      toggleUnderlineLinks: () => set((s) => ({ underlineLinks: !s.underlineLinks, activeProfile: null })),
      toggleHighlightHeadings: () =>
        set((s) => ({ highlightHeadings: !s.highlightHeadings, activeProfile: null })),
      toggleDyslexiaFriendly: () => set((s) => ({ dyslexiaFriendly: !s.dyslexiaFriendly, activeProfile: null })),
      toggleTextAlignLeft: () => set((s) => ({ textAlignLeft: !s.textAlignLeft, activeProfile: null })),
      toggleLargeCursor: () => set((s) => ({ largeCursor: !s.largeCursor, activeProfile: null })),
      toggleHideImages: () => set((s) => ({ hideImages: !s.hideImages, activeProfile: null })),
      toggleHighlightHover: () => set((s) => ({ highlightHover: !s.highlightHover, activeProfile: null })),
      toggleReadingGuide: () => set((s) => ({ readingGuide: !s.readingGuide, activeProfile: null })),
      setColorBlindMode: (colorBlindMode) => set({ colorBlindMode, activeProfile: null }),
      applyProfile: (profile) =>
        set((s) => {
          if (s.activeProfile === profile) {
            return { ...defaults };
          }
          return { ...defaults, ...PROFILE_SETTINGS[profile], activeProfile: profile };
        }),
      reset: () => set(defaults),
    }),
    {
      name: "4f-accessibility",
      // Same SSR-mismatch rationale as store/cart-store.ts: skip auto-hydration and
      // rehydrate manually post-mount so server and first client paint agree.
      skipHydration: true,
    }
  )
);
