
import React from 'react';
import { Link, Location } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  CalendarDays, 
  Settings, 
  Heart,
  HelpCircle,
  ChevronRight,
  Shield,
  Bed
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardSidebarProps {
  isOpen: boolean;
  isMobile?: boolean;
  user: User | null;
  profile: any;
  handleSignOut: () => void;
  location: Location;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  isOpen, 
  isMobile = false,
  user, 
  profile,
  handleSignOut,
  location
}) => {
  const { isAdmin } = useAuth();

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
      title: 'Accommodations', 
      path: '/accommodations', 
      icon: Bed, 
      description: 'Find places to stay' 
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

  // Add admin dashboard for admin users
  if (isAdmin) {
    navigationItems.splice(1, 0, {
      title: 'Admin Dashboard',
      path: '/admin',
      icon: Shield,
      description: 'Admin management panel'
    });
  }

  // Animation variants
  const sidebarItemVariants = {
    hover: { x: 5, transition: { type: "spring", stiffness: 300 } }
  };

  const displayName = profile?.username || user?.email?.split('@')[0] || "User";
  const initials = displayName.substring(0, 1).toUpperCase();

  const renderAuthSection = () => {
    if (user) {
      return (
        <div className="px-2 py-3 border-t border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <Avatar className="h-8 w-8 border-2 border-blue-100 dark:border-blue-700">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-blue-900 dark:text-white">{displayName}</p>
              <p className="text-xs text-blue-400 dark:text-blue-300">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 border-blue-200 text-blue-700 dark:text-blue-200 dark:border-blue-700 hover:text-white hover:bg-blue-500 dark:hover:bg-blue-600/50 dark:hover:text-white hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300" 
            onClick={handleSignOut}
            size="sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      );
    }
    
    return (
      <div className="px-2 py-3 border-t border-blue-100 dark:border-blue-800">
        <Button 
          variant="default" 
          className="w-full flex items-center gap-2 transition-colors duration-300" 
          size="sm"
          asChild
        >
          <Link to="/auth">
            <span>Sign In</span>
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="w-64 border-r border-blue-100 shadow-md bg-white dark:bg-blue-900 dark:border-blue-800 z-20 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-100 dark:border-blue-800">
        <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 text-white">
          <MapPin size={20} />
        </div>
        <div className="flex flex-col">
          <h3 className="font-display font-bold text-lg tracking-tight text-blue-900 dark:text-white">ExploreZim</h3>
          <p className="text-xs text-blue-400 dark:text-blue-300">Discover the beauty</p>
        </div>
      </div>
      
      <div className="py-4 flex-grow overflow-y-auto">
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
      
      {/* Auth section at bottom */}
      {renderAuthSection()}
    </div>
  );
};

export default DashboardSidebar;
