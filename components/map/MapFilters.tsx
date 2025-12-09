"use client";

import { Filter, X } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MapFiltersProps {
  universities: Array<{ id: string; name: string; city: string }>;
  cities: string[];
  selectedUniversity: string | null;
  selectedCity: string | null;
  onUniversityChange: (id: string | null) => void;
  onCityChange: (city: string | null) => void;
  onReset: () => void;
}

export function MapFilters({
  universities,
  cities,
  selectedUniversity,
  selectedCity,
  onUniversityChange,
  onCityChange,
  onReset,
}: MapFiltersProps) {
  const hasFilters = selectedUniversity || selectedCity;

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Map Filters</h3>
        </div>
        {hasFilters && (
          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Reset Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* University Filter */}
        <div className="space-y-2">
          <Label htmlFor="university-filter">Focus on University</Label>
          <Select
            id="university-filter"
            value={selectedUniversity || ""}
            onChange={(e) => onUniversityChange(e.target.value || null)}
          >
            <option value="">All Universities</option>
            {universities
              .filter((uni) => !selectedCity || uni.city === selectedCity)
              .map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              ))}
          </Select>
        </div>

        {/* City Filter */}
        <div className="space-y-2">
          <Label htmlFor="city-filter">Filter by City</Label>
          <Select
            id="city-filter"
            value={selectedCity || ""}
            onChange={(e) => onCityChange(e.target.value || null)}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="pt-3 border-t">
          <div className="text-xs text-muted-foreground mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {selectedUniversity && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                University: {universities.find((u) => u.id === selectedUniversity)?.name}
                <button
                  onClick={() => onUniversityChange(null)}
                  className="ml-2 hover:text-primary/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                City: {selectedCity}
                <button
                  onClick={() => onCityChange(null)}
                  className="ml-2 hover:text-primary/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

