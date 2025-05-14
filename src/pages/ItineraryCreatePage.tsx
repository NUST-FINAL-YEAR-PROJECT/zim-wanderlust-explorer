
import DashboardLayout from "@/components/DashboardLayout";
import { ItineraryForm } from "@/components/itinerary/ItineraryForm";
import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ItineraryCreatePage() {
  const [error, setError] = useState<Error | null>(null);

  // Add error boundary handling
  useEffect(() => {
    // Clean up any console errors
    console.log("Itinerary Create Page mounted");
    
    return () => {
      console.log("Itinerary Create Page unmounted");
    };
  }, []);

  // Error handling for unexpected errors
  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || "An unexpected error occurred. Please try again later."}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Itinerary</h1>
        <ItineraryForm />
      </div>
    </DashboardLayout>
  );
}
