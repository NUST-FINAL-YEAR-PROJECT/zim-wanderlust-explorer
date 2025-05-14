
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings } from '@/models/Booking';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Search, FileDown, Check, Clock, X } from 'lucide-react';

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['userBookings', user?.id],
    queryFn: () => getUserBookings(user?.id as string),
    enabled: !!user?.id
  });

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchQuery || 
      (booking.booking_details?.destination_name && booking.booking_details.destination_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: string | null }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    
    if (status === 'confirmed') bgColor = 'bg-green-100 text-green-800';
    else if (status === 'pending') bgColor = 'bg-amber-100 text-amber-800';
    else if (status === 'cancelled') bgColor = 'bg-red-100 text-red-800';
    else if (status === 'completed') bgColor = 'bg-blue-100 text-blue-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status || 'Unknown'}
      </span>
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status || 'Unknown'}
      </span>
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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Button 
            onClick={() => navigate('/destinations')}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Browse Destinations
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by destination or booking ID..."
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
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded" />
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
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mb-4">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No bookings found</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                You haven't made any bookings yet or no bookings match your filters.
              </p>
              <Button onClick={() => navigate('/destinations')}>
                Browse Destinations
              </Button>
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
                  StatusBadge={StatusBadge}
                  PaymentBadge={PaymentBadge}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
              
              <TabsContent value="past">
                <BookingTable 
                  bookings={filteredBookings.filter(b => 
                    new Date(b.preferred_date || '') < new Date() || 
                    (b.status === 'completed' || b.status === 'cancelled')
                  )}
                  navigate={navigate}
                  StatusBadge={StatusBadge}
                  PaymentBadge={PaymentBadge}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
              
              <TabsContent value="all">
                <BookingTable 
                  bookings={filteredBookings}
                  navigate={navigate}
                  StatusBadge={StatusBadge}
                  PaymentBadge={PaymentBadge}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Separate component for the booking table
const BookingTable = ({ 
  bookings, 
  navigate, 
  StatusBadge, 
  PaymentBadge,
  getStatusIcon
}: any) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="mb-4">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No bookings in this category</h3>
        <p className="text-muted-foreground mt-2">
          Try selecting a different category or adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destination</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking: any) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="font-medium">{booking.booking_details?.destination_name || 'Unnamed Destination'}</div>
                  <div className="text-sm text-muted-foreground">
                    {booking.number_of_people} {booking.number_of_people === 1 ? 'person' : 'people'}
                  </div>
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
                <TableCell>
                  ${booking.total_price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {booking.payment_status === 'completed' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/invoice/${booking.id}`)}
                    >
                      <FileDown className="mr-2 h-4 w-4" /> Invoice
                    </Button>
                  ) : booking.payment_status === 'pending' ? (
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/payment/${booking.id}`)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Pay Now
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/payment/${booking.id}`)}
                    >
                      Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Bookings;
