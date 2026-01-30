-- Electric Vehicles Table Schema
-- This schema stores the Electric Vehicle population data from the CSV file

CREATE TABLE IF NOT EXISTS electric_vehicles (
  id SERIAL PRIMARY KEY,
  vin VARCHAR(10) NOT NULL,
  county VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(2),
  postal_code VARCHAR(10),
  model_year INTEGER,
  make VARCHAR(100),
  model VARCHAR(100),
  ev_type VARCHAR(50), -- 'Battery Electric Vehicle (BEV)' or 'Plug-in Hybrid Electric Vehicle (PHEV)'
  cafv_eligibility TEXT,
  electric_range INTEGER DEFAULT 0,
  base_msrp INTEGER DEFAULT 0,
  legislative_district INTEGER,
  dol_vehicle_id BIGINT UNIQUE,
  vehicle_location POINT, -- Geographic point for mapping
  electric_utility TEXT,
  census_tract VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_county ON electric_vehicles(county);
CREATE INDEX IF NOT EXISTS idx_city ON electric_vehicles(city);
CREATE INDEX IF NOT EXISTS idx_make ON electric_vehicles(make);
CREATE INDEX IF NOT EXISTS idx_model ON electric_vehicles(model);
CREATE INDEX IF NOT EXISTS idx_model_year ON electric_vehicles(model_year);
CREATE INDEX IF NOT EXISTS idx_ev_type ON electric_vehicles(ev_type);
CREATE INDEX IF NOT EXISTS idx_electric_range ON electric_vehicles(electric_range);
CREATE INDEX IF NOT EXISTS idx_cafv_eligibility ON electric_vehicles(cafv_eligibility);

-- Spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_vehicle_location ON electric_vehicles USING GIST(vehicle_location);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_county_year ON electric_vehicles(county, model_year);
CREATE INDEX IF NOT EXISTS idx_make_model ON electric_vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_ev_type_year ON electric_vehicles(ev_type, model_year);

-- Add comments for documentation
COMMENT ON TABLE electric_vehicles IS 'Electric Vehicle population data for Washington State';
COMMENT ON COLUMN electric_vehicles.vin IS 'Partial Vehicle Identification Number (first 10 characters)';
COMMENT ON COLUMN electric_vehicles.ev_type IS 'Type of electric vehicle: BEV (Battery Electric Vehicle) or PHEV (Plug-in Hybrid Electric Vehicle)';
COMMENT ON COLUMN electric_vehicles.cafv_eligibility IS 'Clean Alternative Fuel Vehicle eligibility status';
COMMENT ON COLUMN electric_vehicles.electric_range IS 'Electric range in miles';
COMMENT ON COLUMN electric_vehicles.vehicle_location IS 'Geographic coordinates as POINT(longitude latitude)';

-- Create a view for common analytics queries
CREATE OR REPLACE VIEW ev_analytics AS
SELECT 
  county,
  city,
  make,
  model,
  model_year,
  ev_type,
  COUNT(*) as vehicle_count,
  AVG(electric_range) as avg_range,
  AVG(CASE WHEN base_msrp > 0 THEN base_msrp END) as avg_msrp
FROM electric_vehicles
GROUP BY county, city, make, model, model_year, ev_type;

COMMENT ON VIEW ev_analytics IS 'Aggregated analytics view for dashboard queries';
