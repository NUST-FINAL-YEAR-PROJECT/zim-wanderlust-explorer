
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";
import { getAccommodationById } from "@/models/Accommodation";
import DestinationMap from "@/components/DestinationMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays,
  CheckCircle2,
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Share2,
  Bed,
  Coffee,
  Clock,
  Tag,
} from "lucide-react";

const AccommodationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");

  const { data: accommodation, isLoading, isError } = useQuery({
    queryKey: ["accommodation", id],
    queryFn: () => getAccommodationById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !accommodation) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
          <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/50 dark:text-red-400">
            <MapPin className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Accommodation not found</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            We couldn't find the accommodation you're looking for. It may have been removed or you may have followed an
            invalid link.
          </p>
          <Button onClick={() => navigate("/accommodations")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accommodations
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const {
    name,
    description,
    location,
    price_per_night,
    image_url,
    additional_images,
    amenities,
    room_types,
    rating,
    review_count,
    max_guests,
    latitude,
    longitude,
  } = accommodation;

  const handleBookNow = () => {
    if (!selectedDate || !selectedRoomType) {
      toast({
        title: "Incomplete booking details",
        description: "Please select a date and room type before booking",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking initiated",
      description: `You've started booking ${selectedRoomType} at ${name} for ${format(selectedDate, "PPP")}`,
    });

    // In a real app, we would navigate to a booking confirmation page
    // navigate(`/booking/accommodation/${id}`, {
    //   state: { selectedDate, selectedRoomType, guests }
    // });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: name,
          text: `Check out ${name} in ${location}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/accommodations")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accommodations
          </Button>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-blue-900 dark:text-white">{name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">{location}</span>
                </div>
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({review_count} {review_count === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
              <img
                src={image_url || "/placeholder.svg"}
                alt={name}
                className="h-[400px] w-full object-cover"
              />
              {additional_images && additional_images.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2 p-2">
                  {additional_images.slice(0, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${name} view ${idx + 1}`}
                      className="h-20 w-full rounded object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">About this place</h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Room Options</h3>
                  <div className="mt-2 space-y-2">
                    {room_types?.map((room, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center justify-between rounded-lg border p-4 dark:border-gray-800"
                      >
                        <div>
                          <h4 className="font-medium">{room.type}</h4>
                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>Up to {room.capacity} guests</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-lg font-semibold text-blue-600 dark:text-blue-300">
                            ${room.price}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/night</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="amenities">
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {amenities?.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-md border p-3 dark:border-gray-800"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="location">
                <div className="mt-4 h-96">
                  {latitude && longitude && (
                    <DestinationMap
                      destination={{
                        id: accommodation.id,
                        name: name || "",
                        description: description || "",
                        location: location || "",
                        price: price_per_night,
                        image_url: image_url || "",
                        latitude: latitude,
                        longitude: longitude,
                        // Add required Destination properties that don't exist on Accommodation
                        activities: [],
                        best_time_to_visit: "",
                        duration_recommended: "",
                        difficulty_level: "",
                        categories: [],
                        getting_there: "",
                        amenities: amenities || [],
                        additional_images: additional_images || [],
                        additional_costs: null,
                        highlights: [],
                        what_to_bring: [],
                        is_featured: false,
                        payment_url: null,
                        weather_info: null,
                        created_at: "",
                        updated_at: ""
                      }}
                      height="100%"
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">Book your stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-gray-700 dark:text-gray-300">Base price</div>
                  <div className="font-display text-xl font-semibold text-blue-600 dark:text-blue-300">
                    ${price_per_night}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/night</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Check-in date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Room type
                  </label>
                  <Select onValueChange={setSelectedRoomType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {room_types?.map((room, idx) => (
                        <SelectItem key={idx} value={room.type}>
                          {room.type} - ${room.price}/night
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of guests
                  </label>
                  <Select defaultValue={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: max_guests || 4 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleBookNow}>
                  Book Now
                </Button>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  You won't be charged yet
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccommodationDetails;
