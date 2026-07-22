import Image from "next/image";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { asCartItems } from "@/lib/json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManageBillingButton } from "@/components/manage-billing-button";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await auth();
  const user = session!.user;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 flex items-center gap-4">
        {user.image ? (
          <Image src={user.image} alt={user.name ?? "Avatar"} width={64} height={64} className="rounded-full" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-xl font-semibold">
            {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.name ?? "My Account"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Billing</CardTitle>
          <ManageBillingButton />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Update your payment methods and view invoices via Stripe&apos;s secure customer portal.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const items = asCartItems(order.items);
                return (
                  <div key={order.id} className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {items.length} item{items.length === 1 ? "" : "s"} &middot;{" "}
                        {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{order.status}</Badge>
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
