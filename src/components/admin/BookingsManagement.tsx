
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Booking, BookingStatus, PaymentStatus, getBookings, updateBooking } from '@/models/Booking';
import { Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import BookingsTable from './BookingsTable';

const BookingsManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openProofDialog, setOpenProofDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({
    key: 'booking_date',
    direction: 'desc'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const fetchedBookings = await getBookings();
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load bookings.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenEditDialog(true);
  };

  const handleViewPaymentProof = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenProofDialog(true);
  };

  const handleUpdateBookingStatus = async () => {
    if (!selectedBooking) return;
    
    try {
      await updateBooking(selectedBooking.id, {
        status: selectedBooking.status,
        payment_status: selectedBooking.payment_status
      });
      
      toast({
        title: 'Success',
        description: 'Booking updated successfully.',
      });
      
      setOpenEditDialog(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update booking.',
      });
    }
  };

  const handleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    if (sortConfig.key === 'booking_date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()
        : new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime();
    }
    if (sortConfig.key === 'total_price') {
      return sortConfig.direction === 'asc' 
        ? a.total_price - b.total_price
        : b.total_price - a.total_price;
    }
    if (sortConfig.key === 'number_of_people') {
      return sortConfig.direction === 'asc' 
        ? a.number_of_people - b.number_of_people
        : b.number_of_people - a.number_of_people;
    }
    return 0;
  });

  // Helper function to get booking name
  const getBookingName = (booking: Booking) => {
    // For destinations
    if (booking.destination_id && booking.destinations) {
      return booking.destinations.name;
    }
    
    // For events
    if (booking.event_id && booking.events) {
      return booking.events.title;
    }
    
    // Fallback to booking details if available
    if (booking.booking_details) {
      return booking.booking_details.destination_name || 
             booking.booking_details.event_name || 
             'Unnamed Booking';
    }
    
    return 'Unnamed Booking';
  };

  // Helper function to get booking location
  const getBookingLocation = (booking: Booking) => {
    // For destinations
    if (booking.destination_id && booking.destinations) {
      return booking.destinations.location;
    }
    
    // For events
    if (booking.event_id && booking.events) {
      return booking.events.location;
    }
    
    // Fallback to booking details if available
    if (booking.booking_details) {
      return booking.booking_details.destination_location || 
             booking.booking_details.event_location || 
             'Unknown Location';
    }
    
    return 'Unknown Location';
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
        <CardDescription>View and manage customer bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <BookingsTable 
          bookings={sortedBookings}
          isLoading={isLoading}
          onViewPaymentProof={handleViewPaymentProof}
          onEditBooking={handleEditBooking}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
        
        {/* Edit Booking Dialog */}
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Booking Status</DialogTitle>
              <DialogDescription>
                Change the status of this booking.
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Customer:</div>
                  <div className="col-span-3">{selectedBooking.contact_name}</div>
                  
                  <div className="font-medium">Email:</div>
                  <div className="col-span-3">{selectedBooking.contact_email}</div>
                  
                  <div className="font-medium">Phone:</div>
                  <div className="col-span-3">{selectedBooking.contact_phone}</div>

                  <div className="font-medium">Booking:</div>
                  <div className="col-span-3">{getBookingName(selectedBooking)}</div>

                  <div className="font-medium">Location:</div>
                  <div className="col-span-3">{getBookingLocation(selectedBooking)}</div>

                  <div className="font-medium">Date:</div>
                  <div className="col-span-3">
                    {new Date(selectedBooking.booking_date).toLocaleDateString()}
                    {selectedBooking.preferred_date && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Preferred: {new Date(selectedBooking.preferred_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="font-medium">People:</div>
                  <div className="col-span-3">{selectedBooking.number_of_people}</div>
                  
                  <div className="font-medium">Total:</div>
                  <div className="col-span-3">${selectedBooking.total_price.toFixed(2)}</div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Booking Status</label>
                  <Select 
                    value={selectedBooking.status || 'pending'} 
                    onValueChange={(value) => setSelectedBooking({
                      ...selectedBooking,
                      status: value as BookingStatus
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <Select 
                    value={selectedBooking.payment_status || 'pending'} 
                    onValueChange={(value) => setSelectedBooking({
                      ...selectedBooking,
                      payment_status: value as PaymentStatus
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBookingStatus}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Proof Dialog */}
        <Dialog open={openProofDialog} onOpenChange={setOpenProofDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Payment Proof</DialogTitle>
              <DialogDescription>
                Payment proof uploaded by {selectedBooking?.contact_name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && selectedBooking.payment_proof_url && (
              <div className="flex flex-col items-center">
                <div className="max-h-96 overflow-auto my-4">
                  <img 
                    src={selectedBooking.payment_proof_url} 
                    alt="Payment Proof" 
                    className="max-w-full rounded-md shadow-md"
                  />
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {selectedBooking.payment_proof_uploaded_at ? (
                    <p>Uploaded {formatDistanceToNow(new Date(selectedBooking.payment_proof_uploaded_at), { addSuffix: true })}</p>
                  ) : (
                    <p>Upload date not available</p>
                  )}
                </div>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    window.open(selectedBooking.payment_proof_url, '_blank');
                  }}
                >
                  <Download size={16} />
                  Download Proof
                </Button>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenProofDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BookingsManagement;
