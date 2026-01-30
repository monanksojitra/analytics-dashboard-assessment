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

const COLORS = ["#10B981", "#EF4444", "#94A3B8"];

export const CAFVEligibility = memo(function CAFVEligibility() {
  const { cafvData, isLoading } = useDashboardContext();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CAFV Eligibility</CardTitle>
          <CardDescription>
            Clean Alternative Fuel Vehicle eligibility status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading chart...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cafvData || cafvData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CAFV Eligibility</CardTitle>
          <CardDescription>
            Clean Alternative Fuel Vehicle eligibility status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVehicles = cafvData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>CAFV Eligibility</CardTitle>
        <CardDescription>
          Clean Alternative Fuel Vehicle eligibility breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={cafvData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="count"
              label={({ status, count }) =>
                `${status}: ${formatPercentage((count / totalVehicles) * 100, 1)}`
              }
            >
              {cafvData.map((entry: any, index: number) => (
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
                      <p className="font-semibold">{data.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(data.count)} vehicles
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(
                          (data.count / totalVehicles) * 100,
                          2,
                        )}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
