
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { ItineraryForm } from "@/components/itinerary/ItineraryForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ItineraryCreatePage() {
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an itinerary",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  // Add error boundary handling
  useEffect(() => {
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
            <Button 
              onClick={() => setError(null)} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Itinerary</h1>
        </div>
        
        <div className="bg-muted/30 p-6 rounded-lg">
          <ItineraryForm onError={(err) => setError(err)} />
        </div>
      </div>
    </DashboardLayout>
  );
}
