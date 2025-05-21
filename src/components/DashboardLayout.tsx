
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/ui/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
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
      title: 'Cities Explorer', 
      path: '/cities', 
      icon: MapPin, 
      description: 'Explore by city' 
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: Settings, 
      description: 'Manage your account' 
    },
  ];

  // Animation variants
  const sidebarItemVariants = {
    hover: { x: 5, transition: { type: "spring", stiffness: 300 } }
  };

  const displayName = "User";
  const initials = "U";

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-950 dark:text-white">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="w-64 border-r border-blue-100 shadow-md bg-white dark:bg-blue-900 dark:border-blue-800 z-20">
          <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-100 dark:border-blue-800">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 text-white">
              <MapPin size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-display font-bold text-lg tracking-tight text-blue-900 dark:text-white">ExploreZim</h3>
              <p className="text-xs text-blue-400 dark:text-blue-300">Discover the beauty</p>
            </div>
          </div>
          
          <div className="py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-blue-900 dark:text-blue-200 text-xs uppercase">
                Navigation
              </h2>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <TooltipProvider key={item.path}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover="hover"
                          variants={sidebarItemVariants}
                        >
                          <Link
                            to={item.path}
                            className={cn(
                              "transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-lg",
                              location.pathname === item.path 
                                ? "text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md" 
                                : "text-blue-800 dark:text-blue-200 hover:text-white hover:bg-blue-500 dark:hover:text-white dark:hover:bg-blue-600/50"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                            {location.pathname === item.path && (
                              <ChevronRight className="ml-auto h-5 w-5" />
                            )}
                          </Link>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-blue-700 text-white">
                        {item.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            
            <div className="px-3 py-2 mt-6">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-blue-900 dark:text-blue-200 text-xs uppercase">
                Support
              </h2>
              <div className="space-y-1">
                <motion.div
                  whileHover="hover"
                  variants={sidebarItemVariants}
                >
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-800 dark:text-blue-200 hover:text-white hover:bg-blue-500 dark:hover:text-white dark:hover:bg-blue-600/50 transition-colors duration-300">
                    <HelpCircle className="h-5 w-5" />
                    <span>Help & Support</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 border-t border-blue-100 dark:border-blue-800 pt-2 bg-white dark:bg-blue-900">
            <div className="mb-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-blue-100 dark:border-blue-700">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-blue-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-blue-400 dark:text-blue-300">User</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 border-blue-200 text-blue-700 dark:text-blue-200 dark:border-blue-700 hover:text-white hover:bg-blue-500 dark:hover:bg-blue-600/50 dark:hover:text-white hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300 mx-2 mb-4" 
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="ml-4 mt-4 fixed z-50">
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-100 dark:border-blue-800">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 text-white">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display font-bold text-lg tracking-tight text-blue-900 dark:text-white">ExploreZim</h3>
                <p className="text-xs text-blue-400 dark:text-blue-300">Discover the beauty</p>
              </div>
            </div>
            
            <div className="py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-xs uppercase font-semibold tracking-tight text-blue-900 dark:text-blue-200">
                  Navigation
                </h2>
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-lg",
                        location.pathname === item.path 
                          ? "text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md" 
                          : "text-blue-800 dark:text-blue-200 hover:text-white hover:bg-blue-500 dark:hover:text-white dark:hover:bg-blue-600/50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 border-t border-blue-100 dark:border-blue-800 pt-2 bg-white dark:bg-blue-900">
              <div className="mb-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-blue-100 dark:border-blue-700">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-blue-900 dark:text-white">{displayName}</p>
                    <p className="text-xs text-blue-400 dark:text-blue-300">User</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-[calc(100%-1rem)] flex items-center gap-2 border-blue-200 text-blue-700 dark:text-blue-200 dark:border-blue-700 hover:text-white hover:bg-blue-500 dark:hover:bg-blue-600/50 dark:hover:text-white hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300 mx-2 mb-4" 
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-blue-900/80 backdrop-blur-md py-4 px-6 shadow-sm border-b border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800/50 rounded-lg"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-xl font-display font-semibold text-blue-900 dark:text-white">
                  {navigationItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
                </h1>
                <p className="text-sm text-blue-400 dark:text-blue-300 hidden sm:block">
                  {navigationItems.find(item => item.path === location.pathname)?.description || 'Welcome to ExploreZim'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-800/50"
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
  );
};

export default DashboardLayout;
