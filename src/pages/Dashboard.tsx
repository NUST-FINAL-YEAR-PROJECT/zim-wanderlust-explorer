
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, MapPin, CalendarDays, BookmarkIcon, UserIcon, Users, TrendingUp, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserBookings } from '@/models/Booking';
import { getUserNotifications, markAllNotificationsAsRead } from '@/models/Notification';
import { Booking } from '@/models/Booking';
import { Notification } from '@/models/Notification';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const [fetchedBookings, fetchedNotifications] = await Promise.all([
            getUserBookings(user.id),
            getUserNotifications(user.id)
          ]);
          
          setBookings(fetchedBookings);
          setNotifications(fetchedNotifications);
          setUnreadCount(fetchedNotifications.filter(n => !n.is_read).length);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Error",
            description: "Failed to load your dashboard data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, toast]);

  const handleMarkNotificationsRead = async () => {
    if (user && unreadCount > 0) {
      try {
        const success = await markAllNotificationsAsRead(user.id);
        if (success) {
          setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
          setUnreadCount(0);
          toast({
            description: "All notifications marked as read",
          });
        }
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  // Calculate statistics from bookings
  const totalBookings = bookings.length;
  const upcomingTrips = bookings.filter(b => 
    b.status !== 'cancelled' && 
    b.preferred_date && 
    new Date(b.preferred_date) > new Date()
  ).length;
  
  // Count unique destinations visited
  const uniqueDestinations = new Set(
    bookings
      .filter(b => b.status === 'completed')
      .map(b => b.destination_id)
      .filter(Boolean)
  ).size;
  
  // Count total travelers
  const totalTravelers = bookings.reduce((sum, booking) => sum + booking.number_of_people, 0);

  // Define stat cards
  const statCards = [
    {
      title: "Total Bookings",
      value: totalBookings,
      description: "Across all destinations",
      icon: Calendar,
      color: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconClass: "text-blue-600",
    },
    {
      title: "Upcoming Trips",
      value: upcomingTrips,
      description: "Scheduled for the future",
      icon: TrendingUp,
      color: "bg-gradient-to-br from-green-50 to-green-100",
      iconClass: "text-green-600",
    },
    {
      title: "Destinations Visited",
      value: uniqueDestinations,
      description: "Unique places explored",
      icon: MapPin,
      color: "bg-gradient-to-br from-amber-50 to-amber-100",
      iconClass: "text-amber-600",
    },
    {
      title: "Total Travelers",
      value: totalTravelers,
      description: "People in your bookings",
      icon: Users,
      color: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconClass: "text-purple-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Greeting Section with Notification Bell */}
        <div className="flex justify-between items-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {profile?.username || user?.email?.split('@')[0]}</h2>
            <p className="mt-2 text-purple-100">Discover Zimbabwe's best destinations and events</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative p-2 rounded-full hover:bg-white/10">
                <Bell className="h-6 w-6 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-96 overflow-y-auto p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleMarkNotificationsRead}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-4 border-b last:border-0 hover:bg-gray-50",
                        !notification.is_read && "bg-blue-50"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.created_at && 
                            format(new Date(notification.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.title} className={cn("overflow-hidden transition-all hover:shadow-md", card.color)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                  <card.icon className={cn("h-5 w-5", card.iconClass)} />
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your booking history</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading your bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any bookings yet</p>
                <Button onClick={() => navigate('/destinations')}>
                  Explore Destinations
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Destination/Event</TableHead>
                      <TableHead>People</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 5).map((booking) => (
                      <TableRow 
                        key={booking.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                      >
                        <TableCell>
                          {booking.booking_date && format(new Date(booking.booking_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {booking.booking_details?.destinationName || 
                           booking.booking_details?.eventName || 
                           "Booking"}
                        </TableCell>
                        <TableCell>{booking.number_of_people}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            booking.status === 'confirmed' && "bg-green-100 text-green-800",
                            booking.status === 'pending' && "bg-yellow-100 text-yellow-800",
                            booking.status === 'cancelled' && "bg-red-100 text-red-800",
                            booking.status === 'completed' && "bg-blue-100 text-blue-800",
                          )}>
                            {booking.status && booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${booking.total_price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {bookings.length > 5 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={() => navigate('/bookings')}>
                  View All Bookings
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden transition-all hover:shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Explore Destinations</CardTitle>
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <CardDescription>Discover new places to visit</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button 
                onClick={() => navigate('/destinations')} 
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
              >
                View Destinations
              </Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden transition-all hover:shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
                <CalendarDays className="h-5 w-5 text-amber-600" />
              </div>
              <CardDescription>Check out what's happening</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button 
                onClick={() => navigate('/events')} 
                className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                View Events
              </Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden transition-all hover:shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">My Wishlist</CardTitle>
                <BookmarkIcon className="h-5 w-5 text-pink-600" />
              </div>
              <CardDescription>Places you want to visit</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button 
                onClick={() => navigate('/wishlist')} 
                className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                View Wishlist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
