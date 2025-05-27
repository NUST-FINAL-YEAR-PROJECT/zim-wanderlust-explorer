
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import UsersManagement from '@/components/admin/UsersManagement';
import DestinationsManagement from '@/components/admin/DestinationsManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import BookingsManagement from '@/components/admin/BookingsManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { 
  Users, 
  MapPin, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  LogOut, 
  Settings, 
  Home,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/models/Auth';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const adminNavItems = [
    { 
      id: 'analytics', 
      label: 'Dashboard', 
      icon: BarChart3, 
      description: 'Overview & Analytics',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      description: 'Manage Users',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'destinations', 
      label: 'Destinations', 
      icon: MapPin, 
      description: 'Manage Destinations',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'events', 
      label: 'Events', 
      icon: Calendar, 
      description: 'Manage Events',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: BookOpen, 
      description: 'Manage Bookings',
      color: 'from-indigo-500 to-indigo-600'
    },
  ];

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

  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile?.username || user?.email?.split('@')[0] || 'Admin';

  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : profile?.username 
      ? profile.username.substring(0, 2).toUpperCase()
      : user?.email 
        ? user.email.substring(0, 2).toUpperCase() 
        : 'AD';

  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':
        return <AdminAnalytics />;
      case 'users':
        return <UsersManagement />;
      case 'destinations':
        return <DestinationsManagement />;
      case 'events':
        return <EventsManagement />;
      case 'bookings':
        return <BookingsManagement />;
      default:
        return <AdminAnalytics />;
    }
  };

  const currentSection = adminNavItems.find(item => item.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed lg:relative z-30 h-full"
          >
            <div className="w-80 h-screen bg-white/95 backdrop-blur-xl dark:bg-slate-900/95 border-r border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Admin Panel
                      </h1>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Management Dashboard</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {adminNavItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group",
                      activeSection === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/25`
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-md"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      activeSection === item.id
                        ? "bg-white/20"
                        : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                    )}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.label}</div>
                      <div className={cn(
                        "text-xs transition-all duration-300",
                        activeSection === item.id 
                          ? "text-white/80" 
                          : "text-slate-500 dark:text-slate-400"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-700 shadow-md">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{fullName}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">System Administrator</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" asChild className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Link to="/dashboard">
                      <Home className="h-4 w-4 mr-2" />
                      User Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut} 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <div>
                  <div className="flex items-center space-x-3">
                    {currentSection && (
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-r",
                        currentSection.color
                      )}>
                        <currentSection.icon className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {currentSection?.label || 'Admin Dashboard'}
                      </h1>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {currentSection?.description || 'Welcome to the admin dashboard'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{fullName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Administrator</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-700 shadow-md">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
