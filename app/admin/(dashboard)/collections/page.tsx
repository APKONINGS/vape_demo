import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CollectionDialog } from "@/components/admin/collection-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteCollectionAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin — Collections" };

export default async function AdminCollectionsPage() {
  const [collections, products] = await Promise.all([
    prisma.collection.findMany({
      orderBy: { title: "asc" },
      include: { products: { select: { id: true } } },
    }),
    prisma.product.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Collections</h1>
        <CollectionDialog allProducts={products} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell className="font-medium">{collection.title}</TableCell>
              <TableCell className="font-mono text-xs">{collection.slug}</TableCell>
              <TableCell>{collection.products.length}</TableCell>
              <TableCell className="text-right">
                <CollectionDialog collection={collection} allProducts={products} />
                <ConfirmDeleteButton
                  title="Delete collection"
                  description={`Delete "${collection.title}"? Products stay in the catalog but leave this collection.`}
                  action={deleteCollectionAction.bind(null, collection.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
