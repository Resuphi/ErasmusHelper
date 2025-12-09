import Link from "next/link";
import { Building2, MapPin, Globe, GraduationCap, ArrowRight } from "lucide-react";
import { TurkishUniversity } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ComparisonTableProps {
  universities: TurkishUniversity[];
}

export function ComparisonTable({ universities }: ComparisonTableProps) {
  if (universities.length === 0) {
    return null;
  }

  // Calculate statistics for each university
  const stats = universities.map((uni) => {
    const totalPartners = uni.departments.reduce(
      (sum, dept) => sum + dept.partners.length,
      0
    );

    const partnerCountries = Array.from(
      new Set(
        uni.departments.flatMap((dept) =>
          dept.partners.map((partner) => partner.country)
        )
      )
    ).sort();

    const topCountries = partnerCountries.slice(0, 5);

    const departmentNames = uni.departments.map((dept) => dept.name);

    return {
      university: uni,
      totalPartners,
      partnerCountries,
      topCountries,
      departmentNames,
    };
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2">
            <th className="text-left p-4 bg-muted/50 font-semibold">Criteria</th>
            {stats.map((stat) => (
              <th
                key={stat.university.id}
                className="text-left p-4 bg-primary/5 font-semibold min-w-[250px]"
              >
                <div className="flex items-start space-x-2">
                  <Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{stat.university.name}</div>
                    <div className="text-sm font-normal text-muted-foreground flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {stat.university.city}
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Total Agreements */}
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-4 font-medium bg-muted/30">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                Total Partner Universities
              </div>
            </td>
            {stats.map((stat) => (
              <td key={stat.university.id} className="p-4">
                <span className="text-2xl font-bold text-primary">
                  {stat.totalPartners}
                </span>
              </td>
            ))}
          </tr>

          {/* Number of Departments */}
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-4 font-medium bg-muted/30">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                Number of Departments
              </div>
            </td>
            {stats.map((stat) => (
              <td key={stat.university.id} className="p-4">
                <span className="text-2xl font-bold text-primary">
                  {stat.university.departments.length}
                </span>
              </td>
            ))}
          </tr>

          {/* Partner Countries */}
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-4 font-medium bg-muted/30">Partner Countries</td>
            {stats.map((stat) => (
              <td key={stat.university.id} className="p-4">
                <span className="text-2xl font-bold text-primary mb-2 block">
                  {stat.partnerCountries.length}
                </span>
                <div className="text-sm text-muted-foreground">
                  {stat.partnerCountries.join(", ")}
                </div>
              </td>
            ))}
          </tr>

          {/* Top Countries */}
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-4 font-medium bg-muted/30">Top Partner Countries</td>
            {stats.map((stat) => (
              <td key={stat.university.id} className="p-4">
                <div className="flex flex-wrap gap-1">
                  {stat.topCountries.map((country) => (
                    <span
                      key={country}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* Departments */}
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-4 font-medium bg-muted/30">Available Departments</td>
            {stats.map((stat) => (
              <td key={stat.university.id} className="p-4">
                <div className="space-y-1">
                  {stat.departmentNames.map((dept) => (
                    <div
                      key={dept}
                      className="text-sm p-2 bg-accent/50 rounded border"
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* Actions */}
          <tr className="bg-muted/30">
            <td className="p-4 font-medium">View Details</td>
            {stats.map((stat) => (
              <td key={stat.university.id} className="p-4">
                <Link href={`/university/${stat.university.id}`}>
                  <Button className="w-full group">
                    View Full Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

