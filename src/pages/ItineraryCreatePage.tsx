
import DashboardLayout from "@/components/DashboardLayout";
import { ItineraryForm } from "@/components/itinerary/ItineraryForm";
import { useEffect } from "react";

export default function ItineraryCreatePage() {
  // Add error boundary handling
  useEffect(() => {
    // Clean up any console errors
    console.log("Itinerary Create Page mounted");
    
    return () => {
      console.log("Itinerary Create Page unmounted");
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Itinerary</h1>
        <ItineraryForm />
      </div>
    </DashboardLayout>
  );
}
