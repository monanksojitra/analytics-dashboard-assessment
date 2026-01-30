import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  console.error(
    "Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CSVRow {
  "VIN (1-10)": string;
  County: string;
  City: string;
  State: string;
  "Postal Code": string;
  "Model Year": string;
  Make: string;
  Model: string;
  "Electric Vehicle Type": string;
  "Clean Alternative Fuel Vehicle (CAFV) Eligibility": string;
  "Electric Range": string;
  "Base MSRP": string;
  "Legislative District": string;
  "DOL Vehicle ID": string;
  "Vehicle Location": string;
  "Electric Utility": string;
  "2020 Census Tract": string;
}

function parseLocation(locationStr: string): string | null {
  try {
    // Parse "POINT (-122.30839 47.610365)" to PostgreSQL POINT format
    const match = locationStr.match(/POINT\s*\(([^)]+)\)/);
    if (!match) return null;

    const [lng, lat] = match[1].trim().split(/\s+/);
    return `(${lng},${lat})`; // PostgreSQL POINT format
  } catch (error) {
    return null;
  }
}

function transformRow(row: CSVRow) {
  return {
    vin: row["VIN (1-10)"] || "",
    county: row["County"] || "",
    city: row["City"] || "",
    state: row["State"] || "",
    postal_code: row["Postal Code"] || "",
    model_year: parseInt(row["Model Year"]) || null,
    make: row["Make"] || "",
    model: row["Model"] || "",
    ev_type: row["Electric Vehicle Type"] || "",
    cafv_eligibility:
      row["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] || "",
    electric_range: parseInt(row["Electric Range"]) || 0,
    base_msrp: parseInt(row["Base MSRP"]) || 0,
    legislative_district: parseInt(row["Legislative District"]) || null,
    dol_vehicle_id: parseInt(row["DOL Vehicle ID"]) || null,
    vehicle_location: parseLocation(row["Vehicle Location"]),
    electric_utility: row["Electric Utility"] || "",
    census_tract: row["2020 Census Tract"] || "",
  };
}

async function importData() {
  const csvFilePath = path.join(
    process.cwd(),
    "data-to-visualize",
    "Electric_Vehicle_Population_Data.csv",
  );

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  console.log("📊 Starting data import...");
  console.log(`📁 Reading from: ${csvFilePath}`);

  const vehicles: any[] = [];
  let rowCount = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row: CSVRow) => {
        rowCount++;
        const vehicle = transformRow(row);
        vehicles.push(vehicle);

        // Log progress every 5000 rows
        if (rowCount % 5000 === 0) {
          console.log(`📥 Processed ${rowCount} rows...`);
        }
      })
      .on("end", async () => {
        console.log(`✅ Finished reading CSV: ${rowCount} rows`);
        console.log("💾 Importing to Supabase...");

        try {
          // Batch insert in chunks of 1000
          const batchSize = 1000;
          let imported = 0;

          for (let i = 0; i < vehicles.length; i += batchSize) {
            const batch = vehicles.slice(i, i + batchSize);

            const { data, error } = await supabase
              .from("electric_vehicles")
              .insert(batch);

            if (error) {
              console.error(
                `❌ Error importing batch ${i / batchSize + 1}:`,
                error.message,
              );
              // Continue with next batch instead of failing completely
            } else {
              imported += batch.length;
              console.log(
                `✅ Imported ${imported} / ${vehicles.length} records`,
              );
            }
          }

          console.log("🎉 Data import complete!");
          console.log(`📊 Total records imported: ${imported}`);

          // Verify import
          const { count, error: countError } = await supabase
            .from("electric_vehicles")
            .select("*", { count: "exact", head: true });

          if (countError) {
            console.error("❌ Error verifying import:", countError.message);
          } else {
            console.log(`✅ Verified: ${count} records in database`);
          }

          resolve(imported);
        } catch (error) {
          console.error("❌ Import failed:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("❌ Error reading CSV:", error);
        reject(error);
      });
  });
}

// Run import
importData()
  .then(() => {
    console.log("✨ Import script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Import script failed:", error);
    process.exit(1);
  });
