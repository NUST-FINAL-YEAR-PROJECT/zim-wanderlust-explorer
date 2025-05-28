
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createBooking, updateBooking, BookingStatus, PaymentStatus, sendBookingConfirmationEmail } from '@/models/Booking';
import { createPayment } from '@/models/Payment';
import { CalendarIcon, MapPin, Users, Bed, Star } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import BookingSplash from './BookingSplash';
import BookingSuccessDialog from './BookingSuccessDialog';
import LoadingDialog from './ui/loading-dialog';
import { useProcessDialog } from '@/hooks/useProcessDialog';
import { cn } from '@/lib/utils';

interface AccommodationDetails {
  id: string;
  name: string;
  description?: string;
  location: string;
  price_per_night: number;
  image_url?: string;
  rating?: number;
  review_count?: number;
  max_guests?: number;
  amenities?: string[];
  room_types?: any;
  is_featured?: boolean;
}

interface AccommodationBookingFormProps {
  accommodationId: string;
  accommodationDetails: AccommodationDetails;
}

const AccommodationBookingForm = ({ accommodationId, accommodationDetails }: AccommodationBookingFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showBookingSplash, setShowBookingSplash] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const processDialog = useProcessDialog();
  
  // Form state
  const [checkInDate, setCheckInDate] = useState<Date>(addDays(new Date(), 1));
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 2));
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [contactName, setContactName] = useState(user?.user_metadata?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('standard');

  // Calculate number of nights and total price
  const numberOfNights = differenceInDays(checkOutDate, checkInDate);
  const basePrice = accommodationDetails?.price_per_night || 0;
  const roomTypeMultiplier = selectedRoomType === 'deluxe' ? 1.5 : selectedRoomType === 'suite' ? 2 : 1;
  const totalPrice = numberOfNights * basePrice * roomTypeMultiplier;

  // Safely parse room types from database
  const getRoomTypes = () => {
    if (!accommodationDetails?.room_types) {
      return [
        { id: 'standard', name: 'Standard Room', multiplier: 1 },
        { id: 'deluxe', name: 'Deluxe Room', multiplier: 1.5 },
        { id: 'suite', name: 'Suite', multiplier: 2 }
      ];
    }

    let roomTypes = accommodationDetails.room_types;
    
    // If room_types is a string, try to parse it as JSON
    if (typeof roomTypes === 'string') {
      try {
        roomTypes = JSON.parse(roomTypes);
      } catch (error) {
        console.error('Error parsing room_types:', error);
        return [
          { id: 'standard', name: 'Standard Room', multiplier: 1 },
          { id: 'deluxe', name: 'Deluxe Room', multiplier: 1.5 },
          { id: 'suite', name: 'Suite', multiplier: 2 }
        ];
      }
    }

    // If it's not an array, return default
    if (!Array.isArray(roomTypes)) {
      return [
        { id: 'standard', name: 'Standard Room', multiplier: 1 },
        { id: 'deluxe', name: 'Deluxe Room', multiplier: 1.5 },
        { id: 'suite', name: 'Suite', multiplier: 2 }
      ];
    }

    // Validate each room type object
    return roomTypes.map((room: any, index: number) => ({
      id: room?.id || room?.name?.toLowerCase() || `room-${index}`,
      name: room?.name || `Room Type ${index + 1}`,
      multiplier: room?.multiplier || 1
    }));
  };

  const roomTypes = getRoomTypes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to book accommodation.');
      navigate('/auth');
      return;
    }

    if (!contactName || !contactEmail || !contactPhone) {
      toast.error('Please fill in all contact information.');
      return;
    }

    if (numberOfNights < 1) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }

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
      `Booking ${accommodationDetails?.name} for ${numberOfGuests} ${numberOfGuests === 1 ? 'guest' : 'guests'}`
    );

    try {
      // Step 1: Validation
      processDialog.updateProgress(0);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Create booking record
      processDialog.updateProgress(1);
      
      const booking = await createBooking({
        user_id: user.id,
        destination_id: accommodationId, // Map accommodation to destination_id for database compatibility
        booking_date: new Date().toISOString(),
        number_of_people: numberOfGuests,
        total_price: totalPrice,
        preferred_date: checkInDate.toISOString(),
        booking_details: {
          type: 'accommodation',
          accommodation_id: accommodationId,
          accommodation_name: accommodationDetails?.name || 'Accommodation',
          accommodation_location: accommodationDetails?.location || 'Location not specified',
          check_in_date: checkInDate.toISOString(),
          check_out_date: checkOutDate.toISOString(),
          number_of_nights: numberOfNights,
          room_type: selectedRoomType,
          base_price: basePrice,
          room_type_multiplier: roomTypeMultiplier
        },
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        status: 'pending' as BookingStatus,
        payment_status: 'pending' as PaymentStatus,
      });
      
      if (!booking) {
        throw new Error('Failed to create booking.');
      }

      // Step 3: Create associated payment record
      processDialog.updateProgress(2);
      
      const payment = await createPayment({
        booking_id: booking.id,
        amount: totalPrice,
        status: 'pending',
        payment_gateway: 'manual',
        payment_details: {
          accommodation_id: accommodationId,
          room_type: selectedRoomType,
          number_of_guests: numberOfGuests,
          number_of_nights: numberOfNights
        }
      });
      
      if (!payment) {
        throw new Error('Failed to create payment record.');
      }

      // Update booking with payment_id
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

      // Set booking data for success dialog
      setBookingData({
        type: 'accommodation',
        name: accommodationDetails?.name || 'Accommodation',
        bookingId: booking.id,
        totalAmount: totalPrice,
        currency: '$'
      });

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
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const handleProceedToPayment = () => {
    setShowSuccessDialog(false);
    if (bookingData) {
      navigate(`/payment/${bookingData.bookingId}`);
    }
  };

  const handleViewBooking = () => {
    setShowSuccessDialog(false);
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
          itemName={accommodationDetails?.name || 'this accommodation'}
          onComplete={() => setShowBookingSplash(false)}
        />
      )}

      {showSuccessDialog && bookingData && (
        <BookingSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          bookingDetails={bookingData}
          onProceedToPayment={handleProceedToPayment}
          onViewBooking={handleViewBooking}
        />
      )}

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Book Your Stay</CardTitle>
          <CardDescription>Complete the form below to book {accommodationDetails?.name || 'this accommodation'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Accommodation Summary */}
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-1/3 h-40 rounded-md overflow-hidden">
                  {accommodationDetails?.image_url ? (
                    <img 
                      src={accommodationDetails.image_url} 
                      alt={accommodationDetails.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                      <Bed className="h-12 w-12 text-amber-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{accommodationDetails?.name || 'Accommodation'}</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin size={16} className="mr-2" />
                      <span>{accommodationDetails?.location || 'Location not specified'}</span>
                    </div>
                    {accommodationDetails?.rating && (
                      <div className="flex items-center text-muted-foreground">
                        <Star size={16} className="mr-2 fill-current text-yellow-500" />
                        <span>{accommodationDetails.rating.toFixed(1)} ({accommodationDetails.review_count || 0} reviews)</span>
                      </div>
                    )}
                    {accommodationDetails?.max_guests && (
                      <div className="flex items-center text-muted-foreground">
                        <Users size={16} className="mr-2" />
                        <span>Up to {accommodationDetails.max_guests} guests</span>
                      </div>
                    )}
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {accommodationDetails?.description || 'No description available.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Booking Details</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Check-in Date */}
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={(date) => date && setCheckInDate(date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out Date */}
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={(date) => date && setCheckOutDate(date)}
                        disabled={(date) => date <= checkInDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Number of Guests */}
                <div className="space-y-2">
                  <Label htmlFor="numberOfGuests">Number of Guests</Label>
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setNumberOfGuests(prev => Math.max(1, prev - 1))}
                      disabled={numberOfGuests <= 1}
                    >
                      -
                    </Button>
                    <Input 
                      id="numberOfGuests"
                      type="number" 
                      value={numberOfGuests} 
                      onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)} 
                      min="1"
                      max={accommodationDetails?.max_guests || 10}
                      className="mx-2 text-center"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setNumberOfGuests(prev => Math.min(accommodationDetails?.max_guests || 10, prev + 1))}
                      disabled={numberOfGuests >= (accommodationDetails?.max_guests || 10)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type</Label>
                  <select 
                    id="roomType"
                    value={selectedRoomType} 
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    {roomTypes.map((room: any) => (
                      <option key={room.id} value={room.id}>
                        {room.name} (+{Math.round((room.multiplier - 1) * 100)}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
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
            
            {/* Price Summary */}
            <div className="bg-muted/40 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Base price per night:</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Number of nights:</span>
                  <span>{numberOfNights}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Room type multiplier:</span>
                  <span>×{roomTypeMultiplier}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-green-700">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/accommodations')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={processDialog.isOpen}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {processDialog.isOpen ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default AccommodationBookingForm;
