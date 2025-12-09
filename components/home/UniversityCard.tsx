import Link from "next/link";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TurkishUniversity } from "@/lib/types";

interface UniversityCardProps {
  university: TurkishUniversity;
}

export function UniversityCard({ university }: UniversityCardProps) {
  const totalPartners = university.departments.reduce(
    (sum, dept) => sum + dept.partners.length,
    0
  );

  const partnerCountries = new Set(
    university.departments.flatMap((dept) =>
      dept.partners.map((partner) => partner.country)
    )
  );

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start space-x-2">
          <Building2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl line-clamp-2">
              {university.name}
            </CardTitle>
            <CardDescription className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              {university.city}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Departments</span>
            <span className="font-semibold">{university.departments.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Partner Universities</span>
            <span className="font-semibold">{totalPartners}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Partner Countries</span>
            <span className="font-semibold">{partnerCountries.size}</span>
          </div>
        </div>

        {university.departments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              Sample Departments:
            </p>
            <div className="flex flex-wrap gap-1">
              {university.departments.slice(0, 3).map((dept) => (
                <span
                  key={dept.name}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                >
                  {dept.name}
                </span>
              ))}
              {university.departments.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 text-xs text-muted-foreground">
                  +{university.departments.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/university/${university.id}`} className="w-full">
          <Button className="w-full group">
            View Agreements
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

