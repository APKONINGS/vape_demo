"use client";

import { useState } from "react";
import {
  Accessibility,
  Brain,
  Eye,
  EyeOff,
  Hand,
  RotateCcw,
  ZapOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReadAloudButton } from "@/components/read-aloud-button";
import { cn } from "@/lib/utils";
import { useAccessibilityStore, type FontScale, type ColorBlindMode, type ProfileName } from "@/store/accessibility-store";

const FONT_SCALES: { value: FontScale; label: string }[] = [
  { value: "normal", label: "A" },
  { value: "large", label: "A" },
  { value: "xlarge", label: "A" },
  { value: "xxlarge", label: "A" },
];

const PROFILES: { value: ProfileName; label: string; description: string; icon: typeof Eye }[] = [
  { value: "visionImpaired", label: "Vision Impaired", description: "Larger text, high contrast.", icon: Eye },
  { value: "blind", label: "Blind / Screen Reader", description: "Read Page Aloud, clear focus states.", icon: EyeOff },
  { value: "motorImpairment", label: "Motor Impairment", description: "Big cursor, calmer motion.", icon: Hand },
  { value: "seizureSafe", label: "Seizure & Epileptic Safe", description: "Removes all animation.", icon: ZapOff },
  { value: "adhdFriendly", label: "ADHD Friendly", description: "Fewer distractions, reading guide.", icon: Brain },
  {
    value: "cognitiveLearning",
    label: "Cognitive & Learning",
    description: "Dyslexia-friendly spacing, reading guide.",
    icon: Accessibility,
  },
];

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
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
    readingGuide,
    colorBlindMode,
    activeProfile,
    setFontScale,
    toggleHighContrast,
    toggleReduceMotion,
    toggleUnderlineLinks,
    toggleHighlightHeadings,
    toggleDyslexiaFriendly,
    toggleTextAlignLeft,
    toggleLargeCursor,
    toggleHideImages,
    toggleHighlightHover,
    toggleReadingGuide,
    setColorBlindMode,
    applyProfile,
    reset,
  } = useAccessibilityStore();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-5 left-5 z-50 h-12 w-12 rounded-full shadow-lg"
          aria-label="Accessibility settings"
        >
          <Accessibility className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" /> Accessibility
          </SheetTitle>
          <SheetDescription>
            Adjust how this site looks and behaves. Your choices are saved on this device.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          <div>
            <p className="mb-3 text-sm font-semibold">Choose a profile</p>
            <div className="grid grid-cols-2 gap-2">
              {PROFILES.map((profile) => {
                const Icon = profile.icon;
                const active = activeProfile === profile.value;
                return (
                  <button
                    key={profile.value}
                    type="button"
                    onClick={() => applyProfile(profile.value)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-md border p-3 text-left transition-colors",
                      active ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium leading-tight">{profile.label}</span>
                    <span
                      className={cn(
                        "text-[11px] leading-tight",
                        active ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}
                    >
                      {profile.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div>
            <p className="mb-3 text-sm font-semibold">Read this page aloud</p>
            <ReadAloudButton />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Text size</Label>
            <div className="flex gap-2">
              {FONT_SCALES.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFontScale(option.value)}
                  aria-pressed={fontScale === option.value}
                  className={cn(
                    "flex-1 rounded-md border py-2 font-semibold transition-colors",
                    fontScale === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                  style={{ fontSize: `${0.9 + index * 0.2}rem` }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="a11y-colorblind">Color vision adjustment</Label>
            <Select value={colorBlindMode} onValueChange={(v) => setColorBlindMode(v as ColorBlindMode)}>
              <SelectTrigger id="a11y-colorblind">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Off</SelectItem>
                <SelectItem value="protanopia">Protanopia (red-weak)</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopia (green-weak)</SelectItem>
                <SelectItem value="tritanopia">Tritanopia (blue-weak)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-5">
            <ToggleRow
              id="a11y-contrast"
              label="High contrast"
              description="Black and white with bold focus outlines."
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
            />
            <ToggleRow
              id="a11y-motion"
              label="Reduce motion"
              description="Turns off animations and transitions."
              checked={reduceMotion}
              onCheckedChange={toggleReduceMotion}
            />
            <ToggleRow
              id="a11y-links"
              label="Underline links"
              description="Makes links easier to spot from body text."
              checked={underlineLinks}
              onCheckedChange={toggleUnderlineLinks}
            />
            <ToggleRow
              id="a11y-headings"
              label="Highlight headings"
              description="Outlines section titles so structure is easy to scan."
              checked={highlightHeadings}
              onCheckedChange={toggleHighlightHeadings}
            />
            <ToggleRow
              id="a11y-dyslexia"
              label="Dyslexia friendly"
              description="Wider letter/line spacing and a plainer font."
              checked={dyslexiaFriendly}
              onCheckedChange={toggleDyslexiaFriendly}
            />
            <ToggleRow
              id="a11y-align"
              label="Left-align text"
              description="Avoids justified/centered text that's harder to track."
              checked={textAlignLeft}
              onCheckedChange={toggleTextAlignLeft}
            />
            <ToggleRow
              id="a11y-guide"
              label="Reading guide"
              description="A highlight bar follows your cursor as you read."
              checked={readingGuide}
              onCheckedChange={toggleReadingGuide}
            />
            <ToggleRow
              id="a11y-hover"
              label="Highlight hover & focus"
              description="Draws a bold outline around whatever you point to."
              checked={highlightHover}
              onCheckedChange={toggleHighlightHover}
            />
            <ToggleRow
              id="a11y-images"
              label="Hide images"
              description="Dims photos so text content stands out."
              checked={hideImages}
              onCheckedChange={toggleHideImages}
            />
            <ToggleRow
              id="a11y-cursor"
              label="Large cursor"
              description="Enlarges the pointer over the whole site."
              checked={largeCursor}
              onCheckedChange={toggleLargeCursor}
            />
          </div>

          <Separator />

          <Button variant="outline" className="w-full" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset to defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
