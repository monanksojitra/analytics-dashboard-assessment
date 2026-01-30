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
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardContext } from "../providers/dashboard-provider";

export const AdoptionTimeline = memo(function AdoptionTimeline() {
  const { yearlyData, isLoading } = useDashboardContext();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>EV Adoption Timeline</CardTitle>
          <CardDescription>
            Year-over-year growth in EV registrations
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

  if (!yearlyData || yearlyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>EV Adoption Timeline</CardTitle>
          <CardDescription>
            Year-over-year growth in EV registrations
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
        <CardTitle>EV Adoption Timeline</CardTitle>
        <CardDescription>
          Cumulative registrations by year (BEV vs PHEV)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={yearlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="year" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                      <p className="font-semibold mb-2">Year {label}</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-blue-600">
                          Total: {formatNumber(payload[0].value as number)}
                        </p>
                        <p className="text-green-600">
                          BEV: {formatNumber(payload[1].value as number)}
                        </p>
                        <p className="text-purple-600">
                          PHEV: {formatNumber(payload[2].value as number)}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Total Vehicles"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="bevCount"
              stroke="#10B981"
              strokeWidth={2}
              name="BEV"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="phevCount"
              stroke="#8B5CF6"
              strokeWidth={2}
              name="PHEV"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
