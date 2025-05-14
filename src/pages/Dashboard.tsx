
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from '@/models/Auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {profile?.username || user?.email}</p>
        </div>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>View and manage your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {profile?.role || 'User'}</p>
            <Button className="mt-4" onClick={() => navigate('/profile')}>View Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>Manage your travel bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/bookings')}>View Bookings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
            <CardDescription>View saved destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/wishlist')}>View Wishlist</Button>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Manage users and content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/admin')}>Access Admin Panel</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
