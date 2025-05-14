
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
import { 
  Users, 
  MapPin, 
  Calendar, 
  BarChart2, 
  BookOpen, 
  LogOut, 
  Bell, 
  Settings, 
  Home, 
  Menu,
  Search,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/models/Auth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen admin-layout">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}>
      </div>
      
      <div className={`fixed top-0 left-0 h-full w-64 bg-[hsl(var(--admin-card))] z-50 transform transition-transform duration-300 shadow-xl lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-[hsl(var(--admin-border))]">
          <div className="flex items-center space-x-3">
            <div className="rounded-full admin-gradient p-2 text-white">
              <MapPin size={18} />
            </div>
            <h2 className="font-bold text-lg">Zimbabwe Tourism</h2>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('analytics'); toggleSidebar(); }}>
                <BarChart2 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('users'); toggleSidebar(); }}>
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('destinations'); toggleSidebar(); }}>
                <MapPin className="mr-2 h-4 w-4" />
                Destinations
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('events'); toggleSidebar(); }}>
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveTab('bookings'); toggleSidebar(); }}>
                <BookOpen className="mr-2 h-4 w-4" />
                Bookings
              </Button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-[hsl(var(--admin-border))]">
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Top Navigation Bar */}
      <header className="admin-header sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                <Menu size={20} />
              </Button>
              <div className="rounded-full admin-gradient p-1.5 text-white">
                <MapPin size={20} />
              </div>
              <h1 className="text-xl font-semibold hidden sm:inline-block">Zimbabwe Tourism Admin</h1>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-[hsl(var(--admin-fg))]">
                  <Search size={20} />
                </Button>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-[hsl(var(--admin-fg))]">
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="relative">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[hsl(var(--admin-fg))]">
                        <Bell size={20} />
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[hsl(var(--admin-highlight))]">
                          <span className="text-xs">3</span>
                        </Badge>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-[hsl(var(--admin-fg))]" onClick={() => navigate('/')}>
                      <Home size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go to homepage</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-[hsl(var(--admin-muted))]">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="admin-gradient text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-block">{fullName}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))]">
                      <ul className="grid w-[200px] gap-1 p-2">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full flex-col justify-end rounded-md admin-gradient p-4 no-underline outline-none focus:shadow-md"
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
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(var(--admin-muted))] focus:bg-[hsl(var(--admin-muted))]"
                              href="/settings"
                            >
                              <div className="text-sm font-medium leading-none flex items-center gap-2 text-[hsl(var(--admin-fg))]">
                                <Settings size={16} />
                                Settings
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--admin-muted))]"
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
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getTimeBasedEmoji()} Admin Dashboard
              </h1>
              <p className="text-[hsl(var(--admin-muted-fg))]">
                {greeting}, {profile?.first_name || 'Admin'}. Here's what's happening with your website today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <div className="text-sm text-[hsl(var(--admin-muted-fg))]">Last updated</div>
              <div className="font-medium">{new Date().toLocaleString()}</div>
            </div>
          </div>
          
          <Card className="admin-card border-l-4 border-l-[hsl(var(--admin-highlight))] mt-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <span className="text-lg">👋</span>
                <p className="text-sm">
                  Welcome to your personalized admin dashboard. Manage your content, track analytics, and handle bookings all from this central location.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
          
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="admin-header sticky top-16 z-20 shadow-sm rounded-lg">
            <TabsList className="admin-tabs grid w-full grid-cols-2 sm:grid-cols-5">
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 py-3 data-[state=active]:admin-tab-active"
              >
                <BarChart2 size={18} />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center gap-2 py-3 data-[state=active]:admin-tab-active"
              >
                <Users size={18} />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger 
                value="destinations" 
                className="flex items-center gap-2 py-3 data-[state=active]:admin-tab-active"
              >
                <MapPin size={18} />
                <span className="hidden sm:inline">Destinations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="flex items-center gap-2 py-3 data-[state=active]:admin-tab-active"
              >
                <Calendar size={18} />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="flex items-center gap-2 py-3 data-[state=active]:admin-tab-active"
              >
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
