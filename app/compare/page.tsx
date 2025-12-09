"use client";

import { useState, useMemo } from "react";
import { GitCompare, AlertCircle } from "lucide-react";
import { getAllUniversities } from "@/lib/data";
import { PartnerUniversity } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function ComparePage() {
  const universities = getAllUniversities();
  
  // Get all unique European partner universities
  const europeanUniversities = useMemo(() => {
    const partnersMap = new Map<string, PartnerUniversity & { 
      turkishPartners: string[];
      departments: string[];
    }>();
    
    universities.forEach((uni) => {
      uni.departments.forEach((dept) => {
        dept.partners.forEach((partner) => {
          const key = `${partner.name}-${partner.country}`;
          if (partnersMap.has(key)) {
            const existing = partnersMap.get(key)!;
            if (!existing.turkishPartners.includes(uni.name)) {
              existing.turkishPartners.push(uni.name);
            }
            if (partner.department && !existing.departments.includes(partner.department)) {
              existing.departments.push(partner.department);
            }
          } else {
            partnersMap.set(key, {
              ...partner,
              turkishPartners: [uni.name],
              departments: partner.department ? [partner.department] : [],
            });
          }
        });
      });
    });
    
    return Array.from(partnersMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [universities]);
  const [selectedNames, setSelectedNames] = useState<(string | null)[]>([null, null, null]);

  const handleSelect = (index: number, name: string | null) => {
    const newSelectedNames = [...selectedNames];
    newSelectedNames[index] = name;
    setSelectedNames(newSelectedNames);
  };

  // Get selected European universities
  const selectedEuropeanUniversities = selectedNames
    .filter((name): name is string => name !== null)
    .map((name) => europeanUniversities.find((uni) => uni.name === name))
    .filter((uni): uni is NonNullable<typeof uni> => uni !== undefined);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <GitCompare className="w-12 h-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Compare European Universities
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Select up to 3 European partner universities to compare their partnerships with Turkish institutions
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* University Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select European Universities to Compare</CardTitle>
              <CardDescription>
                Choose at least one European partner university, up to three for comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`university-${index}`}>
                      University {index + 1}
                      {index === 0 && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <div className="flex space-x-2">
                      <Select
                        id={`university-${index}`}
                        value={selectedNames[index] || ""}
                        onChange={(e) => handleSelect(index, e.target.value || null)}
                        className="flex-1"
                      >
                        <option value="">
                          {index === 0 ? "Select a university" : "None (optional)"}
                        </option>
                        {europeanUniversities
                          .filter(
                            (uni) =>
                              !selectedNames.includes(uni.name) ||
                              selectedNames[index] === uni.name
                          )
                          .map((uni) => (
                            <option key={uni.name} value={uni.name}>
                              {uni.name} ({uni.country})
                            </option>
                          ))}
                      </Select>
                      {selectedNames[index] && (
                        <button
                          type="button"
                          onClick={() => handleSelect(index, null)}
                          className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
                          aria-label="Clear selection"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Results */}
          {selectedEuropeanUniversities.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Universities Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Please select at least one European university to view comparison data
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  Comparison Results
                  <span className="text-muted-foreground text-base font-normal ml-2">
                    ({selectedEuropeanUniversities.length}{" "}
                    {selectedEuropeanUniversities.length === 1
                      ? "university"
                      : "universities"})
                  </span>
                </CardTitle>
                <CardDescription>
                  Comparison of European universities and their Turkish partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left p-4 bg-muted/50 font-semibold">Criteria</th>
                        {selectedEuropeanUniversities.map((uni) => (
                          <th
                            key={uni.name}
                            className="text-left p-4 bg-primary/5 font-semibold min-w-[250px]"
                          >
                            <div className="font-bold">{uni.name}</div>
                            <div className="text-sm font-normal text-muted-foreground mt-1">
                              {uni.country}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium bg-muted/30">Turkish Partner Universities</td>
                        {selectedEuropeanUniversities.map((uni) => (
                          <td key={uni.name} className="p-4">
                            <span className="text-2xl font-bold text-primary">
                              {uni.turkishPartners.length}
                            </span>
                            <div className="mt-2 space-y-1">
                              {uni.turkishPartners.map((partner) => (
                                <div key={partner} className="text-sm p-2 bg-accent/50 rounded border">
                                  {partner}
                                </div>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium bg-muted/30">Departments</td>
                        {selectedEuropeanUniversities.map((uni) => (
                          <td key={uni.name} className="p-4">
                            <span className="text-2xl font-bold text-primary mb-2 block">
                              {uni.departments.length}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {uni.departments.map((dept) => (
                                <span
                                  key={dept}
                                  className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                                >
                                  {dept}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium bg-muted/30">Country</td>
                        {selectedEuropeanUniversities.map((uni) => (
                          <td key={uni.name} className="p-4">
                            <div className="text-lg font-semibold">{uni.country}</div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium bg-muted/30">Location</td>
                        {selectedEuropeanUniversities.map((uni) => (
                          <td key={uni.name} className="p-4">
                            <div className="text-sm text-muted-foreground">
                              Lat: {uni.lat.toFixed(4)}, Lng: {uni.lng.toFixed(4)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Box */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Comparison Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Select European universities to see which Turkish universities they partner with</li>
                    <li>Compare the number of Turkish partnerships each European university has</li>
                    <li>View the departments available at each European partner university</li>
                    <li>Use the clear button (X) to remove a selection</li>
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
