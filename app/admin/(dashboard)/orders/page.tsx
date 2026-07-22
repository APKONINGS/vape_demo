import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { asCartItems } from "@/lib/json";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Orders" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Orders</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const items = asCartItems(order.items);
            return (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(-8).toUpperCase()}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{items.reduce((sum, i) => sum + i.quantity, 0)}</TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
