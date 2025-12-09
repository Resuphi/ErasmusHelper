"use client";

import { useState, useMemo } from "react";
import { TurkishUniversity } from "@/lib/types";
import { SearchFilter } from "./SearchFilter";
import { UniversityCard } from "./UniversityCard";

interface UniversityListProps {
  universities: TurkishUniversity[];
  departments: string[];
  countries: string[];
}

export function UniversityList({
  universities,
  departments,
  countries,
}: UniversityListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "department" | "country">("all");
  const [filterValue, setFilterValue] = useState("");

  const filteredUniversities = useMemo(() => {
    let filtered = universities;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (uni) =>
          uni.name.toLowerCase().includes(query) ||
          uni.city.toLowerCase().includes(query)
      );
    }

    // Apply department filter
    if (filterType === "department" && filterValue) {
      filtered = filtered.filter((uni) =>
        uni.departments.some((dept) => dept.name === filterValue)
      );
    }

    // Apply country filter
    if (filterType === "country" && filterValue) {
      filtered = filtered.filter((uni) =>
        uni.departments.some((dept) =>
          dept.partners.some((partner) => partner.country === filterValue)
        )
      );
    }

    return filtered;
  }, [universities, searchQuery, filterType, filterValue]);

  const handleFilterTypeChange = (newType: "all" | "department" | "country") => {
    setFilterType(newType);
    setFilterValue(""); // Reset filter value when type changes
  };

  return (
    <div className="space-y-8">
      <SearchFilter
        searchQuery={searchQuery}
        filterType={filterType}
        filterValue={filterValue}
        onSearchChange={setSearchQuery}
        onFilterTypeChange={handleFilterTypeChange}
        onFilterValueChange={setFilterValue}
        departments={departments}
        countries={countries}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Turkish Universities
            <span className="text-muted-foreground text-lg ml-2">
              ({filteredUniversities.length})
            </span>
          </h2>
          {(searchQuery || filterValue) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setFilterValue("");
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredUniversities.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-lg text-muted-foreground">
              No universities found matching your criteria.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

