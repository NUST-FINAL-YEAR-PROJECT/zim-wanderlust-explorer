
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
  BarChart3, 
  BookOpen, 
  LogOut, 
  Settings, 
  Home,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/models/Auth';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  // Admin navigation items with proper icons
  const adminNavItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
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
        : 'A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Clean Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Welcome back, {fullName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-700">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Admin Control Panel</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Manage users, destinations, events, and view analytics from this central dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {adminNavItems.map((item) => (
                <TabsTrigger 
                  key={item.id}
                  value={item.id} 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Tab Content */}
            <div className="mt-6">
              <TabsContent value="analytics" className="mt-0">
                <AdminAnalytics />
              </TabsContent>
              <TabsContent value="users" className="mt-0">
                <UsersManagement />
              </TabsContent>
              <TabsContent value="destinations" className="mt-0">
                <DestinationsManagement />
              </TabsContent>
              <TabsContent value="events" className="mt-0">
                <EventsManagement />
              </TabsContent>
              <TabsContent value="bookings" className="mt-0">
                <BookingsManagement />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
