import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PartnerNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-16 text-center">
        <Building2 className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Partner University Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          The partner university you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/map">
            <Button variant="default">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
