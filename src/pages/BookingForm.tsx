import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CalendarIcon } from 'lucide-react';
import { getDestination } from '@/models/Destination';
import { createBooking, updateBooking, sendBookingConfirmationEmail } from '@/models/Booking';
import { createPayment } from '@/models/Payment';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LoadingDialog from '@/components/ui/loading-dialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import BookingSplash from '@/components/BookingSplash';
import BookingSuccessDialog from '@/components/BookingSuccessDialog';
import { useProcessDialog } from '@/hooks/useProcessDialog';
import { toast } from 'sonner';

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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showBookingSplash, setShowBookingSplash] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const processDialog = useProcessDialog();

  // Initialize the form
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      contactName: user?.user_metadata?.name || '',
      contactEmail: user?.email || '',
      contactPhone: '',
      numberOfPeople: '1',
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
    const steps = [
      'Validating trip details',
      'Creating booking record',
      'Setting up payment gateway',
      'Sending confirmation email',
      'Finalizing reservation'
    ];

    processDialog.startProcess(
      'Creating Your Booking',
      steps,
      `Booking ${destination!.name} for ${data.numberOfPeople} ${parseInt(data.numberOfPeople) === 1 ? 'person' : 'people'}`
    );

    try {
      console.log("Form submitted with data:", data);
      
      // Step 1: Validation
      processDialog.updateProgress(0);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate total price based on number of people
      const numberOfPeople = parseInt(data.numberOfPeople);
      const totalPrice = destination!.price * numberOfPeople;
      
      console.log("Creating booking with total price:", totalPrice);
      
      // Step 2: Create booking
      processDialog.updateProgress(1);
      
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
      
      // Step 3: Create payment record
      processDialog.updateProgress(2);
      
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
      
      // Step 4: Send confirmation email
      processDialog.updateProgress(3);
      
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
      
      // Step 5: Finalize
      processDialog.updateProgress(4);
      
      processDialog.completeProcess();
      setCreatedBooking(booking);
      
      // Show splash screen after process completion
      setTimeout(() => {
        setShowBookingSplash(true);
      }, 1000);
      
      // Show success dialog after splash
      setTimeout(() => {
        setShowBookingSplash(false);
        setShowSuccessDialog(true);
      }, 3500);
      
    } catch (error) {
      processDialog.closeProcess();
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const handleProceedToPayment = () => {
    setShowSuccessDialog(false);
    if (createdBooking) {
      navigate(`/payment/${createdBooking.id}`);
    }
  };

  const handleViewBooking = () => {
    setShowSuccessDialog(false);
    navigate('/bookings');
  };

  const handleCancelBooking = () => {
    setShowCancelDialog(false);
    navigate('/destinations');
  };

  const handleSplashComplete = () => {
    setShowBookingSplash(false);
    navigate('/bookings');
  };

  return (
    <DashboardLayout>
      <LoadingDialog
        isOpen={processDialog.isOpen}
        title={processDialog.title}
        description={processDialog.description}
        progress={processDialog.progress}
        steps={processDialog.steps}
        currentStep={processDialog.currentStep}
      />

      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        description="Are you sure you want to leave? All entered information will be lost."
        confirmText="Yes, Leave"
        cancelText="Continue Booking"
        variant="destructive"
      />

      {showBookingSplash && (
        <BookingSplash
          bookingType="destination"
          itemName={destination?.name || 'Unknown Destination'}
          onComplete={handleSplashComplete}
          duration={2500}
        />
      )}

      {showSuccessDialog && createdBooking && (
        <BookingSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          bookingDetails={{
            type: 'destination',
            name: destination?.name || 'Destination',
            bookingId: createdBooking.id,
            totalAmount: createdBooking.total_price,
            currency: '$'
          }}
          onProceedToPayment={handleProceedToPayment}
          onViewBooking={handleViewBooking}
        />
      )}

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
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Let us know how to reach you about your booking
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
                      Choose your preferred dates and group size
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Preferred Start Date</FormLabel>
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
                            Select your preferred departure date
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
                              placeholder="Enter number of people" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How many people will be traveling?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowCancelDialog(true)}
                      className="flex-1"
                      disabled={processDialog.isOpen}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={processDialog.isOpen}
                    >
                      {processDialog.isOpen ? "Creating Booking..." : "Create Booking"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-green-100 overflow-hidden">
                    {destination.image_url ? (
                      <img 
                        src={destination.image_url} 
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No image available</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">{destination.name}</h3>
                    <p className="text-muted-foreground">{destination.location}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Price per person:</span>
                      <span className="font-medium">${destination.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of people:</span>
                      <span className="font-medium">{form.watch('numberOfPeople') || 1}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-green-700">
                          ${((destination.price || 0) * parseInt(form.watch('numberOfPeople') || '1')).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {destination.description && (
                    <div>
                      <h4 className="font-medium mb-2">About this destination:</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {destination.description}
                      </p>
                    </div>
                  )}
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
