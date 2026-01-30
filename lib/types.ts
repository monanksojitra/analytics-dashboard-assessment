export interface ElectricVehicle {
  id: number;
  vin: string;
  county: string;
  city: string;
  state: string;
  postal_code: string;
  model_year: number;
  make: string;
  model: string;
  ev_type: "BEV" | "PHEV" | string;
  cafv_eligibility: string;
  electric_range: number;
  base_msrp: number;
  legislative_district: number | null;
  dol_vehicle_id: number;
  vehicle_location: string; // POINT geometry as string
  electric_utility: string;
  census_tract: string;
  created_at?: string;
}

export interface DashboardMetrics {
  totalVehicles: number;
  bevCount: number;
  phevCount: number;
  avgElectricRange: number;
  topCounty: string;
  topMake: string;
  yearOverYearGrowth: number;
}

export interface CountyData {
  county: string;
  count: number;
}

export interface MakeData {
  make: string;
  count: number;
  percentage: number;
}

export interface YearlyData {
  year: number;
  count: number;
  bevCount: number;
  phevCount: number;
}

export interface RangeDistribution {
  range: string;
  count: number;
}

export interface FilterState {
  counties: string[];
  years: number[];
  makes: string[];
  evType: "all" | "BEV" | "PHEV";
  searchQuery: string;
}
