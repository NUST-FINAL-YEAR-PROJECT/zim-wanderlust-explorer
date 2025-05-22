
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
  ChevronRight,
  LogIn,
  BedDouble,
  ListChecks,
  FileText,
  Route,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/models/Auth';
import DashboardSidebar from './dashboard/DashboardSidebar';
import DashboardHeader from './dashboard/DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
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
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const displayName = profile?.username || user?.email?.split('@')[0] || "User";
  const initials = displayName.substring(0, 1).toUpperCase();

  const navLinks = [
    { href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, title: 'Dashboard' },
    { href: '/destinations', icon: <MapPin className="h-5 w-5" />, title: 'Destinations' },
    { href: '/accommodations', icon: <BedDouble className="h-5 w-5" />, title: 'Accommodations' },
    { href: '/events', icon: <Calendar className="h-5 w-5" />, title: 'Events' },
    { href: '/bookings', icon: <ListChecks className="h-5 w-5" />, title: 'Bookings' },
    { href: '/invoice', icon: <FileText className="h-5 w-5" />, title: 'Invoices' },
    { href: '/itineraries', icon: <Route className="h-5 w-5" />, title: 'Itineraries' },
    { href: '/cities', icon: <Globe className="h-5 w-5" />, title: 'Cities Explorer' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-950 dark:text-white">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className={cn(
          "fixed inset-y-0 left-0 z-10 w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-64"
        )}>
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-6 border-b border-gray-100 dark:border-gray-800">
              <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="font-bold text-xl text-blue-900 dark:text-blue-50">Travel Zimbabwe</h1>
            </div>
            
            <div className="flex-1 py-6 px-4 overflow-y-auto">
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive 
                          ? "bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                      )}
                    >
                      <span className={cn("p-1 rounded-md", isActive ? "bg-blue-200 dark:bg-blue-700/40" : "")}>
                        {link.icon}
                      </span>
                      <span>{link.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-3 p-2">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>
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
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 p-6 border-b border-gray-100 dark:border-gray-800">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="font-bold text-xl text-blue-900 dark:text-blue-50">Travel Zimbabwe</h1>
              </div>
              
              <div className="flex-1 py-6 px-4 overflow-y-auto">
                <nav className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          isActive 
                            ? "bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300" 
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                        )}
                      >
                        <span className={cn("p-1 rounded-md", isActive ? "bg-blue-200 dark:bg-blue-700/40" : "")}>
                          {link.icon}
                        </span>
                        <span>{link.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                <div className="flex items-center gap-3 p-2">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        isOpen && !isMobile ? "ml-64" : "ml-0"
      )}>
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="mr-2"
            >
              <ChevronRight className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
            </Button>
          )}
          
          <div className="ml-auto flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/wishlist">
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Your Wishlist</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/settings">
                      <Settings className="h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Avatar className="cursor-pointer" onClick={() => navigate('/settings/profile')}>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
