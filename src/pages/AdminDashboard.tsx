
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import UsersManagement from '@/components/admin/UsersManagement';
import DestinationsManagement from '@/components/admin/DestinationsManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import BookingsManagement from '@/components/admin/BookingsManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { Users, MapPin, Calendar, BarChart2, BookOpen, LogOut, Bell, Settings, Home, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/models/Auth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let greetingText = '';
      let timeText = '';
      
      if (hour < 12) {
        greetingText = 'Good morning';
        timeText = 'morning';
      } else if (hour < 18) {
        greetingText = 'Good afternoon';
        timeText = 'afternoon';
      } else {
        greetingText = 'Good evening';
        timeText = 'evening';
      }
      
      setGreeting(greetingText);
      setTimeOfDay(timeText);
    };
    
    updateGreeting();
    
    // Update greeting every hour
    const interval = setInterval(updateGreeting, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getTimeBasedEmoji = () => {
    switch (timeOfDay) {
      case 'morning':
        return '☀️';
      case 'afternoon':
        return '🌤️';
      case 'evening':
        return '🌙';
      default:
        return '👋';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile?.username || user?.email?.split('@')[0] || 'Admin';

  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : profile?.username 
      ? profile.username.substring(0, 2).toUpperCase()
      : user?.email 
        ? user.email.substring(0, 2).toUpperCase() 
        : 'A';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-purple-500 p-1.5 text-white">
                <MapPin size={20} />
              </div>
              <h1 className="text-xl font-semibold">Zimbabwe Tourism Admin</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Home size={20} />
              </Button>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="bg-purple-200 text-purple-700">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-block">{fullName}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-1 p-2">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-indigo-700 p-4 no-underline outline-none focus:shadow-md"
                              href="/settings"
                            >
                              <div className="mt-4 mb-2 text-lg font-medium text-white">
                                {fullName}
                              </div>
                              <p className="text-sm text-white/80">
                                {profile?.role || 'Administrator'}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href="/settings"
                            >
                              <div className="text-sm font-medium leading-none flex items-center gap-2">
                                <Settings size={16} />
                                Settings
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleSignOut}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getTimeBasedEmoji()} Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                {greeting}, {profile?.first_name || 'Admin'}. Here's what's happening with your website today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="text-sm text-gray-500">Last updated</div>
              <div className="text-gray-800 font-medium">{new Date().toLocaleString()}</div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-blue-700">
              <span className="text-lg">👋</span>
              <p className="text-sm">
                Welcome to your personalized admin dashboard. Manage your content, track analytics, and handle bookings all from this central location.
              </p>
            </div>
          </div>
        </div>
          
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white p-2 rounded-lg shadow-sm sticky top-16 z-10">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 rounded-md">
              <TabsTrigger value="analytics" className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <BarChart2 size={18} />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Users size={18} />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="destinations" className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <MapPin size={18} />
                <span className="hidden sm:inline">Destinations</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Calendar size={18} />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <BookOpen size={18} />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="analytics" className="border-none p-0 mt-6">
            <AdminAnalytics />
          </TabsContent>
          
          <TabsContent value="users" className="border-none p-0 mt-6">
            <UsersManagement />
          </TabsContent>
          
          <TabsContent value="destinations" className="border-none p-0 mt-6">
            <DestinationsManagement />
          </TabsContent>
          
          <TabsContent value="events" className="border-none p-0 mt-6">
            <EventsManagement />
          </TabsContent>
          
          <TabsContent value="bookings" className="border-none p-0 mt-6">
            <BookingsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
