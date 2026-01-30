"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVehicles } from "@/lib/queries";
import type { ElectricVehicle } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDashboardContext } from "../providers/dashboard-provider";

export function VehicleTable() {
  const { filters } = useDashboardContext();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{
    vehicles: ElectricVehicle[];
    total: number;
    totalPages: number;
  }>({ vehicles: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPage(1); // Reset to page 1 when filters change
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    getVehicles(filters, page, 50)
      .then((result) => {
        setData(result);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const exportToCSV = () => {
    const csv = [
      [
        "VIN",
        "Make",
        "Model",
        "Year",
        "Type",
        "Range (mi)",
        "County",
        "City",
        "CAFV",
      ],
      ...data.vehicles.map((v) => [
        v.vin || "",
        v.make || "",
        v.model || "",
        v.model_year?.toString() || "",
        v.ev_type || "",
        v.electric_range?.toString() || "",
        v.county || "",
        v.city || "",
        v.cafv_eligibility || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ev-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vehicle Data Explorer</CardTitle>
            <CardDescription>
              {loading
                ? "Loading..."
                : `Showing ${formatNumber(data.vehicles.length)} of ${formatNumber(data.total)} vehicles`}
            </CardDescription>
          </div>
          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            disabled={loading || data.vehicles.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">VIN</TableHead>
                <TableHead>Make & Model</TableHead>
                <TableHead className="w-[80px]">Year</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[100px]">Range</TableHead>
                <TableHead>County</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="w-[120px]">CAFV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Loading vehicles...
                    </p>
                  </TableCell>
                </TableRow>
              ) : data.vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No vehicles found matching your filters.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                data.vehicles.map((vehicle) => (
                  <TableRow key={vehicle.vin}>
                    <TableCell className="font-mono text-xs">
                      {vehicle.vin?.substring(0, 10)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </TableCell>
                    <TableCell>{vehicle.model_year}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vehicle.ev_type?.includes("BEV")
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {vehicle.ev_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.electric_range || "N/A"} mi</TableCell>
                    <TableCell>{vehicle.county}</TableCell>
                    <TableCell className="text-sm">{vehicle.city}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {vehicle.cafv_eligibility || "Unknown"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && data.totalPages > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
