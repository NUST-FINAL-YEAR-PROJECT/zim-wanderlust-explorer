import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createBooking, updateBooking, BookingStatus, PaymentStatus, sendBookingConfirmationEmail } from '@/models/Booking';
import { createPayment } from '@/models/Payment';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import BookingSplash from '@/components/BookingSplash';
import BookingConfirmationDialog from '@/components/BookingConfirmationDialog';
import BookingSuccessDialog from '../BookingSuccessDialog';
import LoadingDialog from '@/components/ui/loading-dialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { useProcessDialog } from '@/hooks/useProcessDialog';

// Import sub-components
import EventSummary from './EventSummary';
import BookingDetailsForm from './BookingDetailsForm';
import PriceSummary from './PriceSummary';

interface EventBookingFormProps {
  eventId: string;
  eventDetails: any;
}

const EventBookingForm = ({ eventId, eventDetails }: EventBookingFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBookingSplash, setShowBookingSplash] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const processDialog = useProcessDialog();

  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [contactName, setContactName] = useState(user?.user_metadata?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('regular');
  
  // Get the preferred date from the component
  const [preferredDate, setPreferredDate] = useState(format(new Date(new Date().getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));

  // Get ticket types from event details or use defaults
  const ticketTypes = eventDetails?.ticket_types || {
    regular: { name: 'Regular', price: eventDetails?.price || 0 },
    vip: { name: 'VIP', price: (eventDetails?.price || 0) * 1.5 }
  };

  // Calculate ticket price
  const getTicketPrice = () => {
    return ticketTypes[selectedTicketType]?.price || eventDetails?.price || 0;
  };

  // Calculate total price
  const totalPrice = numberOfPeople * getTicketPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to book an event.',
        variant: 'destructive',
      });
      navigate('/auth', { state: { redirectTo: `/events` } });
      return;
    }

    if (!contactName || !contactEmail || !contactPhone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all contact information.',
        variant: 'destructive',
      });
      return;
    }

    const steps = [
      'Validating booking details',
      'Creating booking record',
      'Setting up payment',
      'Sending confirmation email',
      'Finalizing booking'
    ];

    processDialog.startProcess(
      'Processing Your Booking', 
      steps, 
      `Booking ${eventDetails?.title || 'this event'} for ${numberOfPeople} ${numberOfPeople === 1 ? 'person' : 'people'}`
    );

    try {
      // Step 1: Validation
      processDialog.updateProgress(0);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Create booking record
      processDialog.updateProgress(1);
      
      const bookingData = {
        user_id: user.id,
        event_id: eventId,
        booking_date: new Date().toISOString(),
        number_of_people: numberOfPeople,
        total_price: totalPrice,
        preferred_date: new Date(preferredDate).toISOString(),
        booking_details: {
          event_name: eventDetails?.title || 'Event',
          event_location: eventDetails?.location || 'Location not specified',
          ticket_type: selectedTicketType,
          ticket_price: getTicketPrice(),
          payment_url: eventDetails?.payment_url || null
        },
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        status: 'pending' as BookingStatus,
        payment_status: 'pending' as PaymentStatus,
        selected_ticket_type: {
          type: selectedTicketType,
          name: ticketTypes[selectedTicketType]?.name || 'Regular',
          price: getTicketPrice()
        }
      };

      const booking = await createBooking(bookingData);
      
      if (!booking) {
        throw new Error('Failed to create booking.');
      }

      // Step 3: Create payment
      processDialog.updateProgress(2);
      
      const paymentData = {
        booking_id: booking.id,
        amount: totalPrice,
        status: 'pending',
        payment_gateway: 'manual',
        payment_details: {
          event_id: eventId,
          ticket_type: selectedTicketType,
          number_of_people: numberOfPeople,
          payment_url: eventDetails?.payment_url || null
        }
      };

      const payment = await createPayment(paymentData);
      
      if (!payment) {
        throw new Error('Failed to create payment record.');
      }

      // Step 4: Update booking with payment_id
      await updateBooking(booking.id, {
        payment_id: payment.id
      });

      // Step 5: Send confirmation email
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

      processDialog.updateProgress(4);
      setCreatedBooking(booking);
      
      // Complete process and show success
      processDialog.completeProcess();
      setTimeout(() => {
        setShowBookingSplash(false);
        setShowSuccessDialog(true);
      }, 1500);

    } catch (error) {
      processDialog.closeProcess();
      console.error('Error creating booking:', error);
      toast({
        title: 'Booking Failed',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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

  const handlePayNow = () => {
    setShowConfirmationDialog(false);
    if (createdBooking) {
      navigate(`/payment/${createdBooking.id}`);
    }
  };

  const handleCancelBooking = () => {
    setShowCancelDialog(false);
    navigate('/events');
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

      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? All entered information will be lost."
        confirmText="Yes, Cancel"
        cancelText="Continue Booking"
        variant="destructive"
      />

      {showBookingSplash && (
        <BookingSplash
          bookingType="event"
          itemName={eventDetails?.title || 'this event'}
          onComplete={() => setShowBookingSplash(false)}
        />
      )}

      {showSuccessDialog && createdBooking && (
        <BookingSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          bookingDetails={{
            type: 'event',
            name: eventDetails?.title || 'Event',
            bookingId: createdBooking.id,
            totalAmount: totalPrice,
            currency: '$'
          }}
          onProceedToPayment={handleProceedToPayment}
          onViewBooking={handleViewBooking}
        />
      )}

      {showConfirmationDialog && createdBooking && (
        <BookingConfirmationDialog
          isOpen={showConfirmationDialog}
          onClose={() => setShowConfirmationDialog(false)}
          bookingDetails={{
            type: 'event',
            name: eventDetails?.title || 'Event',
            date: format(new Date(preferredDate), 'PPP'),
            location: eventDetails?.location || 'Location not specified',
            guests: numberOfPeople,
            totalPrice: totalPrice,
            bookingId: createdBooking.id
          }}
          onViewBooking={handleViewBooking}
          onPayNow={handlePayNow}
        />
      )}

      <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-card border-b border-border/50">
          <CardTitle className="text-2xl font-display">Book Event</CardTitle>
          <CardDescription>Complete the form below to book {eventDetails?.title || 'this event'}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <EventSummary eventDetails={eventDetails} />

            <BookingDetailsForm
              selectedTicketType={selectedTicketType}
              setSelectedTicketType={setSelectedTicketType}
              numberOfPeople={numberOfPeople}
              setNumberOfPeople={setNumberOfPeople}
              preferredDate={preferredDate}
              setPreferredDate={setPreferredDate}
              contactName={contactName}
              setContactName={setContactName}
              contactEmail={contactEmail}
              setContactEmail={setContactEmail}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              ticketTypes={ticketTypes}
            />
            
            <PriceSummary 
              ticketPrice={getTicketPrice()} 
              numberOfPeople={numberOfPeople}
              totalPrice={totalPrice} 
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 border-t border-border/50 p-6">
          <Button 
            variant="outline" 
            onClick={() => setShowCancelDialog(true)}
            className="transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={processDialog.isOpen}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300"
          >
            {processDialog.isOpen ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default EventBookingForm;
