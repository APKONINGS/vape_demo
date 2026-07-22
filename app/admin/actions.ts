"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { toJsonString } from "@/lib/json";
import {
  productSchema,
  orderStatusSchema,
  categorySchema,
  collectionSchema,
  type ProductInput,
  type CategoryInput,
  type CollectionInput,
} from "@/lib/validations";

type ActionResult = { error?: string; success?: string };

export async function createProductAction(input: ProductInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "A product with this slug already exists." };
  }

  await prisma.product.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      salePrice: parsed.data.salePrice,
      images: toJsonString(parsed.data.images),
      sizes: toJsonString(parsed.data.sizes),
      colors: toJsonString(parsed.data.colors),
      stock: parsed.data.stock,
      active: parsed.data.active,
      categoryId: parsed.data.categoryId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: "Product created." };
}

export async function updateProductAction(id: string, input: ProductInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }

  const conflict = await prisma.product.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) {
    return { error: "Another product already uses this slug." };
  }

  await prisma.product.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      salePrice: parsed.data.salePrice,
      images: toJsonString(parsed.data.images),
      sizes: toJsonString(parsed.data.sizes),
      colors: toJsonString(parsed.data.colors),
      stock: parsed.data.stock,
      active: parsed.data.active,
      categoryId: parsed.data.categoryId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/product/${parsed.data.slug}`);
  return { success: "Product updated." };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: "Product deleted." };
}

export async function updateOrderStatusAction(input: {
  orderId: string;
  status: string;
}): Promise<ActionResult> {
  await requireAdmin();

  const parsed = orderStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid order status." };
  }

  await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/orders");
  return { success: "Order status updated." };
}

// --- Categories ---

export async function createCategoryAction(input: CategoryInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid category data." };
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "A category with this slug already exists." };
  }

  await prisma.category.create({ data: parsed.data });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: "Category created." };
}

export async function updateCategoryAction(id: string, input: CategoryInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid category data." };
  }

  if (parsed.data.parentId === id) {
    return { error: "A category can't be its own parent." };
  }

  const conflict = await prisma.category.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (conflict) {
    return { error: "Another category already uses this slug." };
  }

  await prisma.category.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: "Category updated." };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: "Category deleted." };
}

// --- Collections ---

export async function createCollectionAction(input: CollectionInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid collection data." };
  }

  const existing = await prisma.collection.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "A collection with this slug already exists." };
  }

  await prisma.collection.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      bannerUrl: parsed.data.bannerUrl,
      products: { connect: parsed.data.productIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { success: "Collection created." };
}

export async function updateCollectionAction(id: string, input: CollectionInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid collection data." };
  }

  const conflict = await prisma.collection.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (conflict) {
    return { error: "Another collection already uses this slug." };
  }

  await prisma.collection.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      bannerUrl: parsed.data.bannerUrl,
      products: { set: parsed.data.productIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/collections");
  revalidatePath(`/collections/${parsed.data.slug}`);
  revalidatePath("/");
  return { success: "Collection updated." };
}

export async function deleteCollectionAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.collection.delete({ where: { id } });

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { success: "Collection deleted." };
}
