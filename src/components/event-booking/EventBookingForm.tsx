import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createBooking, updateBooking, BookingStatus, PaymentStatus, sendBookingConfirmationEmail } from '@/models/Booking';
import { createPayment } from '@/models/Payment';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      toast.error('You must be logged in to book an event.');
      navigate('/auth', { state: { redirectTo: `/events` } });
      return;
    }

    if (!contactName || !contactEmail || !contactPhone) {
      toast.error('Please fill in all contact information.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking record
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

      // Create associated payment record
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

      // Update booking with payment_id
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

      toast.success('Booking created successfully!');
      
      // Redirect to payment page
      navigate(`/payment/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          onClick={() => navigate('/events')}
          className="transition-all duration-300"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="gradient"
          className="transition-all duration-300"
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventBookingForm;
