import { notFound } from "next/navigation";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import {
  MapPin,
  Building2,
  ArrowLeft,
  Globe,
  GraduationCap,
} from "lucide-react";
import { getUniversityById, getAllUniversities, generatePartnerId } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Dynamic import for Map component to avoid SSR issues with Leaflet
const UniversityMap = dynamicImport(
  () => import("@/components/map/UniversityMap").then((mod) => mod.UniversityMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

// Dynamic import for comments to avoid SSR issues with Firebase
const ClientComments = dynamicImport(
  () => import("@/components/comments/ClientComments").then((mod) => mod.ClientComments),
  { ssr: false }
);

// Force dynamic rendering to avoid SSR issues with Firebase
export const dynamic = 'force-dynamic';

interface UniversityPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: UniversityPageProps) {
  const university = getUniversityById(params.id);

  if (!university) {
    return {
      title: "University Not Found",
    };
  }

  return {
    title: `${university.name} - Erasmus Agreements`,
    description: `Explore Erasmus agreements for ${university.name} in ${university.city}`,
  };
}

export default function UniversityPage({ params }: UniversityPageProps) {
  const university = getUniversityById(params.id);

  if (!university) {
    notFound();
  }

  const totalPartners = university.departments.reduce(
    (sum, dept) => sum + dept.partners.length,
    0
  );

  const partnerCountries = Array.from(
    new Set(
      university.departments.flatMap((dept) =>
        dept.partners.map((partner) => partner.country)
      )
    )
  ).sort();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Universities
          </Link>

          <div className="flex items-start space-x-4">
            <Building2 className="h-12 w-12 text-primary flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {university.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {university.city}
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {university.departments.length} Departments
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  {totalPartners} Partner Universities
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Split Layout */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Details */}
          <div className="space-y-8">
            {/* Statistics Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Partnership Overview</CardTitle>
                <CardDescription>
                  Summary of Erasmus+ agreements and partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {university.departments.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Departments
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {totalPartners}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Partners
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {partnerCountries.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Countries
                    </div>
                  </div>
                </div>

                {partnerCountries.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold mb-3">Partner Countries</h4>
                    <div className="flex flex-wrap gap-2">
                      {partnerCountries.map((country) => (
                        <span
                          key={country}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Departments and Partners */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Departments & Partners
              </h2>
              <div className="space-y-4">
                {university.departments.map((department) => (
                  <Card key={department.name}>
                    <CardHeader>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      <CardDescription>
                        {department.partners.length} partner{" "}
                        {department.partners.length === 1
                          ? "university"
                          : "universities"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {department.partners.map((partner, index) => {
                          const partnerId = generatePartnerId(partner.name);
                          return (
                            <Link
                              key={`${partner.name}-${index}`}
                              href={`/partner/${partnerId}`}
                              className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                            >
                              <div className="flex items-start space-x-3">
                                <Globe className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm">
                                    {partner.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {partner.country}
                                  </p>
                                  {partner.department && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {partner.department}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Map + Comments */}
          <div className="space-y-6">
            {/* Map - Fixed height, no sticky */}
            <Card className="h-[450px]">
              <CardHeader className="pb-2">
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>
                  Click markers to explore partnerships
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                <UniversityMap university={university} />
              </CardContent>
            </Card>

            {/* Comments Section - Under Map */}
            <ClientComments
              universityId={params.id}
              universityName={university.name}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
