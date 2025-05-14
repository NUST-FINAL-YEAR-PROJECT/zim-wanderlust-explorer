
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { ItineraryView } from "@/components/itinerary/ItineraryView";

export default function ItineraryDetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="text-center p-12">
            <h2 className="text-xl font-medium">Itinerary not found</h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <ItineraryView itineraryId={id} />
      </div>
    </DashboardLayout>
  );
}
