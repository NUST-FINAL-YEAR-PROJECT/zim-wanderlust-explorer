
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Heart,
  Hotel,
  Map,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Profile } from '@/models/Profile';

interface NavItem {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface DashboardSidebarProps {
  isMobile?: boolean;
  isOpen: boolean;
  user: SupabaseUser | null;
  profile: Profile | null;
  handleSignOut: () => Promise<void>;
  location: ReturnType<typeof useLocation>;
}

const DashboardSidebar = ({
  isMobile = false,
  isOpen,
  user,
  profile,
  handleSignOut,
  location
}: DashboardSidebarProps) => {
  const pathname = location.pathname;

  const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard', label: 'Dashboard' },
    { icon: <MapPin className="h-5 w-5" />, href: '/destinations', label: 'Destinations' },
    { icon: <Hotel className="h-5 w-5" />, href: '/accommodations', label: 'Accommodations' },
    { icon: <Calendar className="h-5 w-5" />, href: '/events', label: 'Events' },
    { icon: <CalendarDays className="h-5 w-5" />, href: '/itineraries', label: 'Itineraries' },
    { icon: <Map className="h-5 w-5" />, href: '/cities', label: 'Cities Explorer' },
    { icon: <Heart className="h-5 w-5" />, href: '/wishlist', label: 'Wishlist' },
  ];

  const bottomNavItems: NavItem[] = [
    { icon: <User className="h-5 w-5" />, href: '/settings', label: 'Profile Settings' },
  ];

  const displayName = profile?.username || user?.email?.split('@')[0] || "User";
  const initials = displayName.substring(0, 1).toUpperCase();

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 transition-all",
        isOpen ? "w-64" : "w-[70px]",
        isMobile && "w-full"
      )}
    >
      <div className="flex h-14 items-center border-b border-gray-200 px-3 dark:border-gray-800">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="/favicon.ico"
            alt="ExploreZim Logo"
            className="h-8 w-8 rounded"
          />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-display text-lg font-bold text-blue-600 dark:text-blue-400"
            >
              ExploreZim
            </motion.span>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-3">
        <nav className="space-y-1">
          <div className="py-2">
            {isOpen && (
              <div className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Main Menu
              </div>
            )}
            {navItems.map((item) => (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 mb-1",
                          pathname === item.href
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/40 dark:hover:text-blue-300"
                            : ""
                        )}
                      >
                        {item.icon}
                        {isOpen && <span>{item.label}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </nav>

        <div className="space-y-1">
          {isOpen && <div className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Settings</div>}

          {bottomNavItems.map((item) => (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 mb-1",
                        pathname === item.href
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/40 dark:hover:text-blue-300"
                          : ""
                      )}
                    >
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
          
          {user && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 mb-1 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5" />
                    {isOpen && <span>Sign Out</span>}
                  </Button>
                </TooltipTrigger>
                {!isOpen && <TooltipContent side="right">Sign Out</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          )}

          {isOpen && user && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
