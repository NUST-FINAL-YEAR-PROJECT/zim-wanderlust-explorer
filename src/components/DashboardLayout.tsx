
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, MapPin, CalendarDays, Settings, LogOut, Menu } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/models/Auth';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const navigationItems = [
    { title: 'Home', path: '/dashboard', icon: Home },
    { title: 'My Bookings', path: '/bookings', icon: Calendar },
    { title: 'Destinations', path: '/destinations', icon: MapPin },
    { title: 'Events', path: '/events', icon: CalendarDays },
    { title: 'Settings', path: '/settings', icon: Settings }, // Updated path from /profile to /settings
  ];

  const initials = profile?.username 
    ? profile.username.substring(0, 2).toUpperCase()
    : user?.email 
      ? user.email.substring(0, 2).toUpperCase() 
      : 'U';

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar variant={isMobile ? "floating" : "sidebar"}>
          <SidebarHeader>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="rounded-full bg-purple-700 p-1.5 text-white">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-lg tracking-tight">Zimbabwe Tourism</h3>
                <p className="text-xs text-muted-foreground">Discover the beauty</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="pb-6">
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                        tooltip={item.title}
                      >
                        <Link to={item.path} className={cn(
                          "transition-colors",
                          location.pathname === item.path 
                            ? "text-purple-700" 
                            : "text-gray-600 hover:text-purple-600"
                        )}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t pt-2">
            <div className="mb-3 px-3 py-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-purple-100 text-purple-700">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{profile?.username || user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-muted-foreground">{profile?.role || 'User'}</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 text-gray-600" 
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md py-3 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8" />
                <h1 className="text-xl font-semibold">
                  {navigationItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
                </h1>
              </div>
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
