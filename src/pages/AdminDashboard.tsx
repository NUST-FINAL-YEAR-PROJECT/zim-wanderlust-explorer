
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import UsersManagement from '@/components/admin/UsersManagement';
import DestinationsManagement from '@/components/admin/DestinationsManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import BookingsManagement from '@/components/admin/BookingsManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { Users, MapPin, Calendar, BarChart2, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();
  const { profile } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-3 sm:p-6">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  {greeting}, {profile?.first_name || 'Admin'}. Manage your website content and view analytics.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-sm text-gray-500">Last updated</div>
                <div className="text-gray-800 font-medium">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </header>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 rounded-md">
                <TabsTrigger value="analytics" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                  <BarChart2 size={18} />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                  <Users size={18} />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="destinations" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                  <MapPin size={18} />
                  <span className="hidden sm:inline">Destinations</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                  <Calendar size={18} />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                  <BookOpen size={18} />
                  <span className="hidden sm:inline">Bookings</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="analytics" className="border-none p-0 mt-6">
              <AdminAnalytics />
            </TabsContent>
            
            <TabsContent value="users" className="border-none p-0 mt-6">
              <UsersManagement />
            </TabsContent>
            
            <TabsContent value="destinations" className="border-none p-0 mt-6">
              <DestinationsManagement />
            </TabsContent>
            
            <TabsContent value="events" className="border-none p-0 mt-6">
              <EventsManagement />
            </TabsContent>
            
            <TabsContent value="bookings" className="border-none p-0 mt-6">
              <BookingsManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
