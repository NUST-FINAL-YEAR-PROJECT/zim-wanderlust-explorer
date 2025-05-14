
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings, cancelBooking } from '@/models/Booking';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Search, FileDown, Check, Clock, X, Ban, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellationReason, setCancellationReason] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['userBookings', user?.id],
    queryFn: () => getUserBookings(user?.id as string),
    enabled: !!user?.id
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => cancelBooking(id, reason),
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      setCancellationReason('');
      setSelectedBookingId(null);
      queryClient.invalidateQueries({ queryKey: ['userBookings', user?.id] });
    },
    onError: (error) => {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking. Please try again.');
    }
  });

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const bookingName = booking.destination_id 
      ? booking.destinations?.name || booking.booking_details?.destination_name 
      : booking.events?.title || booking.booking_details?.event_name;

    const bookingLocation = booking.destination_id
      ? booking.destinations?.location || booking.booking_details?.destination_location
      : booking.events?.location || booking.booking_details?.event_location;

    const matchesSearch = !searchQuery || 
      (bookingName && bookingName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bookingLocation && bookingLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCancelBooking = () => {
    if (selectedBookingId && cancellationReason.trim()) {
      cancelMutation.mutate({
        id: selectedBookingId,
        reason: cancellationReason.trim()
      });
    } else {
      toast.error('Please provide a reason for cancellation');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/destinations')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Browse Destinations
            </Button>
            <Button 
              onClick={() => navigate('/events')}
              variant="outline"
            >
              Browse Events
            </Button>
          </div>
        </div>

        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search by name, location or booking ID..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="dashboard-card">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="upcoming">
                <BookingTable 
                  bookings={filteredBookings.filter(b => 
                    new Date(b.preferred_date || '') > new Date() && 
                    (b.status === 'pending' || b.status === 'confirmed')
                  )}
                  navigate={navigate}
                  onCancelBooking={setSelectedBookingId}
                />
              </TabsContent>
              
              <TabsContent value="past">
                <BookingTable 
                  bookings={filteredBookings.filter(b => 
                    new Date(b.preferred_date || '') < new Date() || 
                    (b.status === 'completed' || b.status === 'cancelled')
                  )}
                  navigate={navigate}
                  onCancelBooking={setSelectedBookingId}
                />
              </TabsContent>
              
              <TabsContent value="all">
                <BookingTable 
                  bookings={filteredBookings}
                  navigate={navigate}
                  onCancelBooking={setSelectedBookingId}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
        
        <Dialog 
          open={!!selectedBookingId} 
          onOpenChange={(open) => !open && setSelectedBookingId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium mb-1 block">Reason for cancellation</label>
              <Textarea 
                placeholder="Please provide a reason for cancellation" 
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedBookingId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelBooking}
                disabled={cancelMutation.isPending || !cancellationReason.trim()}
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

// Separate component for the booking table
const BookingTable = ({ 
  bookings, 
  navigate, 
  onCancelBooking
}: {
  bookings: any[];
  navigate: (path: string) => void;
  onCancelBooking: (id: string) => void;
}) => {
  if (bookings.length === 0) {
    return (
      <Card className="dashboard-card">
        <CardContent className="p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No bookings in this category</h3>
          <p className="text-muted-foreground mt-2">
            Try selecting a different category or adjusting your filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get booking name from various sources
  const getBookingName = (booking: any) => {
    if (booking.destination_id) {
      return booking.destinations?.name || booking.booking_details?.destination_name || 'Unnamed Destination';
    } else if (booking.event_id) {
      return booking.events?.title || booking.booking_details?.event_name || 'Unnamed Event';
    }
    return booking.booking_details?.destination_name || booking.booking_details?.event_name || 'Unnamed Booking';
  };

  // Helper function to get booking type
  const getBookingType = (booking: any) => {
    if (booking.destination_id) return 'Destination';
    if (booking.event_id) return 'Event';
    return 'Booking';
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string | null }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    
    if (status === 'confirmed') bgColor = 'bg-green-100 text-green-800';
    else if (status === 'pending') bgColor = 'bg-amber-100 text-amber-800';
    else if (status === 'cancelled') bgColor = 'bg-red-100 text-red-800';
    else if (status === 'completed') bgColor = 'bg-blue-100 text-blue-800';
    
    return (
      <Badge className={bgColor} variant="outline">
        {status || 'Unknown'}
      </Badge>
    );
  };

  // Payment status badge component
  const PaymentBadge = ({ status }: { status: string | null }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    
    if (status === 'completed') bgColor = 'bg-green-100 text-green-800';
    else if (status === 'pending') bgColor = 'bg-amber-100 text-amber-800';
    else if (status === 'failed') bgColor = 'bg-red-100 text-red-800';
    else if (status === 'processing') bgColor = 'bg-blue-100 text-blue-800';
    else if (status === 'refunded') bgColor = 'bg-purple-100 text-purple-800';
    
    return (
      <Badge className={bgColor} variant="outline">
        {status || 'Unknown'}
      </Badge>
    );
  };

  const getStatusIcon = (status: string | null) => {
    switch(status) {
      case 'confirmed': return <Check size={18} className="text-green-600" />;
      case 'pending': return <Clock size={18} className="text-amber-600" />;
      case 'cancelled': return <X size={18} className="text-red-600" />;
      case 'completed': return <Check size={18} className="text-blue-600" />;
      default: return <Clock size={18} className="text-gray-400" />;
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">{bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}</CardTitle>
          <CardDescription>Manage your travel plans</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="rounded-lg overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{getBookingName(booking)}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.number_of_people} {booking.number_of_people === 1 ? 'person' : 'people'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-100">
                      {getBookingType(booking)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(booking.preferred_date || '').toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <StatusBadge status={booking.status} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <PaymentBadge status={booking.payment_status} />
                  </TableCell>
                  <TableCell className="font-medium">
                    ${booking.total_price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      {booking.payment_status === 'completed' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/invoice/${booking.id}`)}
                        >
                          <FileDown className="mr-2 h-4 w-4" /> Invoice
                        </Button>
                      ) : booking.payment_status === 'pending' ? (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/payment/${booking.id}`)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Pay Now
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigate(`/invoice/${booking.id}`)}
                          >
                            <FileDown className="mr-2 h-4 w-4" /> Invoice
                          </Button>
                          {booking.status !== 'cancelled' && (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => onCancelBooking(booking.id)}
                            >
                              <Ban className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/payment/${booking.id}`)}
                        >
                          Details <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Bookings;
