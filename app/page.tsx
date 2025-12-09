import { MapPin, School, Globe, TrendingUp } from "lucide-react";
import { getAllUniversities, getAllDepartments } from "@/lib/data";
import { UniversityList } from "@/components/home/UniversityList";

export default function HomePage() {
  const universities = getAllUniversities();
  const departments = getAllDepartments();

  // Get all unique partner countries
  const countries = Array.from(
    new Set(
      universities.flatMap((uni) =>
        uni.departments.flatMap((dept) =>
          dept.partners.map((partner) => partner.country)
        )
      )
    )
  ).sort();

  // Calculate statistics
  const totalDepartments = universities.reduce(
    (sum, uni) => sum + uni.departments.length,
    0
  );
  const totalPartners = universities.reduce(
    (sum, uni) =>
      sum +
      uni.departments.reduce((deptSum, dept) => deptSum + dept.partners.length, 0),
    0
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
              Erasmus Map Turkey
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore Erasmus+ agreements between Turkish and European universities
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <div className="p-4 bg-card border rounded-lg">
                <School className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{universities.length}</div>
                <div className="text-xs text-muted-foreground">Universities</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalDepartments}</div>
                <div className="text-xs text-muted-foreground">Departments</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalPartners}</div>
                <div className="text-xs text-muted-foreground">Partners</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{countries.length}</div>
                <div className="text-xs text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University List Section */}
      <section className="container mx-auto px-4 py-12">
        <UniversityList
          universities={universities}
          departments={departments}
          countries={countries}
        />
      </section>
    </div>
  );
}
