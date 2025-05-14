
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Menu, 
  Bookmark,
  Heart,
  User,
  HelpCircle
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      description: 'Overview of your activity' 
    },
    { 
      title: 'My Bookings', 
      path: '/bookings', 
      icon: Calendar, 
      description: 'View and manage bookings' 
    },
    { 
      title: 'Destinations', 
      path: '/destinations', 
      icon: MapPin, 
      description: 'Explore travel destinations' 
    },
    { 
      title: 'Events', 
      path: '/events', 
      icon: CalendarDays, 
      description: 'Upcoming local events' 
    },
    { 
      title: 'Wishlist', 
      path: '/wishlist', 
      icon: Heart, 
      description: 'Places you want to visit' 
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: Settings, 
      description: 'Manage your account' 
    },
  ];

  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : null;

  const displayName = fullName || profile?.username || user?.email?.split('@')[0] || 'User';
  
  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : profile?.username 
      ? profile.username.substring(0, 2).toUpperCase()
      : user?.email 
        ? user.email.substring(0, 2).toUpperCase() 
        : 'U';

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-white">
        <Sidebar className="border-r border-[#D0A676]/20">
          <SidebarHeader>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="rounded-full bg-[#8B5E34] p-1.5 text-white">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-lg tracking-tight text-[#8B5E34]">Zimbabwe Tourism</h3>
                <p className="text-xs text-[#8B5E34]/70">Discover the beauty</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="pb-6">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[#8B5E34]/70">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              asChild
                              isActive={location.pathname === item.path}
                              tooltip={item.title}
                            >
                              <Link to={item.path} className={cn(
                                "transition-colors",
                                location.pathname === item.path 
                                  ? "text-[#8B5E34] font-medium" 
                                  : "text-[#8B5E34]/70 hover:text-[#8B5E34]"
                              )}>
                                <item.icon className="dashboard-icon" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-[#8B5E34] text-white">
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
              <SidebarGroupLabel className="text-[#8B5E34]/70">Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="text-[#8B5E34]/70 hover:text-[#8B5E34]">
                        <HelpCircle className="dashboard-icon" />
                        <span>Help & Support</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-[#D0A676]/20 pt-2">
            <div className="mb-3 px-3 py-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-[#F4EBE2] text-[#8B5E34]">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-[#8B5E34]">{displayName}</p>
                  <p className="text-xs text-[#8B5E34]/70">{profile?.role || 'User'}</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 text-[#8B5E34] border-[#8B5E34]/40 hover:bg-[#F4EBE2]" 
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 border-b border-[#D0A676]/20 bg-white/80 backdrop-blur-md py-3 px-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8 text-[#8B5E34]" />
                <div>
                  <h1 className="text-xl font-semibold text-[#8B5E34]">
                    {navigationItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-[#8B5E34]/70 hidden sm:block">
                    {navigationItems.find(item => item.path === location.pathname)?.description || 'Welcome to Zimbabwe Tourism'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="text-[#8B5E34] hover:bg-[#F4EBE2]">
                  <Link to="/settings">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
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
