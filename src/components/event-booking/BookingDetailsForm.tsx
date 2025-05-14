
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { format, addDays } from 'date-fns';

interface BookingDetailsFormProps {
  selectedTicketType: string;
  setSelectedTicketType: (value: string) => void;
  numberOfPeople: number;
  setNumberOfPeople: (value: number) => void;
  preferredDate: string;
  setPreferredDate: (value: string) => void;
  contactName: string;
  setContactName: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  ticketTypes: Record<string, any>;
}

const BookingDetailsForm = ({
  selectedTicketType,
  setSelectedTicketType,
  numberOfPeople,
  setNumberOfPeople,
  preferredDate,
  setPreferredDate,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  ticketTypes,
}: BookingDetailsFormProps) => {
  
  // Calculate available dates (next 30 days)
  const availableDates = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = addDays(new Date(), i + 1);
      return {
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEEE, MMMM d, yyyy')
      };
    });
  }, []);
  
  // Helper functions to handle number of people changes
  const decrementPeople = () => {
    if (numberOfPeople > 1) {
      setNumberOfPeople(numberOfPeople - 1);
    }
  };
  
  const incrementPeople = () => {
    setNumberOfPeople(numberOfPeople + 1);
  };
  
  return (
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
                onClick={decrementPeople}
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
                onClick={incrementPeople}
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
  );
};

export default BookingDetailsForm;
