
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Bookings: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-500">View and manage your travel bookings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have any bookings yet.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Bookings;
