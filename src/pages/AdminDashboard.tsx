
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import UsersManagement from '@/components/admin/UsersManagement';
import DestinationsManagement from '@/components/admin/DestinationsManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { Users, MapPin, Calendar, BarChart2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your website content and view analytics</p>
        </header>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <TabsList className="grid w-full grid-cols-4 rounded-md">
              <TabsTrigger value="analytics" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <BarChart2 size={18} />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <Users size={18} />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="destinations" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <MapPin size={18} />
                <span>Destinations</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <Calendar size={18} />
                <span>Events</span>
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
