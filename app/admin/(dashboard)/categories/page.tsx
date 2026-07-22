import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CategoryDialog } from "@/components/admin/category-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteCategoryAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin — Categories" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } }, parent: true },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <CategoryDialog allCategories={categories} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="font-mono text-xs">{category.slug}</TableCell>
              <TableCell>
                <Badge variant="secondary">{category.vehicleType}</Badge>
              </TableCell>
              <TableCell>{category.parent?.name ?? <span className="text-muted-foreground">—</span>}</TableCell>
              <TableCell>{category._count.products}</TableCell>
              <TableCell className="text-right">
                <CategoryDialog category={category} allCategories={categories} />
                <ConfirmDeleteButton
                  title="Delete category"
                  description={`Delete "${category.name}"? Products in it become uncategorized.`}
                  action={deleteCategoryAction.bind(null, category.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
