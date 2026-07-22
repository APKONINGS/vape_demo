"use client";

import { ThumbsUp } from "lucide-react";

import { PASSWORD_REQUIREMENTS } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      {PASSWORD_REQUIREMENTS.map((req) => {
        const met = req.test(password);
        return (
          <li
            key={req.id}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              met ? "text-green-600" : "text-muted-foreground"
            )}
          >
            <ThumbsUp className={cn("h-3.5 w-3.5 shrink-0", met ? "fill-green-600" : "fill-none")} />
            {req.label}
          </li>
        );
      })}
    </ul>
  );
}
