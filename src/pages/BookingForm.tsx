import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { getDestination } from '@/models/Destination';
import { createBooking, updateBooking, sendBookingConfirmationEmail } from '@/models/Booking';
import { createPayment } from '@/models/Payment';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Form schema using zod
const bookingSchema = z.object({
  contactName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email address' }),
  contactPhone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  preferredDate: z.date({
    required_error: "Please select a date",
  }),
  numberOfPeople: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1;
  }, { message: 'Please enter a valid number of people' }),
});

const BookingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      contactName: '',
      contactEmail: user?.email || '',
      contactPhone: '',
      numberOfPeople: '1'
    },
  });

  // Fetch destination details
  const { data: destination, isLoading, error } = useQuery({
    queryKey: ['destination', id],
    queryFn: () => getDestination(id as string),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-10 w-1/2" />
            </div>
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !destination) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Destination Not Found</h2>
          <p className="text-muted-foreground mb-6">The destination you're trying to book doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/destinations')}>
            Back to Destinations
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted with data:", data);
      
      // Calculate total price based on number of people
      const numberOfPeople = parseInt(data.numberOfPeople);
      const totalPrice = destination!.price * numberOfPeople;
      
      console.log("Creating booking with total price:", totalPrice);
      
      // Create booking
      const booking = await createBooking({
        destination_id: destination!.id,
        user_id: user?.id || null,
        booking_date: new Date().toISOString(),
        number_of_people: numberOfPeople,
        total_price: totalPrice,
        preferred_date: data.preferredDate.toISOString(),
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        status: 'pending',
        payment_status: 'pending',
        booking_details: {
          destination_name: destination!.name,
          destination_location: destination!.location,
          price_per_person: destination!.price,
          payment_url: destination!.payment_url || null
        }
      });
      
      console.log("Booking created:", booking);
      
      if (!booking) {
        throw new Error('Failed to create booking');
      }
      
      // Create payment record
      const payment = await createPayment({
        booking_id: booking.id,
        amount: totalPrice,
        status: 'pending',
        payment_gateway: 'manual',
        payment_details: {
          destination_id: destination!.id,
          payment_url: destination!.payment_url || null,
          number_of_people: numberOfPeople
        }
      });
      
      console.log("Payment created:", payment);
      
      if (!payment) {
        throw new Error('Failed to create payment record');
      }
      
      // Update booking with payment ID
      await updateBooking(booking.id, {
        payment_id: payment.id
      });
      
      // Send booking confirmation email
      sendBookingConfirmationEmail(booking.id)
        .then(success => {
          if (success) {
            console.log('Booking confirmation email sent successfully');
          } else {
            console.warn('Failed to send booking confirmation email');
          }
        })
        .catch(err => {
          console.error('Error sending booking confirmation email:', err);
        });
      
      toast.success("Booking created successfully!");
      // Navigate to payment page
      console.log("Navigating to payment page:", `/payment/${booking.id}`);
      navigate(`/payment/${booking.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Book Your Trip to {destination.name}</h1>
          <p className="text-muted-foreground mt-1">Fill out the form below to book your adventure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Please provide your contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Details</CardTitle>
                    <CardDescription>
                      Select your preferred date and number of travelers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Preferred Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Select your preferred travel date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="numberOfPeople"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of People</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              placeholder="Enter number of travelers" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Total cost will be calculated based on the number of travelers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img 
                        src={destination.image_url || '/placeholder.svg'} 
                        alt={destination.name}
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">{destination.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Base price</span>
                    <span>${destination.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Number of travelers</span>
                    <span>
                      {form.watch('numberOfPeople') ? parseInt(form.watch('numberOfPeople')) : 1}
                    </span>
                  </div>
                  
                  {destination.additional_costs && Object.keys(destination.additional_costs).length > 0 && (
                    <>
                      {Object.entries(destination.additional_costs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-muted-foreground">{key}</span>
                          <span>${parseFloat(value as string).toFixed(2)}</span>
                        </div>
                      ))}
                    </>
                  )}
                  
                  <div className="flex justify-between py-3 border-t border-b font-medium mt-2">
                    <span>Total</span>
                    <span className="text-lg">
                      ${(destination.price * (form.watch('numberOfPeople') ? parseInt(form.watch('numberOfPeople')) : 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p className="font-medium">Booking Notes:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Prices are per person</li>
                    <li>Cancelation available up to 48 hours before trip</li>
                    <li>Weather conditions may affect availability</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingForm;
