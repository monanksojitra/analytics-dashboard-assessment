"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import { useDashboardContext } from "../providers/dashboard-provider";

export function FilterPanel() {
  const { filters, filterOptions, updateFilters, resetFilters } =
    useDashboardContext();

  const handleYearChange = (values: number[]) => {
    updateFilters({ years: values as [number, number] });
  };

  const handleCountyToggle = (county: string) => {
    const newCounties = filters.counties.includes(county)
      ? filters.counties.filter((c) => c !== county)
      : [...filters.counties, county];
    updateFilters({ counties: newCounties });
  };

  const handleMakeToggle = (make: string) => {
    const newMakes = filters.makes.includes(make)
      ? filters.makes.filter((m) => m !== make)
      : [...filters.makes, make];
    updateFilters({ makes: newMakes });
  };

  const activeFilterCount =
    filters.counties.length +
    filters.makes.length +
    (filters.evType !== "all" ? 1 : 0);

  return (
    <Card className="sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <CardTitle>Filters</CardTitle>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount}</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          disabled={activeFilterCount === 0}
        >
          Reset
        </Button>
      </CardHeader>
      <Separator />
      <ScrollArea className="h-[calc(100vh-200px)]">
        <CardContent className="space-y-6 pt-6">
          {/* Year Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Model Year</Label>
            <div className="px-2">
              <Slider
                min={filterOptions?.years.min || 2012}
                max={filterOptions?.years.max || 2024}
                step={1}
                value={filters.years}
                onValueChange={handleYearChange}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.years[0]}</span>
                <span>{filters.years[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* EV Type */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Vehicle Type</Label>
            <RadioGroup
              value={filters.evType}
              onValueChange={(value) => updateFilters({ evType: value as any })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  All Types
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BEV" id="bev" />
                <Label htmlFor="bev" className="font-normal cursor-pointer">
                  Battery Electric (BEV)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PHEV" id="phev" />
                <Label htmlFor="phev" className="font-normal cursor-pointer">
                  Plug-in Hybrid (PHEV)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Top Counties */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Counties</Label>
            <div className="flex flex-wrap gap-2">
              {filterOptions?.counties.slice(0, 10).map((county: string) => (
                <Badge
                  key={county}
                  variant={
                    filters.counties.includes(county) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleCountyToggle(county)}
                >
                  {county}
                  {filters.counties.includes(county) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Top Makes */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Manufacturers</Label>
            <div className="flex flex-wrap gap-2">
              {filterOptions?.makes.slice(0, 10).map((make: string) => (
                <Badge
                  key={make}
                  variant={filters.makes.includes(make) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleMakeToggle(make)}
                >
                  {make}
                  {filters.makes.includes(make) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
