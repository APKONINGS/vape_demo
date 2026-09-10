"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", file);

  const res = await fetch("/admin/api/upload", { method: "POST", body });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error ?? "Upload failed.");
  return data.url as string;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;

    setUploadingCount((n) => n + list.length);

    const results = await Promise.allSettled(list.map(uploadFile));

    const uploaded: string[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        uploaded.push(result.value);
      } else {
        toast.error(result.reason instanceof Error ? result.reason.message : "Image upload failed.");
      }
    }

    if (uploaded.length > 0) onChange([...images, ...uploaded]);
    setUploadingCount((n) => n - list.length);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <Label>Product images</Label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((src, index) => (
            <div key={src} className="group relative aspect-square overflow-hidden rounded-md border">
              <Image src={src} alt={`Product image ${index + 1}`} fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-primary bg-accent" : "border-input hover:bg-accent/50"
        )}
      >
        {uploadingCount > 0 ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Uploading {uploadingCount} image{uploadingCount === 1 ? "" : "s"}...
            </p>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag images here, or <span className="font-medium text-foreground">click to browse</span> your device
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {images.length === 0 && uploadingCount === 0 && (
        <p className="text-xs text-destructive">At least one image is required.</p>
      )}
    </div>
  );
}
