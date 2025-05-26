
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
  LogIn
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

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-950 dark:text-white">
      {/* Desktop sidebar */}
      {!isMobile && (
        <DashboardSidebar 
          isOpen={isOpen} 
          user={user} 
          profile={profile}
          handleSignOut={handleSignOut}
          location={location}
        />
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
            <DashboardSidebar 
              isMobile={true} 
              isOpen={true} 
              user={user} 
              profile={profile}
              handleSignOut={handleSignOut}
              location={location}
            />
          </SheetContent>
        </Sheet>
      )}
      
      <div className="flex-1 overflow-auto">
        <DashboardHeader 
          isMobile={isMobile}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
          location={location}
          navigate={navigate}
        />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
