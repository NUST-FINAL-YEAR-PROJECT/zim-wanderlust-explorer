
import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBooking, updateBooking, BookingStatus, PaymentStatus } from '@/models/Booking';
import { createPayment } from '@/models/Payment';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from '@/components/ui/sonner';

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

  // Calculate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE, MMMM d, yyyy')
    };
  });

  const [preferredDate, setPreferredDate] = useState(availableDates[0].value);

  // Get ticket types from event details or use defaults
  const ticketTypes = eventDetails?.ticket_types || {
    regular: { name: 'Regular', price: eventDetails?.price || 0 },
    vip: { name: 'VIP', price: (eventDetails?.price || 0) * 1.5 }
  };

  // Calculate total price
  const getTicketPrice = () => {
    return ticketTypes[selectedTicketType]?.price || eventDetails?.price || 0;
  };

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
          number_of_people: numberOfPeople
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Book Event</CardTitle>
        <CardDescription>Complete the form below to book {eventDetails?.title || 'this event'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-1/3 h-40 rounded-md overflow-hidden">
                <img 
                  src={eventDetails?.image_url || '/placeholder.svg'} 
                  alt={eventDetails?.title || 'Event'} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{eventDetails?.title || 'Event Details'}</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {eventDetails?.start_date 
                        ? format(new Date(eventDetails.start_date), 'MMMM d, yyyy') 
                        : 'Date not specified'}
                      {eventDetails?.end_date && ` - ${format(new Date(eventDetails.end_date), 'MMMM d, yyyy')}`}
                    </span>
                  </div>
                  {eventDetails?.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin size={16} className="mr-2" />
                      <span>{eventDetails.location}</span>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {eventDetails?.description || 'No description available.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Booking Details</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketType">Ticket Type</Label>
                  <Select value={selectedTicketType} onValueChange={setSelectedTicketType}>
                    <SelectTrigger id="ticketType">
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ticketTypes).map(([key, ticket]: [string, any]) => (
                        <SelectItem key={key} value={key}>
                          {ticket.name} - ${ticket.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numberOfPeople">Number of People</Label>
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setNumberOfPeople(prev => Math.max(1, prev - 1))}
                      disabled={numberOfPeople <= 1}
                    >
                      -
                    </Button>
                    <Input 
                      id="numberOfPeople"
                      type="number" 
                      value={numberOfPeople} 
                      onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)} 
                      min="1"
                      className="mx-2 text-center"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setNumberOfPeople(prev => prev + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Select value={preferredDate} onValueChange={setPreferredDate}>
                    <SelectTrigger id="preferredDate">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Contact Information</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Full Name</Label>
                  <Input 
                    id="contactName" 
                    value={contactName} 
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={contactEmail} 
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input 
                    id="contactPhone" 
                    value={contactPhone} 
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Ticket Price:</span>
              <span>${getTicketPrice().toFixed(2)} × {numberOfPeople}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-green-700">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/events')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventBookingForm;
