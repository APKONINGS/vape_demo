"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductInput } from "@/lib/validations";
import type { ProductDTO } from "@/lib/products";

const NO_CATEGORY = "none";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: ProductDTO;
  categories: CategoryOption[];
  onSubmit: (input: ProductInput) => Promise<{ error?: string; success?: string }>;
}

export function ProductForm({ product, categories, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceDollars, setPriceDollars] = useState(product ? (product.price / 100).toFixed(2) : "");
  const [salePriceDollars, setSalePriceDollars] = useState(
    product?.salePrice ? (product.salePrice / 100).toFixed(2) : ""
  );
  const [imagesText, setImagesText] = useState(product?.images.join("\n") ?? "");
  const [sizesText, setSizesText] = useState(product?.sizes.join(", ") ?? "");
  const [colorsText, setColorsText] = useState(product?.colors.join(", ") ?? "");
  const [stock, setStock] = useState(product?.stock.toString() ?? "0");
  const [active, setActive] = useState(product?.active ?? true);
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? NO_CATEGORY);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const input: ProductInput = {
      title,
      slug,
      description,
      price: Math.round(Number(priceDollars) * 100),
      salePrice: salePriceDollars.trim() ? Math.round(Number(salePriceDollars) * 100) : null,
      images: imagesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      sizes: sizesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: colorsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: Number(stock),
      active,
      categoryId: categoryId === NO_CATEGORY ? null : categoryId,
    };

    const result = await onSubmit(input);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast.success(result.success ?? "Saved.");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="arctic-parka-black"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A heavyweight expedition parka built for sustained sub-zero exposure."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="No category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CATEGORY}>No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale price (USD)</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                value={salePriceDollars}
                onChange={(e) => setSalePriceDollars(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Image URLs (one per line)</Label>
            <Textarea
              id="images"
              rows={4}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder={"https://.../image1.jpg\nhttps://.../image2.jpg"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sizes">Sizes (comma-separated)</Label>
            <Input id="sizes" value={sizesText} onChange={(e) => setSizesText(e.target.value)} placeholder="S, M, L, XL" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colors">Colors (comma-separated)</Label>
            <Input
              id="colors"
              value={colorsText}
              onChange={(e) => setColorsText(e.target.value)}
              placeholder="Black, Navy"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="active" checked={active} onCheckedChange={(checked) => setActive(checked === true)} />
            <Label htmlFor="active" className="cursor-pointer font-normal">
              Visible in store
            </Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : product ? "Save changes" : "Create product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
