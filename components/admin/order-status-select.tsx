"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrderStatusAction } from "@/app/admin/actions";

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await updateOrderStatusAction({ orderId, status: value });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Order status updated.");
      router.refresh();
    });
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
