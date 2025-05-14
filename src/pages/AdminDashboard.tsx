
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllUsers, updateUserRole } from '@/models/Role';
import { Profile } from '@/models/Profile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/models/Role';
import DashboardLayout from '@/components/DashboardLayout';
import UsersManagement from '@/components/admin/UsersManagement';
import DestinationsManagement from '@/components/admin/DestinationsManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { User, Users, MapPin, Calendar, BarChart2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 size={18} />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={18} />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="destinations" className="flex items-center gap-2">
              <MapPin size={18} />
              <span className="hidden sm:inline">Destinations</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>
          
          <TabsContent value="destinations">
            <DestinationsManagement />
          </TabsContent>
          
          <TabsContent value="events">
            <EventsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
