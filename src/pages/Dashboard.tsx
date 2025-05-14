
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';

const Dashboard: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {profile?.username || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>View and manage your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {profile?.role || 'User'}</p>
              <button 
                onClick={() => navigate('/profile')} 
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors w-full"
              >
                View Profile
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>Manage your travel bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>View your upcoming and past travel bookings.</p>
              <button 
                onClick={() => navigate('/bookings')} 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full"
              >
                View Bookings
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Destinations</CardTitle>
              <CardDescription>Explore Zimbabwe's destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Discover beautiful places to visit across Zimbabwe.</p>
              <button 
                onClick={() => navigate('/destinations')} 
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors w-full"
              >
                Explore Destinations
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Check upcoming events</CardDescription>
            </CardHeader>
            <CardContent>
              <p>See all the exciting events happening around Zimbabwe.</p>
              <button 
                onClick={() => navigate('/events')} 
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors w-full"
              >
                View Events
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>View saved destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access your saved destinations and travel wishlists.</p>
              <button 
                onClick={() => navigate('/wishlist')} 
                className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors w-full"
              >
                View Wishlist
              </button>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="hover:shadow-md transition-all border-2 border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Manage users and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Access administrative controls and manage the platform.</p>
                <button 
                  onClick={() => navigate('/admin')} 
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors w-full"
                >
                  Access Admin Panel
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
