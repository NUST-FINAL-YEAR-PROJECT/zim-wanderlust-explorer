
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
  Plus,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserBookings } from '@/models/Booking';
import { getUserNotifications, markAllNotificationsAsRead } from '@/models/Notification';
import { getUserItineraries } from '@/models/Itinerary';
import { Booking } from '@/models/Booking';
import { Notification } from '@/models/Notification';
import { Itinerary } from '@/models/Itinerary';
import { Button } from '@/components/ui/button';
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
  
  const uniqueDestinations = new Set(
    bookings
      .filter(b => b.status === 'completed')
      .map(b => b.destination_id)
      .filter(Boolean)
  ).size;
  
  const totalTravelers = bookings.reduce((sum, booking) => sum + booking.number_of_people, 0);

  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : null;

  const displayName = fullName || profile?.username || user?.email?.split('@')[0] || 'User';

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
        className="space-y-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900 dark:text-white mb-2">
              Welcome back, {displayName}
            </h1>
            <p className="text-indigo-600 dark:text-indigo-300">
              Here's what's happening with your travels today
            </p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-64 overflow-y-auto p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkNotificationsRead}>
                    Mark all read
                  </Button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-3 border-b last:border-0 hover:bg-muted/50",
                        !notification.is_read && "bg-blue-50 dark:bg-blue-900/20"
                      )}
                    >
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 border-blue-100 dark:border-blue-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Bookings</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-white">{totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 border-green-100 dark:border-green-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-300">Upcoming Trips</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-white">{upcomingTrips}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/50 dark:to-violet-900/50 border-purple-100 dark:border-purple-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Places Visited</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-white">{uniqueDestinations}</p>
                </div>
                <Globe className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/50 dark:to-amber-900/50 border-orange-100 dark:border-orange-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-300">Total Travelers</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-white">{totalTravelers}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-300" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Bookings</CardTitle>
                    <CardDescription>Your latest travel activities</CardDescription>
                  </div>
                  {bookings.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')}>
                      <Eye className="h-4 w-4 mr-1" />
                      View All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded" />
                      </div>
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No bookings yet</p>
                    <Button onClick={() => navigate('/destinations')} size="sm">
                      Explore Destinations
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookings.slice(0, 4).map((booking) => (
                      <div 
                        key={booking.id} 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/bookings`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md">
                            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {booking.booking_details?.destinationName || 
                               booking.booking_details?.eventName || 
                               "Booking"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.booking_date && format(new Date(booking.booking_date), 'MMM d, yyyy')} • {booking.number_of_people} people
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            booking.status === 'confirmed' && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
                            booking.status === 'pending' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
                            booking.status === 'cancelled' && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
                            booking.status === 'completed' && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
                          )}>
                            {booking.status && booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <p className="text-sm font-medium mt-1">${booking.total_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Itineraries */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">My Itineraries</CardTitle>
                    <CardDescription>Your planned travel routes</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/itineraries')}>
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : itineraries.length === 0 ? (
                  <div className="text-center py-6">
                    <List className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">No itineraries yet</p>
                    <Button onClick={() => navigate('/itineraries/create')} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Create Itinerary
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
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-md">
                              <List className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{itinerary.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {itinerary.destinations.length} destinations • {totalDays} days
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Get started with your next adventure</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Button 
                  onClick={() => navigate('/destinations')} 
                  className="w-full justify-start h-auto p-3"
                  variant="ghost"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Explore Destinations</p>
                      <p className="text-xs text-muted-foreground">Find your next adventure</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>

                <Button 
                  onClick={() => navigate('/events')} 
                  className="w-full justify-start h-auto p-3"
                  variant="ghost"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-md">
                      <CalendarDays className="h-4 w-4 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Upcoming Events</p>
                      <p className="text-xs text-muted-foreground">Experience local culture</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>

                <Button 
                  onClick={() => navigate('/wishlist')} 
                  className="w-full justify-start h-auto p-3"
                  variant="ghost"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 dark:bg-pink-900/50 p-2 rounded-md">
                      <Heart className="h-4 w-4 text-pink-600 dark:text-pink-300" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">My Wishlist</p>
                      <p className="text-xs text-muted-foreground">Save for later</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>

                <Button 
                  onClick={() => navigate('/itineraries/create')} 
                  className="w-full justify-start h-auto p-3"
                  variant="ghost"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-md">
                      <Plus className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Plan Itinerary</p>
                      <p className="text-xs text-muted-foreground">Create your trip</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            {/* Featured Destination */}
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">Featured Destination</h3>
                    <p className="text-indigo-100 text-sm">Victoria Falls Experience</p>
                  </div>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World.
                  </p>
                  <Button 
                    onClick={() => navigate('/destination/victoria-falls')}
                    className="w-full bg-white text-indigo-600 hover:bg-indigo-50"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
