import { prisma } from "@/lib/prisma";
import { asCartItems } from "@/lib/json";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/constants";

// Orders in these statuses represent money actually collected. PENDING never
// completed, CANCELLED/REFUNDED gave it back — none of those count as revenue.
const REVENUE_STATUSES: OrderStatus[] = ["PAID", "FULFILLED"];

export const ANALYTICS_RANGES = [
  { key: "7", label: "Last 7 days", days: 7 },
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "90", label: "Last 90 days", days: 90 },
  { key: "all", label: "All time", days: null },
] as const;
export type AnalyticsRangeKey = (typeof ANALYTICS_RANGES)[number]["key"];

export interface RevenuePoint {
  date: string; // YYYY-MM-DD
  revenue: number; // cents
  orders: number;
}

export interface TopProduct {
  productId: string;
  title: string;
  unitsSold: number;
  revenue: number; // cents
}

export interface StatusCount {
  status: OrderStatus;
  count: number;
}

export interface SalesAnalytics {
  totalRevenue: number; // cents
  orderCount: number;
  averageOrderValue: number; // cents
  unitsSold: number;
  revenueByDay: RevenuePoint[];
  statusBreakdown: StatusCount[];
  topProducts: TopProduct[];
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function resolveRange(key: string | undefined): (typeof ANALYTICS_RANGES)[number] {
  return ANALYTICS_RANGES.find((r) => r.key === key) ?? ANALYTICS_RANGES[1]; // default: 30 days
}

export async function getSalesAnalytics(rangeKey: string | undefined): Promise<SalesAnalytics> {
  const range = resolveRange(rangeKey);
  const since = range.days ? new Date(Date.now() - range.days * 24 * 60 * 60 * 1000) : undefined;

  const orders = await prisma.order.findMany({
    where: since ? { createdAt: { gte: since } } : undefined,
    orderBy: { createdAt: "asc" },
    select: { total: true, status: true, items: true, createdAt: true },
  });

  const revenueOrders = orders.filter((o) => REVENUE_STATUSES.includes(o.status as OrderStatus));
  const totalRevenue = revenueOrders.reduce((sum, o) => sum + o.total, 0);
  const orderCount = revenueOrders.length;
  const averageOrderValue = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

  // Bucket revenue-counted orders by day, filling in zero-revenue days so the
  // chart is a continuous line rather than skipping straight over quiet days.
  const byDay = new Map<string, { revenue: number; orders: number }>();
  for (const order of revenueOrders) {
    const key = dayKey(order.createdAt);
    const existing = byDay.get(key) ?? { revenue: 0, orders: 0 };
    existing.revenue += order.total;
    existing.orders += 1;
    byDay.set(key, existing);
  }

  // Walk day buckets in UTC throughout — dayKey() already reads the UTC calendar date
  // (via toISOString), so the cursor must advance in UTC too. Mixing in local-time
  // truncation here (toDateString()/getDate()/setDate()) silently dropped "today"'s
  // bucket on any host with a positive UTC offset: local midnight in UTC+1 is still
  // 23:00 UTC the day before, so the loop's last cursor landed on yesterday's UTC date
  // and never generated a bucket for today at all, even though today's orders were
  // correctly counted in the KPI totals above.
  const bucketStart = since ?? (orders[0]?.createdAt ?? new Date());
  const revenueByDay: RevenuePoint[] = [];
  const now = new Date();
  const cursor = new Date(
    Date.UTC(bucketStart.getUTCFullYear(), bucketStart.getUTCMonth(), bucketStart.getUTCDate())
  );
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  while (cursor <= end) {
    const key = dayKey(cursor);
    const bucket = byDay.get(key);
    revenueByDay.push({ date: key, revenue: bucket?.revenue ?? 0, orders: bucket?.orders ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const statusBreakdown: StatusCount[] = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  const productAgg = new Map<string, TopProduct>();
  let unitsSold = 0;
  for (const order of revenueOrders) {
    for (const item of asCartItems(order.items)) {
      unitsSold += item.quantity;
      const existing = productAgg.get(item.productId) ?? {
        productId: item.productId,
        title: item.title,
        unitsSold: 0,
        revenue: 0,
      };
      existing.unitsSold += item.quantity;
      existing.revenue += item.price * item.quantity;
      productAgg.set(item.productId, existing);
    }
  }
  const topProducts = Array.from(productAgg.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return { totalRevenue, orderCount, averageOrderValue, unitsSold, revenueByDay, statusBreakdown, topProducts };
}
