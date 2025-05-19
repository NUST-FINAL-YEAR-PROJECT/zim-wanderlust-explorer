
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
  Users, 
  TrendingUp, 
  Bell, 
  ArrowRight,
  Globe, 
  List,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserBookings } from '@/models/Booking';
import { getUserNotifications, markAllNotificationsAsRead } from '@/models/Notification';
import { getUserItineraries } from '@/models/Itinerary';
import { Booking } from '@/models/Booking';
import { Notification } from '@/models/Notification';
import { Itinerary } from '@/models/Itinerary';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO, differenceInDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const [fetchedBookings, fetchedNotifications, fetchedItineraries] = await Promise.all([
            getUserBookings(user.id),
            getUserNotifications(user.id),
            getUserItineraries(user.id)
          ]);
          
          setBookings(fetchedBookings);
          setNotifications(fetchedNotifications);
          setUnreadCount(fetchedNotifications.filter(n => !n.is_read).length);
          setItineraries(fetchedItineraries);
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
      color: "bg-indigo-50 dark:bg-indigo-900/50 border-indigo-100 dark:border-indigo-700/50",
      iconClass: "text-indigo-600 dark:text-indigo-300",
    },
    {
      title: "Upcoming Trips",
      value: upcomingTrips,
      description: "Scheduled for the future",
      icon: TrendingUp,
      color: "bg-indigo-50 dark:bg-indigo-900/50 border-indigo-100 dark:border-indigo-700/50",
      iconClass: "text-indigo-600 dark:text-indigo-300",
    },
    {
      title: "Places Visited",
      value: uniqueDestinations,
      description: "Unique destinations explored",
      icon: Globe,
      color: "bg-indigo-50 dark:bg-indigo-900/50 border-indigo-100 dark:border-indigo-700/50",
      iconClass: "text-indigo-600 dark:text-indigo-300",
    },
    {
      title: "Total Travelers",
      value: totalTravelers,
      description: "People in your bookings",
      icon: Users,
      color: "bg-indigo-50 dark:bg-indigo-900/50 border-indigo-100 dark:border-indigo-700/50",
      iconClass: "text-indigo-600 dark:text-indigo-300",
    },
  ];

  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : null;

  const displayName = fullName || profile?.username || user?.email?.split('@')[0] || 'User';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting Section with Notification Bell */}
        <motion.div variants={itemVariants} className="flex justify-between items-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-900 p-6 text-white shadow-md">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {displayName}</h2>
            <p className="mt-2 text-indigo-100">Discover Zimbabwe's best destinations and events</p>
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
            <PopoverContent className="w-80 max-h-96 overflow-y-auto p-0 border-indigo-100 dark:border-indigo-700" align="end">
              <div className="flex items-center justify-between p-4 border-b border-indigo-100 dark:border-indigo-700">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleMarkNotificationsRead}
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100"
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
                        "p-4 border-b border-indigo-100 dark:border-indigo-700 last:border-0 hover:bg-indigo-50 dark:hover:bg-indigo-800/50",
                        !notification.is_read && "bg-indigo-50 dark:bg-indigo-800/50"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-indigo-900 dark:text-white">{notification.title}</h4>
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
        </motion.div>

        {/* Statistics Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.title} className={cn("dashboard-card shadow-md", card.color)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                  <div className={cn("rounded-full p-2", card.iconClass.replace("text-", "bg-").replace("600", "100").replace("indigo-300", "indigo-800/20"))}>
                    <card.icon className={cn("h-5 w-5", card.iconClass)} />
                  </div>
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-indigo-900 dark:text-white">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* My Itineraries Section */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card border-indigo-100 dark:border-indigo-700 shadow-md">
            <CardHeader className="pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-indigo-900 dark:text-white">My Itineraries</CardTitle>
                <CardDescription>Your planned travel routes</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100" 
                onClick={() => navigate('/itineraries')}
              >
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-md bg-indigo-100 dark:bg-indigo-800/50" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3 bg-indigo-100 dark:bg-indigo-800/50" />
                        <Skeleton className="h-3 w-1/4 bg-indigo-100 dark:bg-indigo-800/50" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded-md bg-indigo-100 dark:bg-indigo-800/50" />
                    </div>
                  ))}
                </div>
              ) : itineraries.length === 0 ? (
                <div className="text-center py-8">
                  <List className="mx-auto h-12 w-12 text-indigo-400 dark:text-indigo-300 mb-2" />
                  <p className="text-indigo-400 dark:text-indigo-300 mb-4">You don't have any itineraries yet</p>
                  <Button onClick={() => navigate('/itineraries/create')} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                    Create New Itinerary
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {itineraries.slice(0, 3).map((itinerary) => {
                    const totalDays = itinerary.destinations.length > 0
                      ? differenceInDays(
                          parseISO(itinerary.destinations[itinerary.destinations.length - 1].endDate),
                          parseISO(itinerary.destinations[0].startDate)
                        ) + 1
                      : 0;
                    
                    return (
                      <div 
                        key={itinerary.id} 
                        className="flex items-center justify-between p-4 rounded-lg border border-indigo-100 dark:border-indigo-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-800/20 cursor-pointer"
                        onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 dark:bg-indigo-700/50 p-2 rounded-md">
                            <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <div>
                            <h3 className="font-medium text-indigo-900 dark:text-white">{itinerary.title}</h3>
                            <p className="text-sm text-indigo-400 dark:text-indigo-300">
                              {itinerary.destinations.length > 0 ? (
                                <>
                                  {itinerary.destinations.length} {itinerary.destinations.length === 1 ? 'destination' : 'destinations'} • {totalDays} {totalDays === 1 ? 'day' : 'days'}
                                </>
                              ) : (
                                'No destinations yet'
                              )}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-indigo-400 dark:text-indigo-300" />
                      </div>
                    );
                  })}
                  
                  {itineraries.length > 3 && (
                    <div className="text-center mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/itineraries')}
                        className="border-indigo-200 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:text-white dark:hover:bg-indigo-800/50"
                      >
                        View All Itineraries
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {itineraries.length > 0 && itineraries.length <= 3 && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/itineraries/create')}
                    className="border-indigo-200 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:text-white dark:hover:bg-indigo-800/50"
                  >
                    Create New Itinerary
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Bookings Table */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card border-indigo-100 dark:border-indigo-700 shadow-md">
            <CardHeader className="pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-indigo-900 dark:text-white">Recent Bookings</CardTitle>
                <CardDescription>Your recent travel activities</CardDescription>
              </div>
              {bookings.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100" 
                  onClick={() => navigate('/bookings')}
                >
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-md bg-indigo-100 dark:bg-indigo-800/50" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3 bg-indigo-100 dark:bg-indigo-800/50" />
                        <Skeleton className="h-3 w-1/4 bg-indigo-100 dark:bg-indigo-800/50" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded-md bg-indigo-100 dark:bg-indigo-800/50" />
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-indigo-400 dark:text-indigo-300 mb-2" />
                  <p className="text-indigo-400 dark:text-indigo-300 mb-4">You don't have any bookings yet</p>
                  <Button onClick={() => navigate('/destinations')} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                    Explore Destinations
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden border border-indigo-100 dark:border-indigo-700/50">
                  <Table>
                    <TableHeader className="bg-indigo-50 dark:bg-indigo-800/30">
                      <TableRow className="hover:bg-indigo-100/50 dark:hover:bg-indigo-800/50">
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
                          className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-800/20"
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                        >
                          <TableCell className="text-indigo-700 dark:text-indigo-200">
                            {booking.booking_date && format(new Date(booking.booking_date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-indigo-900 dark:text-white">
                              {booking.booking_details?.destinationName || 
                               booking.booking_details?.eventName || 
                               "Booking"}
                            </div>
                          </TableCell>
                          <TableCell className="text-indigo-700 dark:text-indigo-200">{booking.number_of_people}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "dashboard-badge",
                              booking.status === 'confirmed' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
                              booking.status === 'pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
                              booking.status === 'cancelled' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
                              booking.status === 'completed' && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
                            )}>
                              {booking.status && booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium text-indigo-900 dark:text-white">
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
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/bookings')}
                    className="border-indigo-200 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:text-white dark:hover:bg-indigo-800/50"
                  >
                    View All Bookings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="dashboard-card shadow-md border-indigo-100 hover:shadow-lg transition-all duration-300 dark:border-indigo-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-indigo-900 dark:text-white">Explore Destinations</CardTitle>
                <div className="bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-300 p-2 rounded-full">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
              <CardDescription>Find your next adventure</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-indigo-500 dark:text-indigo-300 mb-4">
                Discover Zimbabwe's most beautiful locations and plan your perfect trip.
              </p>
              <Button 
                onClick={() => navigate('/destinations')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white"
              >
                View Destinations
              </Button>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card shadow-md border-indigo-100 hover:shadow-lg transition-all duration-300 dark:border-indigo-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-indigo-900 dark:text-white">Upcoming Events</CardTitle>
                <div className="bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-300 p-2 rounded-full">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
              <CardDescription>Experience local culture</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-indigo-500 dark:text-indigo-300 mb-4">
                Don't miss out on exciting festivals, exhibitions and cultural events.
              </p>
              <Button 
                onClick={() => navigate('/events')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white"
              >
                View Events
              </Button>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card shadow-md border-indigo-100 hover:shadow-lg transition-all duration-300 dark:border-indigo-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-indigo-900 dark:text-white">My Wishlist</CardTitle>
                <div className="bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-300 p-2 rounded-full">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
              <CardDescription>Save for later</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-indigo-500 dark:text-indigo-300 mb-4">
                Keep track of destinations and events you want to experience in the future.
              </p>
              <Button 
                onClick={() => navigate('/wishlist')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white"
              >
                View Wishlist
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Section */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card relative overflow-hidden border-0 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-indigo-800/90 dark:from-indigo-700/90 dark:to-indigo-900/90 z-0"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin-slow" /> Featured: Victoria Falls Experience
                  </h3>
                  <p className="mt-2 text-indigo-100 max-w-xl">
                    Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World.
                    Book now and get a special 15% discount on guided tours!
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/destination/victoria-falls')}
                  className="bg-white text-indigo-700 hover:bg-white/90 dark:bg-indigo-50 dark:hover:bg-indigo-100 dark:text-indigo-800"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
