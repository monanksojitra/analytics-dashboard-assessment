"use client";

import { Suspense, lazy } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { VehicleTable } from "@/components/dashboard/VehicleTable";
import { ChartSkeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load chart components for better performance
const CountyDistribution = lazy(() =>
  import("@/components/charts/CountyDistribution").then((mod) => ({
    default: mod.CountyDistribution,
  })),
);
const MakeDistribution = lazy(() =>
  import("@/components/charts/MakeDistribution").then((mod) => ({
    default: mod.MakeDistribution,
  })),
);
const AdoptionTimeline = lazy(() =>
  import("@/components/charts/AdoptionTimeline").then((mod) => ({
    default: mod.AdoptionTimeline,
  })),
);
const RangeDistribution = lazy(() =>
  import("@/components/charts/RangeDistribution").then((mod) => ({
    default: mod.RangeDistribution,
  })),
);
const CAFVEligibility = lazy(() =>
  import("@/components/charts/CAFVEligibility").then((mod) => ({
    default: mod.CAFVEligibility,
  })),
);
const TopModels = lazy(() =>
  import("@/components/charts/TopModels").then((mod) => ({
    default: mod.TopModels,
  })),
);

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight">
                Electric Vehicle Analytics
              </h1>
              <p className="mt-2 text-muted-foreground">
                Comprehensive insights from 50,000+ electric vehicles across
                Washington State
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="explore">Explore</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <MetricsGrid />

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <ErrorBoundary>
                        <Suspense fallback={<ChartSkeleton />}>
                          <CountyDistribution />
                        </Suspense>
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <Suspense fallback={<ChartSkeleton />}>
                          <MakeDistribution />
                        </Suspense>
                      </ErrorBoundary>
                    </div>

                    <ErrorBoundary>
                      <Suspense fallback={<ChartSkeleton />}>
                        <AdoptionTimeline />
                      </Suspense>
                    </ErrorBoundary>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <ErrorBoundary>
                        <Suspense fallback={<ChartSkeleton />}>
                          <RangeDistribution />
                        </Suspense>
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <Suspense fallback={<ChartSkeleton />}>
                          <CAFVEligibility />
                        </Suspense>
                      </ErrorBoundary>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <FilterPanel />
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <ErrorBoundary>
                      <Suspense fallback={<ChartSkeleton />}>
                        <TopModels />
                      </Suspense>
                    </ErrorBoundary>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <ErrorBoundary>
                        <Suspense fallback={<ChartSkeleton />}>
                          <CountyDistribution />
                        </Suspense>
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <Suspense fallback={<ChartSkeleton />}>
                          <MakeDistribution />
                        </Suspense>
                      </ErrorBoundary>
                    </div>

                    <ErrorBoundary>
                      <Suspense fallback={<ChartSkeleton />}>
                        <AdoptionTimeline />
                      </Suspense>
                    </ErrorBoundary>
                  </div>

                  <div className="lg:col-span-1">
                    <FilterPanel />
                  </div>
                </div>
              </TabsContent>

              {/* Explore Tab */}
              <TabsContent value="explore" className="space-y-6">
                <VehicleTable />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
