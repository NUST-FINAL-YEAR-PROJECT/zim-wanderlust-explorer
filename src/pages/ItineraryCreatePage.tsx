
import DashboardLayout from "@/components/DashboardLayout";
import { ItineraryForm } from "@/components/itinerary/ItineraryForm";

export default function ItineraryCreatePage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Itinerary</h1>
        <ItineraryForm />
      </div>
    </DashboardLayout>
  );
}
