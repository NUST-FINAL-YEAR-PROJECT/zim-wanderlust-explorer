
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Heart,
  User,
  HelpCircle,
  ChevronRight
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
import { motion } from 'framer-motion';

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

  // Animation variants
  const sidebarItemVariants = {
    hover: { x: 5, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-indigo-900 dark:text-white">
        <Sidebar 
          variant={isMobile ? "floating" : "sidebar"} 
          className="border-r border-indigo-100 shadow-md bg-white dark:bg-indigo-900 dark:border-indigo-800 z-20"
        >
          <SidebarHeader>
            <div className="flex items-center gap-3 px-4 py-5">
              <div className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 p-1.5 text-white">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display font-bold text-lg tracking-tight text-indigo-900 dark:text-white">ExploreZim</h3>
                <p className="text-xs text-indigo-400 dark:text-indigo-300">Discover the beauty</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="pb-6">
            <SidebarGroup>
              <SidebarGroupLabel className="font-display text-indigo-900 dark:text-indigo-200 text-xs uppercase tracking-wide">Navigation</SidebarGroupLabel>
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
                              <motion.div
                                whileHover="hover"
                                variants={sidebarItemVariants}
                              >
                                <Link to={item.path} className={cn(
                                  "transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-lg",
                                  location.pathname === item.path 
                                    ? "text-white font-medium bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-md" 
                                    : "text-indigo-700 dark:text-indigo-200 hover:text-white hover:bg-indigo-500/90 dark:hover:text-white dark:hover:bg-indigo-600/50"
                                )}>
                                  <item.icon className="h-5 w-5" />
                                  <span>{item.title}</span>
                                  {location.pathname === item.path && (
                                    <ChevronRight className="ml-auto h-5 w-5" />
                                  )}
                                </Link>
                              </motion.div>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-indigo-800 text-white">
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
              <SidebarGroupLabel className="font-display text-indigo-900 dark:text-indigo-200 text-xs uppercase tracking-wide">Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <motion.div
                        whileHover="hover"
                        variants={sidebarItemVariants}
                      >
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-700 dark:text-indigo-200 hover:text-white hover:bg-indigo-500/90 dark:hover:text-white dark:hover:bg-indigo-600/50 transition-colors duration-300">
                          <HelpCircle className="h-5 w-5" />
                          <span>Help & Support</span>
                        </a>
                      </motion.div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-indigo-100 dark:border-indigo-800 pt-2">
            <div className="mb-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-indigo-100 dark:border-indigo-700">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-indigo-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-indigo-400 dark:text-indigo-300">{profile?.role || 'User'}</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 border-indigo-200 text-indigo-700 dark:text-indigo-200 dark:border-indigo-700 hover:text-white hover:bg-indigo-500/90 dark:hover:bg-indigo-600/50 dark:hover:text-white hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors duration-300 mx-2" 
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-indigo-900/80 backdrop-blur-md py-4 px-6 shadow-sm border-b border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8 text-indigo-700 dark:text-indigo-200 hover:text-indigo-900 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-indigo-800/50 rounded-lg" />
                <div>
                  <h1 className="text-xl font-display font-semibold text-indigo-900 dark:text-white">
                    {navigationItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-indigo-400 dark:text-indigo-300 hidden sm:block">
                    {navigationItems.find(item => item.path === location.pathname)?.description || 'Welcome to ExploreZim'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10 text-indigo-700 dark:text-indigo-200 hover:text-indigo-900 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-indigo-800/50"
                  asChild
                >
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
