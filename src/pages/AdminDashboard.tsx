
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  BarChart2, 
  BookOpen, 
  LogOut, 
  Settings, 
  Home, 
  Moon,
  Sun,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/models/Auth';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Admin navigation items
  const adminNavItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
  ];

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let greetingText = '';
      let timeText = '';
      
      if (hour < 12) {
        greetingText = 'Good morning';
        timeText = 'morning';
      } else if (hour < 18) {
        greetingText = 'Good afternoon';
        timeText = 'afternoon';
      } else {
        greetingText = 'Good evening';
        timeText = 'evening';
      }
      
      setGreeting(greetingText);
      setTimeOfDay(timeText);
    };
    
    updateGreeting();
    
    // Update greeting every hour
    const interval = setInterval(updateGreeting, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getTimeBasedEmoji = () => {
    switch (timeOfDay) {
      case 'morning':
        return '☀️';
      case 'afternoon':
        return '🌤️';
      case 'evening':
        return '🌙';
      default:
        return '👋';
    }
  };

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
        : 'A';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Animation variants
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30
      }
    }
  };

  const navItemVariants = {
    hover: { x: 5, transition: { type: "spring", stiffness: 300 } }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-indigo-50 text-gray-900'}`}>
      {/* Desktop sidebar */}
      <div className={`fixed left-0 top-0 hidden h-full w-64 border-r shadow-lg lg:block z-30 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-100'}`}>
        <div className={`p-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-indigo-100'}`}>
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 p-2 text-white">
              <MapPin size={18} />
            </div>
            <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>Admin Portal</h2>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <div className={`flex items-center space-x-3 mb-4 p-3 rounded-xl ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
              <Avatar className="h-10 w-10 border-2 border-indigo-200">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>{fullName}</p>
                <p className={`text-xs ${isDarkMode ? 'text-indigo-300' : 'text-indigo-400'}`}>{profile?.role || 'Administrator'}</p>
              </div>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleDarkMode}
                    className="absolute top-4 right-4"
                  >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <nav>
            <ul className="space-y-2">
              {adminNavItems.map((item) => (
                <li key={item.id}>
                  <motion.div whileHover="hover" variants={navItemVariants}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left px-4 py-3 rounded-lg ${
                        activeTab === item.id 
                          ? isDarkMode 
                            ? 'bg-indigo-800 text-white' 
                            : 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md' 
                          : isDarkMode
                            ? 'hover:bg-gray-700 text-white'
                            : 'hover:bg-indigo-50 text-indigo-700'
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                      {activeTab === item.id && <ChevronRight className="ml-auto h-5 w-5" />}
                    </Button>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-indigo-100">
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className={`w-full justify-start ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-indigo-200 hover:bg-indigo-50'}`} asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" className={`w-full justify-start ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-indigo-200 hover:bg-indigo-50'}`} onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
              <Button variant="outline" className={`w-full justify-start ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-indigo-200 hover:bg-indigo-50'}`} asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={`fixed top-0 left-0 h-full w-64 z-50 lg:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-indigo-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 p-2 text-white">
                    <MapPin size={18} />
                  </div>
                  <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>Admin Portal</h2>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleMobileMenu}>
                  <span className="sr-only">Close menu</span>
                  <svg 
                    width="15" 
                    height="15" 
                    viewBox="0 0 15 15" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path 
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" 
                      fill="currentColor" 
                      fillRule="evenodd" 
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-6">
                <div className={`flex items-center space-x-3 mb-4 p-3 rounded-xl ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>{fullName}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-indigo-300' : 'text-indigo-400'}`}>{profile?.role || 'Administrator'}</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleDarkMode}
                  className="absolute top-16 right-4"
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </Button>
              </div>
              
              <nav>
                <ul className="space-y-2">
                  {adminNavItems.map((item) => (
                    <li key={item.id}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left px-4 py-3 rounded-lg ${
                          activeTab === item.id 
                            ? isDarkMode 
                              ? 'bg-indigo-800 text-white' 
                              : 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white' 
                            : isDarkMode
                              ? 'hover:bg-gray-700 text-white'
                              : 'hover:bg-indigo-50 text-indigo-700'
                        }`}
                        onClick={() => {
                          setActiveTab(item.id);
                          toggleMobileMenu();
                        }}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                        {activeTab === item.id && <ChevronRight className="ml-auto h-5 w-5" />}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="mt-8 space-y-2">
                <Button variant="outline" className={`w-full justify-start ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-indigo-200 hover:bg-indigo-50'}`} asChild>
                  <Link to="/settings" onClick={toggleMobileMenu}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" className={`w-full justify-start ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-indigo-200 hover:bg-indigo-50'}`} onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
                <Button variant="outline" className={`w-full justify-start ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-indigo-200 hover:bg-indigo-50'}`} asChild>
                  <Link to="/" onClick={toggleMobileMenu}>
                    <Home className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            className="mb-6"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div>
                <h1 className={`text-3xl font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>
                  <span>{getTimeBasedEmoji()}</span>
                  <span>Admin Dashboard</span>
                </h1>
                <p className={isDarkMode ? 'text-gray-300' : 'text-indigo-600'}>
                  {greeting}, {profile?.first_name || 'Admin'}. Here's what's happening today.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-indigo-400'}`}>Last updated</div>
                <div className="font-medium">{new Date().toLocaleString()}</div>
              </div>
            </div>
            
            <Card className={`border-l-4 border-l-indigo-600 mt-6 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-indigo-100'}`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <span className="text-lg">👋</span>
                  <p className="text-sm">
                    Welcome to your personalized admin dashboard. Manage your content, track analytics, and handle bookings all from this central location.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Top Tab Navigation Bar */}
          <motion.div 
            className={`w-full shadow-sm rounded-xl overflow-hidden mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full grid-cols-5 p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {adminNavItems.map((item, idx) => (
                  <TabsTrigger 
                    key={item.id}
                    value={item.id} 
                    className={`flex items-center justify-center gap-2 rounded-lg py-3 ${
                      isDarkMode 
                        ? 'data-[state=active]:bg-indigo-800 data-[state=active]:text-white text-gray-300' 
                        : 'data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 text-indigo-600'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
          
          {/* Tab Content */}
          <motion.div 
            className="mt-6"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'users' && <UsersManagement />}
            {activeTab === 'destinations' && <DestinationsManagement />}
            {activeTab === 'events' && <EventsManagement />}
            {activeTab === 'bookings' && <BookingsManagement />}
          </motion.div>
        </div>
      </main>

      {/* Mobile menu button */}
      <Button 
        variant="gradient" 
        size="icon" 
        className="fixed bottom-4 right-4 z-40 lg:hidden shadow-lg rounded-full h-14 w-14 flex items-center justify-center"
        onClick={toggleMobileMenu}
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default AdminDashboard;
