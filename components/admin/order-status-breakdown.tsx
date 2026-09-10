import { CheckCircle2, Clock, PackageCheck, RotateCcw, XCircle, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StatusCount } from "@/lib/analytics";
import type { OrderStatus } from "@/lib/constants";

// Status palette (dataviz skill) — fixed, never themed, always paired with an
// icon + label so meaning never rides on color alone.
const STATUS_STYLE: Record<OrderStatus, { icon: LucideIcon; color: string; label: string }> = {
  PENDING: { icon: Clock, color: "#fab219", label: "Pending" },
  PAID: { icon: CheckCircle2, color: "#0ca30c", label: "Paid" },
  FULFILLED: { icon: PackageCheck, color: "#0ca30c", label: "Fulfilled" },
  CANCELLED: { icon: XCircle, color: "#898781", label: "Cancelled" },
  REFUNDED: { icon: RotateCcw, color: "#d03b3b", label: "Refunded" },
};

export function OrderStatusBreakdown({ breakdown }: { breakdown: StatusCount[] }) {
  const total = breakdown.reduce((sum, s) => sum + s.count, 0);

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {breakdown.map(({ status, count }) => {
        const style = STATUS_STYLE[status];
        const Icon = style.icon;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <li key={status} className="rounded-md border p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: style.color }} aria-hidden="true" />
              {style.label}
            </div>
            <p className={cn("mt-1 text-xl font-semibold")}>{count}</p>
            <p className="text-xs text-muted-foreground">{total > 0 ? `${pct}%` : "—"}</p>
          </li>
        );
      })}
    </ul>
  );
}
