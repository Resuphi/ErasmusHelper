import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  Building2,
  ArrowLeft,
  Globe,
  GraduationCap,
} from "lucide-react";
import { getPartnerUniversityById, getAllPartnerUniversities } from "@/lib/data";
import { getCommentsByUniversity } from "@/app/actions/comments";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentList } from "@/components/comments/CommentList";

// Dynamic import for Map component to avoid SSR issues with Leaflet
const PartnerUniversityMap = dynamic(
  () => import("@/components/map/PartnerUniversityMap").then((mod) => mod.PartnerUniversityMap),
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

interface PartnerPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const partners = getAllPartnerUniversities();
  return partners.map((partner) => ({
    id: partner.id,
  }));
}

export async function generateMetadata({ params }: PartnerPageProps) {
  const partner = getPartnerUniversityById(params.id);

  if (!partner) {
    return {
      title: "Partner University Not Found",
    };
  }

  return {
    title: `${partner.name} - Partner University`,
    description: `Erasmus+ partnership information for ${partner.name} in ${partner.country}`,
  };
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const partner = getPartnerUniversityById(params.id);

  if (!partner) {
    notFound();
  }

  // Fetch comments for this partner university
  const comments = await getCommentsByUniversity(params.id);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/map"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Link>

          <div className="flex items-start space-x-4">
            <Globe className="h-12 w-12 text-primary flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {partner.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {partner.country}
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {partner.turkishPartners.length} Turkish Partner{" "}
                  {partner.turkishPartners.length === 1 ? "University" : "Universities"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Interactive Map - Full Width */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Partnership Map</CardTitle>
              <CardDescription>
                Visual representation of partnerships with Turkish universities
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <PartnerUniversityMap partner={partner} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Partnership Details */}
          <div className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Partnership Overview</CardTitle>
                <CardDescription>
                  Turkish universities with Erasmus+ agreements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partner.turkishPartners.map((turkishPartner: any, index: number) => (
                    <Link
                      key={index}
                      href={`/university/${turkishPartner.universityId}`}
                      className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <Building2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold">
                            {turkishPartner.universityName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {turkishPartner.universityCity}
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Turkish Department:</span>{" "}
                              {turkishPartner.department}
                            </p>
                            {turkishPartner.partnerDepartment && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Partner Department:</span>{" "}
                                {turkishPartner.partnerDepartment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {partner.turkishPartners.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Turkish Partners
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {new Set(partner.turkishPartners.map((p: any) => p.department)).size}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Departments
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Comments */}
          <div className="space-y-8">
            <CommentForm
              universityId={params.id}
              universityName={partner.name}
            />
            <div>
              <CommentList comments={comments} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
