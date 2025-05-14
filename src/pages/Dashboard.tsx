
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Calendar, 
  MapPin, 
  CalendarDays, 
  Heart, 
  UserIcon, 
  Users, 
  TrendingUp, 
  Bell, 
  ArrowRight,
  Globe, 
  Star,
  Sparkles
} from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';

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
      color: "bg-blue-50 border-blue-100",
      iconClass: "text-blue-600",
    },
    {
      title: "Upcoming Trips",
      value: upcomingTrips,
      description: "Scheduled for the future",
      icon: TrendingUp,
      color: "bg-green-50 border-green-100",
      iconClass: "text-green-600",
    },
    {
      title: "Places Visited",
      value: uniqueDestinations,
      description: "Unique destinations explored",
      icon: Globe,
      color: "bg-amber-50 border-amber-100",
      iconClass: "text-amber-600",
    },
    {
      title: "Total Travelers",
      value: totalTravelers,
      description: "People in your bookings",
      icon: Users,
      color: "bg-purple-50 border-purple-100",
      iconClass: "text-purple-600",
    },
  ];

  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : null;

  const displayName = fullName || profile?.username || user?.email?.split('@')[0] || 'User';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Greeting Section with Notification Bell */}
        <div className="flex justify-between items-center rounded-xl gradient-purple p-6 text-white shadow-md">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {displayName}</h2>
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
            <Card key={card.title} className={cn("dashboard-stat-card", card.color)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                  <div className={cn("rounded-full p-2", card.iconClass.replace("text-", "bg-").replace("600", "100"))}>
                    <card.icon className={cn("h-5 w-5", card.iconClass)} />
                  </div>
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
        <Card className="dashboard-card">
          <CardHeader className="pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Bookings</CardTitle>
              <CardDescription>Your recent travel activities</CardDescription>
            </div>
            {bookings.length > 0 && (
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/bookings')}>
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">You don't have any bookings yet</p>
                <Button onClick={() => navigate('/destinations')}>
                  Explore Destinations
                </Button>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border">
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
                          <div className="font-medium">
                            {booking.booking_details?.destinationName || 
                             booking.booking_details?.eventName || 
                             "Booking"}
                          </div>
                        </TableCell>
                        <TableCell>{booking.number_of_people}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "dashboard-badge",
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
          <Card className="dashboard-action-card border-green-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Explore Destinations</CardTitle>
                <div className="bg-green-100 text-green-600 p-2 rounded-full">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
              <CardDescription>Find your next adventure</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-muted-foreground mb-4">
                Discover Zimbabwe's most beautiful locations and plan your perfect trip.
              </p>
              <Button 
                onClick={() => navigate('/destinations')} 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                View Destinations
              </Button>
            </CardContent>
          </Card>
          
          <Card className="dashboard-action-card border-amber-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
                <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
              <CardDescription>Experience local culture</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-muted-foreground mb-4">
                Don't miss out on exciting festivals, exhibitions and cultural events.
              </p>
              <Button 
                onClick={() => navigate('/events')} 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                View Events
              </Button>
            </CardContent>
          </Card>
          
          <Card className="dashboard-action-card border-purple-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">My Wishlist</CardTitle>
                <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
              <CardDescription>Save for later</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-muted-foreground mb-4">
                Keep track of destinations and events you want to experience in the future.
              </p>
              <Button 
                onClick={() => navigate('/wishlist')} 
                className="w-full gradient-purple hover:opacity-90 text-white"
              >
                View Wishlist
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Section */}
        <Card className="dashboard-card relative overflow-hidden border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90 z-0"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5" /> Featured: Victoria Falls Experience
                </h3>
                <p className="mt-2 text-white/80 max-w-xl">
                  Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World.
                  Book now and get a special 15% discount on guided tours!
                </p>
              </div>
              <Button 
                onClick={() => navigate('/destination/victoria-falls')}
                className="bg-white text-purple-700 hover:bg-white/90"
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
