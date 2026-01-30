"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Search, Car, MapPin, TrendingUp, BarChart3 } from "lucide-react";
import { getVehicles } from "@/lib/queries";
import type { ElectricVehicle } from "@/lib/types";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ElectricVehicle[]>([]);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search vehicles
  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      getVehicles({ searchQuery: query }, 1, 10)
        .then((data) => {
          setResults(data.vehicles);
        })
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query]);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search vehicles by VIN, make, model, or city..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? "Searching..." : "No results found."}
        </CommandEmpty>

        {/* Quick Navigation */}
        <CommandGroup heading="Quick Navigation">
          <CommandItem onSelect={() => scrollToSection("#overview")}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Overview Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => scrollToSection("#analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => scrollToSection("#explore")}>
            <Search className="mr-2 h-4 w-4" />
            <span>Explore Data</span>
          </CommandItem>
        </CommandGroup>

        {/* Vehicle Results */}
        {results.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`Vehicles (${results.length} results)`}>
              {results.map((vehicle) => (
                <CommandItem key={vehicle.vin}>
                  <Car className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {vehicle.make} {vehicle.model} ({vehicle.model_year})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {vehicle.city}, {vehicle.county}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
