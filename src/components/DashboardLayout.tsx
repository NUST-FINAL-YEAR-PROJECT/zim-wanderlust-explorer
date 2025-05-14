
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, MapPin, CalendarDays, Settings } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/models/Auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    { title: 'Settings', path: '/profile', icon: Settings },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex flex-col">
                <h3 className="font-bold text-lg">Zimbabwe Tourism</h3>
                <p className="text-xs text-muted-foreground">
                  Welcome, {profile?.username || user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
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
                        <Link to={item.path}>
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
          <SidebarFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto p-6">
          <SidebarTrigger className="mb-4" />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
