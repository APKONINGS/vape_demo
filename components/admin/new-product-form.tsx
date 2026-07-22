"use client";

import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "@/app/admin/actions";

interface CategoryOption {
  id: string;
  name: string;
}

export function NewProductForm({ categories }: { categories: CategoryOption[] }) {
  return <ProductForm categories={categories} onSubmit={createProductAction} />;
}
