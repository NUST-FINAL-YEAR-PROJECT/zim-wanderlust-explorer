
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MapPin, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Settings,
  ChevronRight,
  Bed
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import UsersManagement from '@/components/admin/UsersManagement';
import DestinationsManagement from '@/components/admin/DestinationsManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import AccommodationsManagement from '@/components/admin/AccommodationsManagement';
import BookingsManagement from '@/components/admin/BookingsManagement';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) {
    return null;
  }

  const quickStats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Destinations',
      value: '89',
      change: '+5%',
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Accommodations',
      value: '156',
      change: '+8%',
      icon: Bed,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Events',
      value: '45',
      change: '+18%',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Bookings',
      value: '2,156',
      change: '+23%',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+15%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Destination',
      description: 'Create a new travel destination',
      action: () => setActiveTab('destinations'),
      icon: MapPin,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'Add Accommodation',
      description: 'Add a new accommodation option',
      action: () => setActiveTab('accommodations'),
      icon: Bed,
      color: 'from-amber-600 to-orange-600',
    },
    {
      title: 'Create Event',
      description: 'Schedule a new event',
      action: () => setActiveTab('events'),
      icon: Calendar,
      color: 'from-purple-600 to-pink-600',
    },
    {
      title: 'Review Bookings',
      description: 'Manage user bookings',
      action: () => setActiveTab('bookings'),
      icon: BookOpen,
      color: 'from-green-600 to-emerald-600',
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-indigo-100">Manage your ExploreZim platform</p>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                System Active
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white dark:bg-gray-800 shadow-sm border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Users
            </TabsTrigger>
            <TabsTrigger value="destinations" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Destinations
            </TabsTrigger>
            <TabsTrigger value="accommodations" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Accommodations
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Events
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-green-600 font-medium">
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        onClick={action.action}
                        className="w-full h-auto p-4 justify-start hover:shadow-md transition-all duration-300"
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} mr-4`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="destinations">
            <DestinationsManagement />
          </TabsContent>

          <TabsContent value="accommodations">
            <AccommodationsManagement />
          </TabsContent>

          <TabsContent value="events">
            <EventsManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
