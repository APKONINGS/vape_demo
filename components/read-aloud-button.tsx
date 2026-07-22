"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Reads the current page's main content aloud using the browser's built-in Web Speech
 * API — a real assistive feature for blind/low-vision users, not a decorative toggle. */
export function ReadAloudButton() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handleClick() {
    if (!supported) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const main = document.getElementById("main-content");
    const text = (main?.innerText ?? document.body.innerText).trim();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!supported) return null;

  return (
    <Button type="button" variant="outline" className="w-full" onClick={handleClick}>
      {speaking ? (
        <>
          <VolumeX className="mr-2 h-4 w-4" /> Stop Reading
        </>
      ) : (
        <>
          <Volume2 className="mr-2 h-4 w-4" /> Read Page Aloud
        </>
      )}
    </Button>
  );
}
