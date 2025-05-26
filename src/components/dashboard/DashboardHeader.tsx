
import React from 'react';
import { Link, Location, NavigateFunction } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: SupabaseUser | null;
  location: Location;
  navigate: NavigateFunction;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  isMobile, 
  isOpen, 
  setIsOpen, 
  user, 
  location,
  navigate 
}) => {
  // Get the current page title based on the route
  const getPageTitle = () => {
    const routes = [
      { path: '/dashboard', title: 'Dashboard', description: 'Welcome to ExploreZim' },
      { path: '/bookings', title: 'My Bookings', description: 'View and manage bookings' },
      { path: '/destinations', title: 'Destinations', description: 'Explore travel destinations' },
      { path: '/events', title: 'Events', description: 'Upcoming local events' },
      { path: '/wishlist', title: 'Wishlist', description: 'Places you want to visit' },
      { path: '/cities', title: 'Cities Explorer', description: 'Explore by city' },
      { path: '/settings', title: 'Settings', description: 'Manage your account' },
      { path: '/itineraries', title: 'Itineraries', description: 'Your travel plans' },
      { path: '/itineraries/create', title: 'Create Itinerary', description: 'Plan your trip' },
    ];
    
    const route = routes.find(r => location.pathname.startsWith(r.path));
    return route ? route : { title: 'Dashboard', description: 'Welcome to ExploreZim' };
  };
  
  const currentPage = getPageTitle();

  return (
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
              {currentPage.title}
            </h1>
            <p className="text-sm text-blue-400 dark:text-blue-300 hidden sm:block">
              {currentPage.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!user && (
            <Button 
              variant="default"
              className="rounded-lg text-white"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </Button>
          )}
          {user && (
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
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
