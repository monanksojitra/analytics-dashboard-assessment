"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import useSWR from "swr";
import type {
  FilterState,
  DashboardMetrics,
  CountyData,
  MakeData,
  YearlyData,
  RangeDistribution,
} from "@/lib/types";
import {
  getDashboardMetrics,
  getCountyDistribution,
  getMakeDistribution,
  getYearlyTrends,
  getRangeDistribution,
  getCAFVEligibility,
  getTopModels,
  getFilterOptions,
} from "@/lib/queries";

interface DashboardContextType {
  // Data
  metrics: DashboardMetrics | undefined;
  countyData: CountyData[] | undefined;
  makeData: MakeData[] | undefined;
  yearlyData: YearlyData[] | undefined;
  rangeData: RangeDistribution[] | undefined;
  cafvData: any[] | undefined;
  topModels: any[] | undefined;
  topModelsData: any[] | undefined;
  filterOptions: any | undefined;

  // State
  filters: FilterState;
  isLoading: boolean;
  error: any;

  // Actions
  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    counties: [],
    years: [2012, 2024],
    makes: [],
    evType: "all",
    searchQuery: "",
  });

  const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 2000,
    focusThrottleInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  };

  // Fetch all data
  const {
    data: metrics,
    error: metricsError,
    isLoading: metricsLoading,
  } = useSWR(
    ["dashboard-metrics", filters],
    () => getDashboardMetrics(filters),
    swrConfig,
  );

  const { data: countyData, error: countyError } = useSWR(
    ["county-distribution", filters],
    () => getCountyDistribution(10, filters),
    swrConfig,
  );

  const { data: makeData, error: makeError } = useSWR(
    ["make-distribution", filters],
    () => getMakeDistribution(10, filters),
    swrConfig,
  );

  const { data: yearlyData, error: yearlyError } = useSWR(
    ["yearly-trends", filters],
    () => getYearlyTrends(filters),
    swrConfig,
  );

  const { data: rangeData, error: rangeError } = useSWR(
    ["range-distribution", filters],
    () => getRangeDistribution(filters),
    swrConfig,
  );

  const { data: cafvData, error: cafvError } = useSWR(
    ["cafv-eligibility", filters],
    () => getCAFVEligibility(filters),
    swrConfig,
  );

  const { data: topModels, error: modelsError } = useSWR(
    ["top-models", filters],
    () => getTopModels(20, filters),
    swrConfig,
  );

  const { data: filterOptions } = useSWR("filter-options", getFilterOptions, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      counties: [],
      years: [
        filterOptions?.years.min || 2012,
        filterOptions?.years.max || 2024,
      ],
      makes: [],
      evType: "all",
      searchQuery: "",
    });
  }, [filterOptions]);

  const error =
    metricsError ||
    countyError ||
    makeError ||
    yearlyError ||
    rangeError ||
    cafvError ||
    modelsError;

  const value = {
    metrics,
    countyData,
    makeData,
    yearlyData,
    rangeData,
    cafvData,
    topModels,
    topModelsData: topModels,
    filterOptions,
    filters,
    isLoading: metricsLoading,
    error,
    updateFilters,
    resetFilters,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider",
    );
  }
  return context;
}
