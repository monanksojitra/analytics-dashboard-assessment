"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { memo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDashboardContext } from "../providers/dashboard-provider";
import { COLORS } from "@/lib/constant";

export const MakeDistribution = memo(function MakeDistribution() {
  const { makeData, isLoading } = useDashboardContext();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Share by Manufacturer</CardTitle>
          <CardDescription>Distribution of EVs by make</CardDescription>
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

  if (!makeData || makeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Share by Manufacturer</CardTitle>
          <CardDescription>Distribution of EVs by make</CardDescription>
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
        <CardTitle>Market Share by Manufacturer</CardTitle>
        <CardDescription>Top 10 manufacturers + others</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={makeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) =>
                `${name}: ${formatPercentage(percentage, 1)}`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
            >
              {makeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                      <p className="font-semibold">{data.make}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(data.count)} vehicles (
                        {formatPercentage(data.percentage, 1)})
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconSize={10}
              wrapperStyle={{
                fontSize: "12px",
              }}
              height={36}
              formatter={(value, entry: any) =>
                `${value} (${formatPercentage(entry.payload.percentage, 1)})`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
