
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle, Trash, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { createItinerary, addDestinationToItinerary } from "@/models/Itinerary";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DestinationSelector } from "./DestinationSelector";
import { Destination } from "@/models/Destination";
import { Separator } from "@/components/ui/separator";
import { getDestinations } from "@/models/Destination";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
});

interface ItineraryFormProps {
  onError?: (error: Error) => void;
}

export function ItineraryForm({ onError }: ItineraryFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [destinations, setDestinations] = useState<{
    destination: Destination | null;
    startDate: Date | undefined;
    endDate: Date | undefined;
    notes: string;
  }[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Load all destinations for quick selection
  useEffect(() => {
    const loadAllDestinations = async () => {
      try {
        setIsLoadingDestinations(true);
        const data = await getDestinations();
        setAllDestinations(data);
      } catch (error) {
        console.error("Error loading destinations:", error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      } finally {
        setIsLoadingDestinations(false);
      }
    };
    
    loadAllDestinations();
  }, [onError]);

  // Handle pre-selected destination if passed from another page
  useEffect(() => {
    try {
      const selectedDestination = location.state?.selectedDestination;
      if (selectedDestination) {
        // Add the pre-selected destination
        setDestinations([
          {
            destination: selectedDestination,
            startDate: undefined,
            endDate: undefined,
            notes: "",
          },
        ]);
        
        // Pre-populate the title
        form.setValue('title', `Trip to ${selectedDestination.name}`);
      }
    } catch (error) {
      console.error("Error loading pre-selected destination:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [location.state, form, onError]);

  const addDestination = () => {
    setDestinations([
      ...destinations,
      { destination: null, startDate: undefined, endDate: undefined, notes: "" },
    ]);
  };

  const removeDestination = (index: number) => {
    setDestinations((current) => current.filter((_, i) => i !== index));
  };

  const updateDestination = (index: number, destination: Destination | null) => {
    try {
      setDestinations((current) => {
        const updated = [...current];
        updated[index] = { ...updated[index], destination };
        return updated;
      });
    } catch (error) {
      console.error("Error updating destination:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  const updateStartDate = (index: number, date: Date | undefined) => {
    setDestinations((current) => {
      const updated = [...current];
      updated[index] = { ...updated[index], startDate: date };
      return updated;
    });
  };

  const updateEndDate = (index: number, date: Date | undefined) => {
    setDestinations((current) => {
      const updated = [...current];
      updated[index] = { ...updated[index], endDate: date };
      return updated;
    });
  };

  const updateNotes = (index: number, notes: string) => {
    setDestinations((current) => {
      const updated = [...current];
      updated[index] = { ...updated[index], notes };
      return updated;
    });
  };

  const addQuickDestination = (destination: Destination) => {
    // Check if already added
    const isAlreadyAdded = destinations.some(
      item => item.destination?.id === destination.id
    );
    
    if (isAlreadyAdded) {
      toast({
        title: "Already added",
        description: `${destination.name} is already in your itinerary.`,
        variant: "default",
      });
      return;
    }
    
    setDestinations([
      ...destinations,
      { destination, startDate: undefined, endDate: undefined, notes: "" }
    ]);
    
    toast({
      title: "Destination added",
      description: `${destination.name} has been added to your itinerary.`,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an itinerary.",
        variant: "destructive",
      });
      return;
    }

    if (destinations.length === 0 || destinations.some((d) => !d.destination)) {
      toast({
        title: "Error",
        description: "Please add at least one destination to your itinerary.",
        variant: "destructive",
      });
      return;
    }

    // Check if all destinations have valid dates
    const invalidDates = destinations.some(
      (d) => !d.startDate || !d.endDate || d.startDate > d.endDate
    );

    if (invalidDates) {
      toast({
        title: "Error",
        description:
          "Please ensure all destinations have valid start and end dates.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newItinerary = await createItinerary(
        user.id,
        values.title,
        values.description
      );

      if (!newItinerary) {
        throw new Error("Failed to create itinerary");
      }

      // Add all destinations to the itinerary
      for (const dest of destinations) {
        if (dest.destination && dest.startDate && dest.endDate) {
          await addDestinationToItinerary(
            newItinerary.id,
            dest.destination.id,
            dest.destination.name,
            dest.startDate.toISOString(),
            dest.endDate.toISOString(),
            dest.notes
          );
        }
      }

      toast({
        title: "Success",
        description: "Your itinerary has been created successfully!",
      });

      navigate(`/itinerary/${newItinerary.id}`);
    } catch (error) {
      console.error("Error creating itinerary:", error);
      toast({
        title: "Error",
        description: "Failed to create itinerary. Please try again later.",
        variant: "destructive",
      });
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itinerary Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Summer Adventure 2023"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your travel plans..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick destination selection */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Quick Add Destinations</h2>
              {isLoadingDestinations ? (
                <div className="flex items-center justify-center p-6">
                  <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div>
                  <span className="ml-2">Loading destinations...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allDestinations.slice(0, 8).map((destination) => (
                    <button
                      key={destination.id}
                      type="button"
                      onClick={() => addQuickDestination(destination)}
                      className="flex flex-col items-center p-3 border rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors"
                    >
                      <div 
                        className="w-full h-24 rounded-md bg-muted mb-2 bg-cover bg-center"
                        style={{
                          backgroundImage: destination.image_url 
                            ? `url(${destination.image_url})` 
                            : 'url(/placeholder.svg)'
                        }}
                      />
                      <span className="text-sm font-medium truncate w-full text-center">
                        {destination.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full text-center">
                        {destination.location}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Your Destinations</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDestination}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Destination
                </Button>
              </div>
            </div>

            {destinations.length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No destinations added yet. Click "Add Destination" to start
                  planning your trip or use the quick add section above.
                </p>
              </div>
            )}

            {destinations.map((dest, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Destination</FormLabel>
                        <DestinationSelector
                          value={dest.destination}
                          onChange={(destination) =>
                            updateDestination(index, destination)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !dest.startDate &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  {dest.startDate ? (
                                    format(dest.startDate, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={dest.startDate}
                                onSelect={(date) =>
                                  updateStartDate(index, date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !dest.endDate && "text-muted-foreground"
                                  )}
                                >
                                  {dest.endDate ? (
                                    format(dest.endDate, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={dest.endDate}
                                onSelect={(date) => updateEndDate(index, date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <Textarea
                          placeholder="Accommodation details, activities, etc."
                          value={dest.notes}
                          onChange={(e) => updateNotes(index, e.target.value)}
                          className="h-[140px]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDestination(index)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              size="lg"
              className="px-8"
            >
              {isSubmitting ? "Creating..." : "Create Itinerary"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
