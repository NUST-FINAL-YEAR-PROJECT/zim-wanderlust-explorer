
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  ResponsiveTableWrapper
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booking, BookingStatus, PaymentStatus } from '@/models/Booking';
import { MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onViewPaymentProof: (booking: Booking) => void;
  onEditBooking: (booking: Booking) => void;
  onSort: (key: string) => void;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc'
  };
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  isLoading,
  onViewPaymentProof,
  onEditBooking,
  onSort,
  sortConfig
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRowExpansion = (bookingId: string) => {
    if (expandedRow === bookingId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(bookingId);
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

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="py-8 text-center">No bookings found.</div>;
  }

  return (
    <ResponsiveTableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => onSort('booking_date')}
            >
              <div className="flex items-center gap-1">
                Date <SortIcon column="booking_date" />
              </div>
            </TableHead>
            <TableHead>Destination/Event</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('number_of_people')}
            >
              <div className="flex items-center gap-1">
                People <SortIcon column="number_of_people" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('total_price')}
            >
              <div className="flex items-center gap-1">
                Total <SortIcon column="total_price" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <React.Fragment key={booking.id}>
              <TableRow className="cursor-pointer" onClick={() => toggleRowExpansion(booking.id)}>
                <TableCell>
                  <div className="font-medium">{booking.contact_name}</div>
                  <div className="text-xs text-muted-foreground">{booking.contact_email}</div>
                </TableCell>
                <TableCell>
                  <div>{new Date(booking.booking_date).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(booking.booking_date), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{getBookingName(booking)}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin size={12} className="mr-1" /> {getBookingLocation(booking)}
                  </div>
                  <Badge variant="outline" className={
                    booking.destination_id ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                  }>
                    {getBookingType(booking)}
                  </Badge>
                </TableCell>
                <TableCell>{booking.number_of_people}</TableCell>
                <TableCell>${booking.total_price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {booking.status || 'pending'}
                    </Badge>
                    <Badge className={getPaymentStatusBadgeColor(booking.payment_status)}>
                      {booking.payment_status || 'pending'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditBooking(booking);
                      }}
                    >
                      Manage
                    </Button>
                    {booking.payment_proof_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewPaymentProof(booking);
                        }}
                      >
                        Proof
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              {expandedRow === booking.id && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-slate-50 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-sm">Contact Phone</h4>
                        <p className="text-sm">{booking.contact_phone || 'Not provided'}</p>
                      </div>
                      {booking.preferred_date && (
                        <div>
                          <h4 className="font-medium text-sm">Preferred Date</h4>
                          <div className="flex items-center text-sm">
                            <Calendar size={14} className="mr-1" /> 
                            {new Date(booking.preferred_date).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      {booking.selected_ticket_type && (
                        <div>
                          <h4 className="font-medium text-sm">Ticket Type</h4>
                          <p className="text-sm">
                            {booking.selected_ticket_type.name || 'Standard'}
                            {booking.selected_ticket_type.price && (
                              <span className="text-muted-foreground ml-2">
                                (${booking.selected_ticket_type.price} each)
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                      {booking.booking_details && Object.keys(booking.booking_details).length > 0 && (
                        <div className="col-span-2 md:col-span-3">
                          <h4 className="font-medium text-sm">Additional Details</h4>
                          <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded mt-1 overflow-auto max-h-40">
                            {JSON.stringify(booking.booking_details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </ResponsiveTableWrapper>
  );
};

export default BookingsTable;
