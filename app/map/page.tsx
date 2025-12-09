"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Info } from "lucide-react";
import { getAllUniversities, getAllCities } from "@/lib/data";
import { MapFilters } from "@/components/map/MapFilters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Dynamic import for Map component to avoid SSR issues with Leaflet
const AllUniversitiesMap = dynamic(
  () => import("@/components/map/AllUniversitiesMap").then((mod) => mod.AllUniversitiesMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading map...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Preparing interactive visualization
          </p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  const universities = getAllUniversities();
  const cities = getAllCities();

  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Filter universities based on city selection
  const filteredUniversities = selectedCity
    ? universities.filter((uni) => uni.city === selectedCity)
    : universities;

  // Handle reset filters
  const handleReset = () => {
    setSelectedUniversity(null);
    setSelectedCity(null);
  };

  // Calculate statistics
  const totalPartners = filteredUniversities.reduce(
    (sum, uni) =>
      sum + uni.departments.reduce((dSum, dept) => dSum + dept.partners.length, 0),
    0
  );

  const totalDepartments = filteredUniversities.reduce(
    (sum, uni) => sum + uni.departments.length,
    0
  );

  const partnerCountries = Array.from(
    new Set(
      filteredUniversities.flatMap((uni) =>
        uni.departments.flatMap((dept) => dept.partners.map((p) => p.country))
      )
    )
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Interactive Map</h1>
                <p className="text-muted-foreground mt-1">
                  Explore Erasmus partnerships across Europe
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-card border rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">
                  {filteredUniversities.length}
                </div>
                <div className="text-xs text-muted-foreground">Universities</div>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">{totalDepartments}</div>
                <div className="text-xs text-muted-foreground">Departments</div>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">{totalPartners}</div>
                <div className="text-xs text-muted-foreground">Partners</div>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">
                  {partnerCountries.length}
                </div>
                <div className="text-xs text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Filters */}
          <MapFilters
            universities={universities.map((uni) => ({
              id: uni.id,
              name: uni.name,
              city: uni.city,
            }))}
            cities={cities}
            selectedUniversity={selectedUniversity}
            selectedCity={selectedCity}
            onUniversityChange={setSelectedUniversity}
            onCityChange={setSelectedCity}
            onReset={handleReset}
          />

          {/* Map Container */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>
                {selectedUniversity
                  ? `${
                      universities.find((u) => u.id === selectedUniversity)?.name
                    } Partnerships`
                  : selectedCity
                  ? `Universities in ${selectedCity}`
                  : "All Erasmus Partnerships"}
              </CardTitle>
              <CardDescription>
                Click markers to view university details and partnerships
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[calc(100vh-28rem)] min-h-[500px]">
                <AllUniversitiesMap
                  universities={filteredUniversities}
                  selectedUniversityId={selectedUniversity}
                />
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">How to use this map:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <span className="font-medium text-red-600">Red markers</span> represent
                      Turkish universities
                    </li>
                    <li>
                      <span className="font-medium text-blue-600">Blue markers</span> represent
                      European partner universities
                    </li>
                    <li>Click any marker to zoom in and see details</li>
                    <li>
                      Use filters above to focus on specific universities or cities
                    </li>
                    <li>Click university names in popups to view detailed information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
