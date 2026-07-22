import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [productCount, orderCount, revenue, categoryCount, collectionCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "PAID" } }),
    prisma.category.count(),
    prisma.collection.count(),
  ]);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Orders", value: orderCount, href: "/admin/orders" },
    { label: "Revenue", value: formatPrice(revenue._sum.total ?? 0), href: "/admin/orders" },
    { label: "Categories", value: categoryCount, href: "/admin/categories" },
    { label: "Collections", value: collectionCount, href: "/admin/collections" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{stat.value}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
