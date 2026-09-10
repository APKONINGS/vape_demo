import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrderStatusBreakdown } from "@/components/admin/order-status-breakdown";
import { cn, formatPrice } from "@/lib/utils";
import { ANALYTICS_RANGES, getSalesAnalytics, resolveRange } from "@/lib/analytics";

export const metadata: Metadata = { title: "Admin — Sales Analytics" };

interface AnalyticsPageProps {
  searchParams: { range?: string };
}

export default async function AdminAnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const activeRange = resolveRange(searchParams.range);
  const analytics = await getSalesAnalytics(searchParams.range);

  const kpis = [
    { label: "Revenue", value: formatPrice(analytics.totalRevenue) },
    { label: "Orders", value: analytics.orderCount.toLocaleString() },
    { label: "Average order value", value: formatPrice(analytics.averageOrderValue) },
    { label: "Units sold", value: analytics.unitsSold.toLocaleString() },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Sales Analytics</h1>

        {/* Date range — one row, above every chart/stat/table it scopes (dataviz skill). */}
        <nav aria-label="Date range" className="flex max-w-full gap-1 overflow-x-auto rounded-md border p-1">
          {ANALYTICS_RANGES.map((range) => (
            <Link
              key={range.key}
              href={`/admin/analytics?range=${range.key}`}
              className={cn(
                "shrink-0 rounded px-3 py-1.5 text-sm font-medium transition-colors",
                range.key === activeRange.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {range.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{kpi.value}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Revenue over time</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.revenueByDay.some((d) => d.revenue > 0) ? (
            <RevenueChart data={analytics.revenueByDay} />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No revenue in this period yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Orders by status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusBreakdown breakdown={analytics.statusBreakdown} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top products</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.topProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No paid orders in this period yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Units sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.topProducts.map((product, i) => (
                  <TableRow key={product.productId}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell className="text-right tabular-nums">{product.unitsSold}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatPrice(product.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
