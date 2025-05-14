
import DashboardLayout from "@/components/DashboardLayout";
import { ItineraryForm } from "@/components/itinerary/ItineraryForm";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ItineraryCreatePage() {
  const [error, setError] = useState<Error | null>(null);

  // Add error boundary handling
  useEffect(() => {
    // Clean up any console errors
    console.log("Itinerary Create Page mounted");
    
    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      console.error("Captured error:", event.error);
      setError(event.error || new Error("An unexpected error occurred"));
      event.preventDefault();
    };

    window.addEventListener("error", handleError);
    
    return () => {
      console.log("Itinerary Create Page unmounted");
      window.removeEventListener("error", handleError);
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
          <div className="mt-4">
            <button 
              onClick={() => setError(null)} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Itinerary</h1>
        <ItineraryForm onError={(err) => setError(err)} />
      </div>
    </DashboardLayout>
  );
}
