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
import { ArrowDown, ArrowUp, Download, Calendar, MapPin } from 'lucide-react';

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

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  // Helper function to determine booking type
  const getBookingType = (booking: Booking) => {
    if (booking.destination_id) return 'Destination';
    if (booking.event_id) return 'Event';
    return 'Unknown';
  };

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
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-8 text-center">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center">No bookings found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name / Location</TableHead>
                  <TableHead 
                    className="cursor-pointer flex items-center gap-1" 
                    onClick={() => handleSort('booking_date')}
                  >
                    Date <SortIcon column="booking_date" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer flex items-center gap-1"
                    onClick={() => handleSort('number_of_people')}
                  >
                    People <SortIcon column="number_of_people" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer flex items-center gap-1"
                    onClick={() => handleSort('total_price')}
                  >
                    Total <SortIcon column="total_price" />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.contact_name}</div>
                      <div className="text-xs text-gray-500">
                        {booking.contact_email}<br />
                        {booking.contact_phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        booking.destination_id ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                      }>
                        {getBookingType(booking)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{getBookingName(booking)}</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin size={12} className="mr-1" /> {getBookingLocation(booking)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{new Date(booking.booking_date).toLocaleDateString()}</div>
                      {booking.preferred_date && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar size={12} className="mr-1" /> 
                          {new Date(booking.preferred_date).toLocaleDateString()}
                        </div>
                      )}
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
                      {booking.payment_proof_url ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleViewPaymentProof(booking)}
                        >
                          View
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-xs">No proof</span>
                      )}
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

                  <div className="font-medium">Type:</div>
                  <div className="col-span-3">
                    <Badge variant="outline" className={
                      selectedBooking.destination_id ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                    }>
                      {getBookingType(selectedBooking)}
                    </Badge>
                  </div>

                  <div className="font-medium">Booking:</div>
                  <div className="col-span-3">{getBookingName(selectedBooking)}</div>

                  <div className="font-medium">Location:</div>
                  <div className="col-span-3">{getBookingLocation(selectedBooking)}</div>

                  <div className="font-medium">Date:</div>
                  <div className="col-span-3">
                    {new Date(selectedBooking.booking_date).toLocaleDateString()}
                    {selectedBooking.preferred_date && (
                      <div className="text-sm text-gray-500 mt-1">
                        Preferred: {new Date(selectedBooking.preferred_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="font-medium">People:</div>
                  <div className="col-span-3">{selectedBooking.number_of_people}</div>
                  
                  <div className="font-medium">Total:</div>
                  <div className="col-span-3">${selectedBooking.total_price.toFixed(2)}</div>

                  {selectedBooking.selected_ticket_type && (
                    <>
                      <div className="font-medium">Ticket Type:</div>
                      <div className="col-span-3">
                        {selectedBooking.selected_ticket_type.name || 'Standard'}
                        {selectedBooking.selected_ticket_type.price && (
                          <span className="text-sm text-gray-500 ml-2">
                            (${selectedBooking.selected_ticket_type.price} each)
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {selectedBooking.booking_details && Object.keys(selectedBooking.booking_details).length > 0 && (
                    <>
                      <div className="font-medium">Additional Details:</div>
                      <div className="col-span-3">
                        <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-2 rounded">
                          {JSON.stringify(selectedBooking.booking_details, null, 2)}
                        </pre>
                      </div>
                    </>
                  )}
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
                <div className="text-sm text-gray-500 mb-4">
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
