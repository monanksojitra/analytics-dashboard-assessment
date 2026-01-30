"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { memo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardContext } from "../providers/dashboard-provider";

export const RangeDistribution = memo(function RangeDistribution() {
  const { rangeData, isLoading } = useDashboardContext();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Electric Range Distribution</CardTitle>
          <CardDescription>
            Distribution of vehicles by electric range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading chart...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rangeData || rangeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Electric Range Distribution</CardTitle>
          <CardDescription>
            Distribution of vehicles by electric range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>Electric Range Distribution</CardTitle>
        <CardDescription>
          Number of vehicles by range category (miles)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={rangeData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="range" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                      <p className="font-semibold">
                        {payload[0].payload.range} miles
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(payload[0].value as number)} vehicles
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRange)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
