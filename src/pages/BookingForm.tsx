import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/DashboardLayout';
import { AlertCircle, Calendar as CalendarIcon2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDestination } from '@/models/Destination';
import { createBooking } from '@/models/Booking';
import { useAuth } from '@/contexts/AuthContext';
import DestinationMap from '@/components/DestinationMap';

const bookingSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  startDate: z.date(),
  endDate: z.date(),
  numberOfTravelers: z.number().min(1, {
    message: "Number of travelers must be at least 1.",
  }),
  additionalNotes: z.string().optional(),
});

type BookingSchemaType = z.infer<typeof bookingSchema>;

const BookingForm = () => {
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<BookingSchemaType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      startDate: new Date(),
      endDate: new Date(),
      numberOfTravelers: 1,
      additionalNotes: "",
    },
  });

  useEffect(() => {
    const loadDestination = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getDestination(id);
        console.log("Loaded destination:", data);
        setDestination(data);
      } catch (error) {
        console.error("Error loading destination:", error);
        toast({
          title: "Error",
          description: "Failed to load destination details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDestination();
  }, [id, toast]);

  const onSubmit = async (values: BookingSchemaType) => {
    if (!destination || !user) {
      toast({
        title: "Error",
        description: "Destination or user details not loaded properly.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const bookingData = {
        ...values,
        destinationId: destination.id,
        userId: user.id,
        totalPrice: destination.price * values.numberOfTravelers,
      };

      const newBooking = await createBooking(bookingData);

      toast({
        title: "Success",
        description: "Booking created successfully!",
      });

      navigate(`/booking-confirmation/${newBooking.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "Failed to create booking.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Book Your Experience</h1>
          <p className="text-muted-foreground">Complete the form below to book your trip.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-muted h-10 w-3/4 rounded animate-pulse" />
              <div className="bg-muted h-64 rounded animate-pulse" />
            </div>
            <div className="bg-muted h-96 rounded animate-pulse" />
          </div>
        ) : destination ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">{destination.name}</h2>
              <div className="mb-6">
                <img 
                  src={destination.image_url || '/placeholder.svg'} 
                  alt={destination.name} 
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>

              {(destination.latitude !== null && destination.longitude !== null) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Location</h3>
                  <DestinationMap 
                    latitude={destination.latitude} 
                    longitude={destination.longitude} 
                    name={destination.name}
                  />
                </div>
              )}

              <p className="text-muted-foreground mb-4">{destination.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium">Location</h3>
                  <p className="text-muted-foreground">{destination.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Price</h3>
                  <p className="text-xl font-bold text-primary">${destination.price}</p>
                </div>
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Book {destination.name}</CardTitle>
                  <CardDescription>Fill in your booking details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="123-456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3.5 font-normal text-left",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
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
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date()
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3.5 font-normal text-left",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
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
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date()
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="numberOfTravelers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Travelers</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Any special requests?"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={isProcessing}>
                          {isProcessing ? "Processing..." : "Proceed to Payment"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Destination Not Found</h2>
            <p className="text-muted-foreground mb-6">The destination you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/destinations')}>
              Back to Destinations
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookingForm;
