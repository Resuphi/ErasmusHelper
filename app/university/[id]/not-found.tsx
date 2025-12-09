import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto text-center space-y-6">
        <AlertCircle className="h-20 w-20 text-muted-foreground mx-auto" />
        <h1 className="text-4xl font-bold">University Not Found</h1>
        <p className="text-muted-foreground">
          The university you're looking for doesn't exist in our database.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

