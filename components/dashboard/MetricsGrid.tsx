"use client";

import { formatNumber, formatPercentage } from "@/lib/utils";
import { Battery, Car, Factory, Gauge, MapPin } from "lucide-react";
import { useDashboardContext } from "../providers/dashboard-provider";
import { MetricCard } from "./MetricCard";

export function MetricsGrid() {
  const { metrics, isLoading, error } = useDashboardContext();

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="col-span-full bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
          <p className="text-destructive">
            Error loading metrics. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  const bevPercentage = metrics
    ? formatPercentage((metrics.bevCount / metrics.totalVehicles) * 100, 1)
    : "0%";

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8 mt-2">
      <MetricCard
        title="Total EVs"
        value={metrics ? formatNumber(metrics.totalVehicles) : "0"}
        icon={<Car />}
        description="Total number of electric vehicles registered in Washington State"
        loading={isLoading}
      />

      <MetricCard
        title="BEV Vehicles"
        value={bevPercentage}
        icon={<Battery />}
        subtitle={
          metrics ? `${formatNumber(metrics.bevCount)} vehicles` : "0 vehicles"
        }
        description="Battery Electric Vehicles (BEV) - fully electric with no gas engine"
        loading={isLoading}
      />

      <MetricCard
        title="PHEV Vehicles"
        value={
          metrics
            ? formatPercentage(
                (metrics.phevCount / metrics.totalVehicles) * 100,
                1,
              )
            : "0%"
        }
        icon={<Battery className="opacity-70" />}
        subtitle={
          metrics ? `${formatNumber(metrics.phevCount)} vehicles` : "0 vehicles"
        }
        description="Plug-in Hybrid Electric Vehicles (PHEV) - electric + gas engine"
        loading={isLoading}
      />

      <MetricCard
        title="Avg Range"
        value={metrics ? `${metrics.avgElectricRange} mi` : "0 mi"}
        icon={<Gauge />}
        description="Average electric range across all vehicles"
        loading={isLoading}
      />

      <MetricCard
        title="Top County"
        value={metrics?.topCounty || "Loading..."}
        icon={<MapPin />}
        description="County with the highest number of EVs"
        loading={isLoading}
      />

      <MetricCard
        title="Top Make"
        value={metrics?.topMake || "Loading..."}
        icon={<Factory />}
        trend={metrics?.yearOverYearGrowth}
        description="Most popular EV manufacturer"
        loading={isLoading}
      />
    </div>
  );
}
