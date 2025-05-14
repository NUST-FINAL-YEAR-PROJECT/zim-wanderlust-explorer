
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Input } from '@/components/ui/input';
import { Booking, BookingStatus, PaymentStatus, getBookings, updateBooking } from '@/models/Booking';
import { formatDistanceToNow } from 'date-fns';

const BookingsManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
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

  const getStatusBadgeColor = (status: BookingStatus | null) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentStatusBadgeColor = (status: PaymentStatus | null) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
        <CardDescription>View and manage customer bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-8 text-center">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center">No bookings found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.contact_name}</div>
                      <div className="text-xs text-gray-500">{booking.contact_email}</div>
                    </TableCell>
                    <TableCell>
                      <div>{new Date(booking.booking_date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(booking.booking_date), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell>{booking.number_of_people}</TableCell>
                    <TableCell>${booking.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(booking.status)}>
                        {booking.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusBadgeColor(booking.payment_status)}>
                        {booking.payment_status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditBooking(booking)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
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
      </CardContent>
    </Card>
  );
};

export default BookingsManagement;
