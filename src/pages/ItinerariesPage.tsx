
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, differenceInDays } from "date-fns";
import { PlusCircle, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserItineraries } from "@/models/Itinerary";
import { Itinerary } from "@/models/Itinerary";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ItinerariesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItineraries = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await getUserItineraries(user.id);
        setItineraries(data);
      } catch (error) {
        console.error("Error loading itineraries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItineraries();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Itineraries</h1>
            <p className="text-muted-foreground mt-1">
              Build and manage your travel plans
            </p>
          </div>
          <Button onClick={() => navigate("/itineraries/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Itinerary
          </Button>
        </div>

        <Separator className="my-6" />

        {isLoading ? (
          <div className="text-center p-12">Loading your itineraries...</div>
        ) : itineraries.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium mb-2">No itineraries yet</h3>
            <p className="text-muted-foreground mb-6">
              Start planning your trips by creating your first itinerary.
            </p>
            <Button onClick={() => navigate("/itineraries/create")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Itinerary
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                onClick={() => navigate(`/itinerary/${itinerary.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

interface ItineraryCardProps {
  itinerary: Itinerary;
  onClick: () => void;
}

function ItineraryCard({ itinerary, onClick }: ItineraryCardProps) {
  const totalDays =
    itinerary.destinations.length > 0
      ? differenceInDays(
          parseISO(itinerary.destinations[itinerary.destinations.length - 1].endDate),
          parseISO(itinerary.destinations[0].startDate)
        ) + 1
      : 0;

  const firstDestination = itinerary.destinations[0];
  const lastDestination = itinerary.destinations[itinerary.destinations.length - 1];

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{itinerary.title}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {itinerary.destinations.length > 0 ? (
            <span>
              {totalDays} {totalDays === 1 ? "day" : "days"} •{" "}
              {itinerary.destinations.length}{" "}
              {itinerary.destinations.length === 1
                ? "destination"
                : "destinations"}
            </span>
          ) : (
            <span>No destinations yet</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {itinerary.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {itinerary.description}
          </p>
        )}

        {itinerary.destinations.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">From:</span>{" "}
              <span className="font-medium">
                {format(parseISO(firstDestination.startDate), "MMM d, yyyy")}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">To:</span>{" "}
              <span className="font-medium">
                {format(parseISO(lastDestination.endDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        )}

        {itinerary.isPublic && (
          <div className="mt-4 inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            Shared publicly
          </div>
        )}
      </CardContent>
    </Card>
  );
}
