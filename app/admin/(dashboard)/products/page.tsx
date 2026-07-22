import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const products = (
    await prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } })
  ).map(toProductDTO);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> New Product
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.images[0] && (
                  <div className="relative h-12 w-10 overflow-hidden rounded bg-muted">
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>
                {product.category ? (
                  product.category.name
                ) : (
                  <span className="text-muted-foreground">Uncategorized</span>
                )}
              </TableCell>
              <TableCell>
                {product.salePrice ? (
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    <span>{formatPrice(product.salePrice)}</span>
                  </span>
                ) : (
                  formatPrice(product.price)
                )}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.stock > 0 ? "secondary" : "outline"}>
                  {product.stock > 0 ? "Active" : "Out of stock"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                <DeleteProductButton id={product.id} title={product.title} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
