"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCollectionAction, updateCollectionAction } from "@/app/admin/actions";

export interface CollectionOption {
  id: string;
  title: string;
  slug: string;
  bannerUrl: string | null;
  products: { id: string }[];
}

interface ProductOption {
  id: string;
  title: string;
}

interface CollectionDialogProps {
  collection?: CollectionOption;
  allProducts: ProductOption[];
}

export function CollectionDialog({ collection, allProducts }: CollectionDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(collection?.title ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [bannerUrl, setBannerUrl] = useState(collection?.bannerUrl ?? "");
  const [productIds, setProductIds] = useState<string[]>(collection?.products.map((p) => p.id) ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleProduct(id: string) {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const input = {
      title,
      slug,
      bannerUrl: bannerUrl.trim() ? bannerUrl.trim() : null,
      productIds,
    };

    const result = collection
      ? await updateCollectionAction(collection.id, input)
      : await createCollectionAction(input);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast.success(result.success ?? "Saved.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {collection ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{collection ? "Edit Collection" : "New Collection"}</DialogTitle>
          <DialogDescription>Collections power the homepage carousels and /collections pages.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="col-title">Title</Label>
            <Input id="col-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="col-slug">Slug</Label>
            <Input
              id="col-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="new-arrivals"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="col-banner">Banner image URL</Label>
            <Input
              id="col-banner"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label>Products in this collection</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
              {allProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={productIds.includes(product.id)}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                  <Label htmlFor={`product-${product.id}`} className="cursor-pointer font-normal">
                    {product.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : collection ? "Save changes" : "Create collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
