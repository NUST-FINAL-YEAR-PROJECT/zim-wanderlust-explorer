
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, Clock, PlusCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getDestination } from "@/models/Destination";
import { Destination } from "@/models/Destination";
import { ReviewSection } from "@/components/ReviewSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WishlistButton } from "@/components/WishlistButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function DestinationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getDestination(id)
        .then((data) => {
          setDestination(data);
        })
        .catch((error) => {
          console.error("Error fetching destination:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="h-96 animate-pulse bg-gray-200 rounded-xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!destination) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold">Destination not found</h1>
          <p className="mt-4">
            Sorry, we couldn't find the destination you're looking for.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/destinations")}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Destinations
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  // Add to Itinerary handler
  const handleAddToItinerary = () => {
    navigate("/itineraries/create", { state: { selectedDestination: destination } });
  };

  // Helper function to check if capacity exists in additional_costs
  const hasCapacity = () => {
    if (!destination.additional_costs) return false;
    if (Array.isArray(destination.additional_costs)) return false;
    
    // Check if it's an object with capacity property
    return typeof destination.additional_costs === 'object' && 
           'capacity' in destination.additional_costs;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0">
          <div>
            <Button
              variant="ghost"
              className="mb-2 p-0 h-auto"
              onClick={() => navigate("/destinations")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Destinations
            </Button>
            <h1 className="text-3xl font-bold">{destination.name}</h1>
            <div className="flex items-center mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{destination.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {user && (
              <WishlistButton destinationId={destination.id} />
            )}
            <Button onClick={handleBookNow}>Book Now</Button>
            <Button onClick={handleAddToItinerary} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Itinerary
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img
                src={destination.image_url || '/placeholder.svg'}
                alt={destination.name}
                className="rounded-xl object-cover h-96 w-full"
              />
              <div className="space-y-4">
                <p className="text-muted-foreground">{destination.description}</p>
                
                {/* Rating display - If needed, you can add real rating logic later */}
                <div className="flex items-center">
                  <Badge className="mr-2">
                    {/* Use a placeholder for now */}
                    4.5
                  </Badge>
                  <span>
                    12 Reviews
                  </span>
                </div>
                
                {/* Opening hours - placeholder */}
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Open Daily
                </div>
                
                {/* Hours - placeholder */}
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    9:00 AM - 5:00 PM
                  </span>
                </div>
                
                {/* Only show if capacity exists in additional_costs */}
                {hasCapacity() && (
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Capacity: {(destination.additional_costs as Record<string, any>).capacity}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="reviews" className="mt-4">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="space-y-2">
            <ReviewSection destinationId={id || ''} />
          </TabsContent>
          <TabsContent value="location">
            <Card>
              <CardContent>
                <p>Location details and map will be here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
