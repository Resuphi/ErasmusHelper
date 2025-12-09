"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SearchFilterProps {
  searchQuery: string;
  filterType: "all" | "department" | "country";
  filterValue: string;
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: "all" | "department" | "country") => void;
  onFilterValueChange: (value: string) => void;
  departments: string[];
  countries: string[];
}

export function SearchFilter({
  searchQuery,
  filterType,
  filterValue,
  onSearchChange,
  onFilterTypeChange,
  onFilterValueChange,
  departments,
  countries,
}: SearchFilterProps) {
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search Universities</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="search"
            type="text"
            placeholder="Search by university name or city..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="filterType">Filter By</Label>
          <Select
            id="filterType"
            value={filterType}
            onChange={(e) =>
              onFilterTypeChange(
                e.target.value as "all" | "department" | "country"
              )
            }
          >
            <option value="all">All Universities</option>
            <option value="department">Department</option>
            <option value="country">Partner Country</option>
          </Select>
        </div>

        {filterType !== "all" && (
          <div className="space-y-2">
            <Label htmlFor="filterValue">
              {filterType === "department"
                ? "Select Department"
                : "Select Country"}
            </Label>
            <Select
              id="filterValue"
              value={filterValue}
              onChange={(e) => onFilterValueChange(e.target.value)}
            >
              <option value="">
                {filterType === "department"
                  ? "All Departments"
                  : "All Countries"}
              </option>
              {filterType === "department"
                ? departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))
                : countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

