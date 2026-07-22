"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
        {current && (
          <Image
            src={current}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md bg-muted ring-offset-background transition",
                active === index ? "ring-2 ring-ring ring-offset-2" : "opacity-70 hover:opacity-100"
              )}
            >
              <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill loading="lazy" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
