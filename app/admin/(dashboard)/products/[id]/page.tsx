import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/products";
import { EditProductForm } from "@/components/admin/edit-product-form";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Edit Product</h1>
      <EditProductForm product={toProductDTO(product)} categories={categories} />
    </div>
  );
}
