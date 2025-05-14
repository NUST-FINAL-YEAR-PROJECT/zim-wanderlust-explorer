
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
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
import { useNavigate, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  NavigationMenuLink
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Admin navigation items
  const adminNavItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
  ];

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-fg))]">
      {/* Desktop sidebar */}
      <div className="fixed left-0 top-0 hidden h-full w-64 border-r border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-card))] shadow-md lg:block">
        <div className="p-4 border-b border-[hsl(var(--admin-border))]">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gradient-to-r from-[hsl(var(--admin-primary))] to-[hsl(var(--admin-accent))] p-2 text-white">
              <MapPin size={18} />
            </div>
            <h2 className="font-bold text-lg">Admin Portal</h2>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4 p-2 rounded-md bg-[hsl(var(--admin-primary))] bg-opacity-10">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-[hsl(var(--admin-primary))] text-white">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{fullName}</p>
                <p className="text-xs text-[hsl(var(--admin-muted-fg))]">{profile?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
          
          <nav>
            <ul className="space-y-1">
              {adminNavItems.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left px-3 py-2 ${
                      activeTab === item.id 
                        ? 'bg-[hsl(var(--admin-primary))] text-white' 
                        : 'hover:bg-[hsl(var(--admin-secondary))]'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-[hsl(var(--admin-border))]">
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={toggleMobileMenu}
      />

      {/* Mobile sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-[hsl(var(--admin-card))] z-50 transform transition-transform duration-300 shadow-xl lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-[hsl(var(--admin-border))]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-gradient-to-r from-[hsl(var(--admin-primary))] to-[hsl(var(--admin-accent))] p-2 text-white">
                <MapPin size={18} />
              </div>
              <h2 className="font-bold text-lg">Admin Portal</h2>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleMobileMenu}>
              <span className="sr-only">Close menu</span>
              <svg 
                width="15" 
                height="15" 
                viewBox="0 0 15 15" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path 
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" 
                  fill="currentColor" 
                  fillRule="evenodd" 
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4 p-2 rounded-md bg-[hsl(var(--admin-primary))] bg-opacity-10">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-[hsl(var(--admin-primary))] text-white">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{fullName}</p>
                <p className="text-xs text-[hsl(var(--admin-muted-fg))]">{profile?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
          
          <nav>
            <ul className="space-y-1">
              {adminNavItems.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left px-3 py-2 ${
                      activeTab === item.id 
                        ? 'bg-[hsl(var(--admin-primary))] text-white' 
                        : 'hover:bg-[hsl(var(--admin-secondary))]'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      toggleMobileMenu();
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-8 space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/settings" onClick={toggleMobileMenu}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-card))] shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:pl-64">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="lg:hidden">
              <Menu size={20} />
            </Button>
            <h1 className="text-xl font-semibold hidden sm:inline-block">Admin Dashboard</h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Search size={20} />
              </Button>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
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
                    <Button variant="ghost" size="icon">
                      <Bell size={20} />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[hsl(var(--admin-primary))]">
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
                  <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
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
                  <NavigationMenuTrigger className="bg-transparent hover:bg-[hsl(var(--admin-secondary))]">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-[hsl(var(--admin-primary))] to-[hsl(var(--admin-accent))] text-white">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">{fullName}</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))]">
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-r from-[hsl(var(--admin-primary))] to-[hsl(var(--admin-accent))] p-4 no-underline outline-none focus:shadow-md"
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
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(var(--admin-secondary))] focus:bg-[hsl(var(--admin-secondary))]"
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
                          className="w-full justify-start text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--admin-secondary))]"
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
      </header>

      <main className="lg:pl-64 pt-4">
        <div className="container mx-auto px-4 py-6">
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
            
            <Card className="border-l-4 border-l-[hsl(var(--admin-primary))] bg-[hsl(var(--admin-card))] text-[hsl(var(--admin-card-fg))] mt-6">
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
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="sticky top-16 z-20 shadow-sm rounded-lg bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))]">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                {adminNavItems.map((item) => (
                  <TabsTrigger 
                    key={item.id}
                    value={item.id} 
                    className="flex items-center gap-2 py-3 data-[state=active]:bg-[hsl(var(--admin-primary))] data-[state=active]:text-white"
                  >
                    <item.icon size={18} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                ))}
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
