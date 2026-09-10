import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { requireAdmin } from "@/lib/require-admin";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: Request) {
  // Route lives under /admin/ so middleware.ts already gates it at the edge — this is
  // defense-in-depth, same convention as every server action in app/admin/actions.ts.
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden: admin access required." }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be smaller than 8MB." }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads aren't configured yet. Add a Vercel Blob store and BLOB_READ_WRITE_TOKEN." },
      { status: 500 }
    );
  }

  const blob = await put(`products/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
