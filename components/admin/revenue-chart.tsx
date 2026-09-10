"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatPrice } from "@/lib/utils";
import type { RevenuePoint } from "@/lib/analytics";

const SERIES_COLOR = "#2a78d6"; // dataviz skill: categorical slot 1 (blue), validated for light surfaces

function formatCompactCents(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1000) return `$${(dollars / 1000).toFixed(dollars >= 10000 ? 0 : 1)}K`;
  return `$${Math.round(dollars)}`;
}

function formatDateLabel(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: RevenuePoint }> }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-md border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-foreground">{formatPrice(point.revenue)}</p>
      <p className="text-xs text-muted-foreground">
        {formatDateLabel(point.date)} &middot; {point.orders} order{point.orders === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity={0.1} />
            <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="0" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateLabel}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickLine={false}
          minTickGap={32}
        />
        <YAxis
          tickFormatter={formatCompactCents}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={SERIES_COLOR}
          strokeWidth={2}
          fill="url(#revenue-fill)"
          activeDot={{ r: 4, fill: SERIES_COLOR, stroke: "hsl(var(--card))", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
