import { supabase } from "./supabase/client";
import type {
  ElectricVehicle,
  DashboardMetrics,
  CountyData,
  MakeData,
  YearlyData,
  RangeDistribution,
  FilterState,
} from "./types";

/**
 * Get comprehensive dashboard metrics
 */
export async function getDashboardMetrics(
  filters?: Partial<FilterState>,
): Promise<DashboardMetrics> {
  let query = supabase
    .from("electric_vehicles")
    .select("ev_type, electric_range, county, make, model_year");

  // Apply filters
  if (filters?.counties && filters.counties.length > 0) {
    query = query.in("county", filters.counties);
  }
  if (filters?.years && filters.years.length === 2) {
    query = query
      .gte("model_year", filters.years[0])
      .lte("model_year", filters.years[1]);
  }
  if (filters?.makes && filters.makes.length > 0) {
    query = query.in("make", filters.makes);
  }
  if (filters?.evType && filters.evType !== "all") {
    query = query.ilike("ev_type", `%${filters.evType}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }

  const totalVehicles = data.length;
  const bevCount = data.filter((v) => v.ev_type?.includes("BEV")).length;
  const phevCount = totalVehicles - bevCount;

  // Calculate average electric range (excluding 0 values)
  const validRanges = data.filter((v) => v.electric_range > 0);
  const avgRange =
    validRanges.length > 0
      ? validRanges.reduce((sum, v) => sum + v.electric_range, 0) /
        validRanges.length
      : 0;

  // Find top county
  const countyCounts = data.reduce(
    (acc, v) => {
      if (v.county) {
        acc[v.county] = (acc[v.county] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCounty =
    Object.entries(countyCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "Unknown";

  // Find top make
  const makeCounts = data.reduce(
    (acc, v) => {
      if (v.make) {
        acc[v.make] = (acc[v.make] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const topMake =
    Object.entries(makeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "Unknown";

  // Calculate year-over-year growth (2023 vs 2024)
  const vehicles2023 = data.filter((v) => v.model_year === 2023).length;
  const vehicles2024 = data.filter((v) => v.model_year === 2024).length;
  const yoyGrowth =
    vehicles2023 > 0 ? ((vehicles2024 - vehicles2023) / vehicles2023) * 100 : 0;

  return {
    totalVehicles,
    bevCount,
    phevCount,
    avgElectricRange: Math.round(avgRange),
    topCounty,
    topMake,
    yearOverYearGrowth: Math.round(yoyGrowth * 10) / 10, // Round to 1 decimal
  };
}

/**
 * Get county distribution data
 */
export async function getCountyDistribution(
  limit: number = 10,
  filters?: Partial<FilterState>,
): Promise<CountyData[]> {
  let query = supabase.from("electric_vehicles").select("county");

  // Apply filters
  if (filters?.years && filters.years.length === 2) {
    query = query
      .gte("model_year", filters.years[0])
      .lte("model_year", filters.years[1]);
  }
  if (filters?.makes && filters.makes.length > 0) {
    query = query.in("make", filters.makes);
  }
  if (filters?.evType && filters.evType !== "all") {
    query = query.ilike("ev_type", `%${filters.evType}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching county distribution:", error);
    throw error;
  }

  // Count vehicles by county
  const countyCounts = data.reduce(
    (acc, v) => {
      if (v.county) {
        acc[v.county] = (acc[v.county] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to array and sort
  return Object.entries(countyCounts)
    .map(([county, count]) => ({ county, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get make (manufacturer) distribution data
 */
export async function getMakeDistribution(
  limit: number = 10,
  filters?: Partial<FilterState>,
): Promise<MakeData[]> {
  let query = supabase.from("electric_vehicles").select("make");

  // Apply filters
  if (filters?.counties && filters.counties.length > 0) {
    query = query.in("county", filters.counties);
  }
  if (filters?.years && filters.years.length === 2) {
    query = query
      .gte("model_year", filters.years[0])
      .lte("model_year", filters.years[1]);
  }
  if (filters?.evType && filters.evType !== "all") {
    query = query.ilike("ev_type", `%${filters.evType}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching make distribution:", error);
    throw error;
  }

  const totalVehicles = data.length;

  // Count vehicles by make
  const makeCounts = data.reduce(
    (acc, v) => {
      if (v.make) {
        acc[v.make] = (acc[v.make] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to array, sort, and calculate percentages
  const topMakes = Object.entries(makeCounts)
    .map(([make, count]) => ({
      make,
      count,
      percentage: (count / totalVehicles) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  // Calculate "Others" category
  const topMakesCount = topMakes.reduce((sum, m) => sum + m.count, 0);
  const othersCount = totalVehicles - topMakesCount;

  if (othersCount > 0) {
    topMakes.push({
      make: "Others",
      count: othersCount,
      percentage: (othersCount / totalVehicles) * 100,
    });
  }

  return topMakes;
}

/**
 * Get yearly trends data
 */
export async function getYearlyTrends(
  filters?: Partial<FilterState>,
): Promise<YearlyData[]> {
  let query = supabase
    .from("electric_vehicles")
    .select("model_year, ev_type")
    .order("model_year", { ascending: true });

  // Apply filters
  if (filters?.counties && filters.counties.length > 0) {
    query = query.in("county", filters.counties);
  }
  if (filters?.makes && filters.makes.length > 0) {
    query = query.in("make", filters.makes);
  }
  if (filters?.years && filters.years.length === 2) {
    query = query
      .gte("model_year", filters.years[0])
      .lte("model_year", filters.years[1]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching yearly trends:", error);
    throw error;
  }

  // Group by year
  const yearGroups = data.reduce(
    (acc, v) => {
      if (v.model_year) {
        if (!acc[v.model_year]) {
          acc[v.model_year] = { bev: 0, phev: 0 };
        }
        if (v.ev_type?.includes("BEV")) {
          acc[v.model_year].bev++;
        } else {
          acc[v.model_year].phev++;
        }
      }
      return acc;
    },
    {} as Record<number, { bev: number; phev: number }>,
  );

  // Convert to array
  return Object.entries(yearGroups)
    .map(([year, counts]) => ({
      year: parseInt(year),
      count: counts.bev + counts.phev,
      bevCount: counts.bev,
      phevCount: counts.phev,
    }))
    .sort((a, b) => a.year - b.year);
}

/**
 * Get electric range distribution
 */
export async function getRangeDistribution(
  filters?: Partial<FilterState>,
): Promise<RangeDistribution[]> {
  let query = supabase.from("electric_vehicles").select("electric_range");

  // Apply filters
  if (filters?.counties && filters.counties.length > 0) {
    query = query.in("county", filters.counties);
  }
  if (filters?.years && filters.years.length === 2) {
    query = query
      .gte("model_year", filters.years[0])
      .lte("model_year", filters.years[1]);
  }
  if (filters?.makes && filters.makes.length > 0) {
    query = query.in("make", filters.makes);
  }
  if (filters?.evType && filters.evType !== "all") {
    query = query.ilike("ev_type", `%${filters.evType}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching range distribution:", error);
    throw error;
  }

  // Define range categories
  const categories = [
    { range: "0-50", min: 0, max: 50 },
    { range: "51-100", min: 51, max: 100 },
    { range: "101-150", min: 101, max: 150 },
    { range: "151-200", min: 151, max: 200 },
    { range: "201-250", min: 201, max: 250 },
    { range: "250+", min: 251, max: Infinity },
  ];

  // Count vehicles in each category
  const distribution = categories.map((cat) => {
    const count = data.filter(
      (v) => v.electric_range >= cat.min && v.electric_range <= cat.max,
    ).length;
    return { range: cat.range, count };
  });

  return distribution;
}

/**
 * Get CAFV eligibility breakdown
 */
export async function getCAFVEligibility(filters?: Partial<FilterState>) {
  let query = supabase.from("electric_vehicles").select("cafv_eligibility");

  // Apply filters
  if (filters?.counties && filters.counties.length > 0) {
    query = query.in("county", filters.counties);
  }
  if (filters?.years && filters.years.length === 2) {
    query = query
      .gte("model_year", filters.years[0])
      .lte("model_year", filters.years[1]);
  }
  if (filters?.makes && filters.makes.length > 0) {
    query = query.in("make", filters.makes);
  }
  if (filters?.evType && filters.evType !== "all") {
    query = query.ilike("ev_type", `%${filters.evType}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching CAFV eligibility:", error);
    throw error;
  }

  // Count by eligibility status
  const eligibilityCounts = data.reduce(
    (acc, v) => {
      const status = v.cafv_eligibility || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(eligibilityCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get top models
 */
export async function getTopModels(
  limit: number = 20,
  filters?: Partial<FilterState>,
) {
  let query = supabase.from("electric_vehicles").select("make, model");

  // Apply filters
  if (filters?.counties && filters.counties.length > 0) {
    query = query.in("county", filters.counties);
  }
  if (filters?.years && filters.years.length === 2) {
    query = query
      .gte("model_year", filters.years[0])
      .lte("model_year", filters.years[1]);
  }
  if (filters?.makes && filters.makes.length > 0) {
    query = query.in("make", filters.makes);
  }
  if (filters?.evType && filters.evType !== "all") {
    query = query.ilike("ev_type", `%${filters.evType}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching top models:", error);
    throw error;
  }

  // Combine make and model
  const modelCounts = data.reduce(
    (acc, v) => {
      if (v.make && v.model) {
        const key = `${v.make} ${v.model}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(modelCounts)
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get filtered vehicles with pagination
 */
export async function getVehicles(
  filters?: Partial<FilterState>,
  page: number = 1,
  pageSize: number = 100,
) {
  let query = supabase
    .from("electric_vehicles")
    .select("*", { count: "exact" });

  // Apply filters
  if (filters?.counties && filters.counties.length > 0) {
    query = query.in("county", filters.counties);
  }

  if (filters?.years && filters.years.length === 2) {
    query = query
      .gte("model_year", filters.years[0])
      .lte("model_year", filters.years[1]);
  }

  if (filters?.makes && filters.makes.length > 0) {
    query = query.in("make", filters.makes);
  }

  if (filters?.evType && filters.evType !== "all") {
    if (filters.evType === "BEV") {
      query = query.ilike("ev_type", "%BEV%");
    } else if (filters.evType === "PHEV") {
      query = query.ilike("ev_type", "%PHEV%");
    }
  }

  if (filters?.searchQuery) {
    query = query.or(
      `vin.ilike.%${filters.searchQuery}%,` +
        `make.ilike.%${filters.searchQuery}%,` +
        `model.ilike.%${filters.searchQuery}%,` +
        `city.ilike.%${filters.searchQuery}%`,
    );
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }

  return {
    vehicles: data as ElectricVehicle[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Get unique values for filters
 */
export async function getFilterOptions() {
  const { data, error } = await supabase
    .from("electric_vehicles")
    .select("county, make, model_year");

  if (error) {
    console.error("Error fetching filter options:", error);
    throw error;
  }

  // Extract unique values
  const counties = [
    ...new Set(data.map((v) => v.county).filter(Boolean)),
  ].sort();
  const makes = [...new Set(data.map((v) => v.make).filter(Boolean))].sort();
  const years = [
    ...new Set(data.map((v) => v.model_year).filter(Boolean)),
  ].sort((a, b) => a - b);

  return {
    counties,
    makes,
    years: {
      min: years[0] || 2012,
      max: years[years.length - 1] || 2024,
    },
  };
}
