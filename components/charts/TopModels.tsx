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
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardContext } from "../providers/dashboard-provider";
import { COLORS } from "@/lib/constent";

export const TopModels = memo(function TopModels() {
  const { topModelsData, isLoading } = useDashboardContext();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Vehicle Models</CardTitle>
          <CardDescription>Most popular EV models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading chart...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topModelsData || topModelsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Vehicle Models</CardTitle>
          <CardDescription>Most popular EV models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Take top 15 for better visualization
  const topData = topModelsData.slice(0, 15);

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>Top Vehicle Models</CardTitle>
        <CardDescription>
          Top 15 most popular electric vehicle models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={topData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis
              dataKey="model"
              type="category"
              width={140}
              className="text-xs"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                      <p className="font-semibold text-sm">
                        {payload[0].payload.model}
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
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {topData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
