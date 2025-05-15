
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from '@/models/Auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';

// Component imports
import UsersManagement from '@/components/admin/UsersManagement';
import DestinationsManagement from '@/components/admin/DestinationsManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import BookingsManagement from '@/components/admin/BookingsManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

// Icon imports
import { 
  Users, 
  MapPin, 
  Calendar, 
  BarChart2, 
  BookOpen, 
  LogOut, 
  Settings, 
  Home, 
  Moon,
  Sun,
  HelpCircle
} from 'lucide-react';

// Admin navigation items
const adminNavItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2, description: 'Dashboard overview and statistics' },
  { id: 'users', label: 'Users', icon: Users, description: 'Manage user accounts and permissions' },
  { id: 'destinations', label: 'Destinations', icon: MapPin, description: 'Manage travel destinations' },
  { id: 'events', label: 'Events', icon: Calendar, description: 'Manage events and activities' },
  { id: 'bookings', label: 'Bookings', icon: BookOpen, description: 'View and manage customer bookings' },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="rounded-full bg-gradient-to-r from-primary to-purple-500 p-1.5 text-white">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display font-bold text-lg tracking-tight">Admin Portal</h3>
                <p className="text-xs text-muted-foreground">Zimbabwe Tourism</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="pb-6">
            <div className="mb-6 px-3">
              <div className="flex items-center space-x-3 p-2 rounded-md bg-primary/10">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{fullName}</p>
                  <p className="text-xs text-muted-foreground">{profile?.role || 'Administrator'}</p>
                </div>
              </div>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              asChild
                              isActive={activeTab === item.id}
                              tooltip={item.label}
                            >
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start" 
                                onClick={() => setActiveTab(item.id)}
                              >
                                <item.icon className="mr-2 h-5 w-5" />
                                <span>{item.label}</span>
                              </Button>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.description}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <HelpCircle className="mr-2 h-5 w-5" />
                        <span>Help & Support</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t p-3">
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </Button>
              
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
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8 text-muted-foreground" />
                <h1 className="text-xl font-semibold">
                  {adminNavItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </header>

          <main className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {getTimeBasedEmoji()} 
                    <span>
                      {greeting}, {profile?.first_name || 'Admin'}
                    </span>
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Here's what's happening with your website today.
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'analytics' && <AdminAnalytics />}
              {activeTab === 'users' && <UsersManagement />}
              {activeTab === 'destinations' && <DestinationsManagement />}
              {activeTab === 'events' && <EventsManagement />}
              {activeTab === 'bookings' && <BookingsManagement />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
