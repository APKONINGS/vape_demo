import { prisma } from "@/lib/prisma";
import { NewProductForm } from "@/components/admin/new-product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">New Product</h1>
      <NewProductForm categories={categories} />
    </div>
  );
}
