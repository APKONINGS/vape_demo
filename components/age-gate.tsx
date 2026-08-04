"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AGE_GATE_MINIMUM_AGE } from "@/lib/constants";

const STORAGE_KEY = "4f-age-verified";

type GateStatus = "checking" | "gated" | "verified" | "blocked";

export function AgeGate() {
  const [status, setStatus] = useState<GateStatus>("checking");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setStatus(stored === "true" ? "verified" : "gated");
  }, []);

  function confirmAge() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setStatus("verified");
  }

  function denyAge() {
    setStatus("blocked");
  }

  // Rendering nothing during "checking" (the first client render, before localStorage has
  // been read) avoids a flash of the gate for returning visitors who already verified.
  if (status === "checking" || status === "verified") return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 text-center shadow-lg">
        {status === "blocked" ? (
          <>
            <h2 className="text-xl font-bold">This site isn&apos;t for you</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You must be {AGE_GATE_MINIMUM_AGE}+ to enter this site — it sells nicotine vaping products.
            </p>
            <button
              type="button"
              onClick={() => setStatus("gated")}
              className="mt-4 text-xs text-muted-foreground underline underline-offset-4"
            >
              I made a mistake
            </button>
          </>
        ) : (
          <>
            <h2 id="age-gate-title" className="text-xl font-bold">
              Are you {AGE_GATE_MINIMUM_AGE} or older?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This site sells nicotine vaping products. Please confirm your age to continue.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={denyAge}>
                No, I&apos;m under {AGE_GATE_MINIMUM_AGE}
              </Button>
              <Button className="flex-1" onClick={confirmAge}>
                Yes, I&apos;m {AGE_GATE_MINIMUM_AGE}+
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
