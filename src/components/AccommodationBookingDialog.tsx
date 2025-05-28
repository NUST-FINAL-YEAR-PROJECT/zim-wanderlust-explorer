
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { createBooking, updateBooking, sendBookingConfirmationEmail } from '@/models/Booking';
import { createPayment } from '@/models/Payment';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingDialog from '@/components/ui/loading-dialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import BookingSplash from '@/components/BookingSplash';
import BookingSuccessDialog from '@/components/BookingSuccessDialog';
import { useProcessDialog } from '@/hooks/useProcessDialog';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

const accommodationBookingSchema = z.object({
  checkInDate: z.date({
    required_error: "Please select a check-in date",
  }),
  checkOutDate: z.date({
    required_error: "Please select a check-out date",
  }),
  numberOfGuests: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1;
  }, { message: 'Please enter a valid number of guests' }),
  roomType: z.string().min(1, 'Please select a room type'),
  contactName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email address' }),
  contactPhone: z.string().min(10, { message: 'Please enter a valid phone number' }),
});

interface AccommodationBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation: any;
}

const AccommodationBookingDialog = ({
  isOpen,
  onClose,
  accommodation
}: AccommodationBookingDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showBookingSplash, setShowBookingSplash] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const processDialog = useProcessDialog();

  const form = useForm<z.infer<typeof accommodationBookingSchema>>({
    resolver: zodResolver(accommodationBookingSchema),
    defaultValues: {
      contactName: user?.user_metadata?.name || '',
      contactEmail: user?.email || '',
      contactPhone: '',
      numberOfGuests: '1',
      roomType: ''
    },
  });

  const onSubmit = async (data: z.infer<typeof accommodationBookingSchema>) => {
    const steps = [
      'Validating accommodation details',
      'Creating booking record',
      'Setting up payment',
      'Sending confirmation email',
      'Finalizing reservation'
    ];

    processDialog.startProcess(
      'Booking Your Stay',
      steps,
      `Booking ${accommodation.name} for ${data.numberOfGuests} ${parseInt(data.numberOfGuests) === 1 ? 'guest' : 'guests'}`
    );

    try {
      // Step 1: Validation
      processDialog.updateProgress(0);
      await new Promise(resolve => setTimeout(resolve, 500));

      const numberOfGuests = parseInt(data.numberOfGuests);
      const nights = Math.ceil((data.checkOutDate.getTime() - data.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = accommodation.price_per_night * nights;

      // Step 2: Create booking
      processDialog.updateProgress(1);

      const booking = await createBooking({
        user_id: user?.id || null,
        destination_id: accommodation.id, // Map accommodation to destination_id for database compatibility
        booking_date: new Date().toISOString(),
        number_of_people: numberOfGuests,
        total_price: totalPrice,
        preferred_date: data.checkInDate.toISOString(),
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        status: 'pending',
        payment_status: 'pending',
        booking_details: {
          type: 'accommodation',
          accommodation_id: accommodation.id,
          accommodation_name: accommodation.name,
          accommodation_location: accommodation.location,
          room_type: data.roomType,
          check_in_date: data.checkInDate.toISOString(),
          check_out_date: data.checkOutDate.toISOString(),
          nights: nights,
          price_per_night: accommodation.price_per_night
        }
      });

      if (!booking) {
        throw new Error('Failed to create booking');
      }

      // Step 3: Create payment
      processDialog.updateProgress(2);

      const payment = await createPayment({
        booking_id: booking.id,
        amount: totalPrice,
        status: 'pending',
        payment_gateway: 'manual',
        payment_details: {
          accommodation_id: accommodation.id,
          number_of_nights: nights,
          room_type: data.roomType
        }
      });

      if (!payment) {
        throw new Error('Failed to create payment record');
      }

      await updateBooking(booking.id, {
        payment_id: payment.id
      });

      // Step 4: Send confirmation email
      processDialog.updateProgress(3);

      sendBookingConfirmationEmail(booking.id)
        .then(success => {
          if (success) {
            console.log('Booking confirmation email sent successfully');
          }
        })
        .catch(err => {
          console.error('Error sending booking confirmation email:', err);
        });

      // Step 5: Finalize
      processDialog.updateProgress(4);

      processDialog.completeProcess();
      setCreatedBooking(booking);

      setTimeout(() => {
        setShowBookingSplash(true);
      }, 1000);

      setTimeout(() => {
        setShowBookingSplash(false);
        setShowSuccessDialog(true);
      }, 3500);

    } catch (error) {
      processDialog.closeProcess();
      console.error("Error creating accommodation booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const handleProceedToPayment = () => {
    setShowSuccessDialog(false);
    onClose();
    if (createdBooking) {
      navigate(`/payment/${createdBooking.id}`);
    }
  };

  const handleViewBooking = () => {
    setShowSuccessDialog(false);
    onClose();
    navigate('/bookings');
  };

  return (
    <>
      <LoadingDialog
        isOpen={processDialog.isOpen}
        title={processDialog.title}
        description={processDialog.description}
        progress={processDialog.progress}
        steps={processDialog.steps}
        currentStep={processDialog.currentStep}
      />

      {showBookingSplash && (
        <BookingSplash
          duration={2500}
          bookingType="accommodation"
          itemName={accommodation?.name || 'this accommodation'}
          onComplete={() => setShowBookingSplash(false)}
        />
      )}

      {showSuccessDialog && createdBooking && (
        <BookingSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          bookingDetails={{
            type: 'accommodation',
            name: accommodation?.name || 'Accommodation',
            bookingId: createdBooking.id,
            totalAmount: createdBooking.total_price,
            currency: '$'
          }}
          onProceedToPayment={handleProceedToPayment}
          onViewBooking={handleViewBooking}
        />
      )}

      <Dialog open={isOpen && !showBookingSplash && !showSuccessDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book {accommodation?.name}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stay Details</CardTitle>
                  <CardDescription>Select your check-in and check-out dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-in Date</FormLabel>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-out Date</FormLabel>
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
                                disabled={(date) => date < new Date() || date <= form.watch('checkInDate')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numberOfGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Guests</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max={accommodation?.max_guests || 10}
                              placeholder="Enter number of guests" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {accommodation?.room_types?.map((room: any, index: number) => (
                                <SelectItem key={index} value={room.name}>
                                  {room.name} - ${room.price}/night
                                </SelectItem>
                              )) || (
                                <SelectItem value="standard">Standard Room</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
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

              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={processDialog.isOpen}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={processDialog.isOpen}
                >
                  {processDialog.isOpen ? "Processing..." : "Book Now"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccommodationBookingDialog;
