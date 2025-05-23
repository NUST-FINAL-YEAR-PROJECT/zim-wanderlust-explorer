
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-blue-950 dark:via-indigo-950 dark:to-gray-900">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Desktop Sidebar */}
        <DashboardSidebar
          isOpen={sidebarOpen}
          user={user}
          profile={profile}
          handleSignOut={handleSignOut}
          location={location}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            isMobile={false}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            user={user}
            location={location}
            navigate={navigate}
          />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <DashboardHeader
          isMobile={true}
          isOpen={mobileMenuOpen}
          setIsOpen={setMobileMenuOpen}
          user={user}
          location={location}
          navigate={navigate}
        />
        
        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-md shadow-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
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

        <main className="p-4 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
