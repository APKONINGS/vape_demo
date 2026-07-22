"use client";

import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "@/app/admin/actions";
import type { ProductDTO } from "@/lib/products";
import type { ProductInput } from "@/lib/validations";

interface CategoryOption {
  id: string;
  name: string;
}

export function EditProductForm({
  product,
  categories,
}: {
  product: ProductDTO;
  categories: CategoryOption[];
}) {
  return (
    <ProductForm
      product={product}
      categories={categories}
      onSubmit={(input: ProductInput) => updateProductAction(product.id, input)}
    />
  );
}
