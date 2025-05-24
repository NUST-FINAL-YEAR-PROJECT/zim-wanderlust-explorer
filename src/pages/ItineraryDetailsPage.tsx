
import { useParams } from "react-router-dom";
import ItineraryView from "@/components/itinerary/ItineraryView";

export default function ItineraryDetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center p-12">
          <h2 className="text-xl font-medium">Itinerary not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <ItineraryView id={id} />
    </div>
  );
}
