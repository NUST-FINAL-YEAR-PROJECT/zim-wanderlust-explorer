
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, MapPin, CalendarDays, BookmarkIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Define card styles
  const cards = [
    {
      title: "My Profile",
      description: "View and manage your profile information",
      icon: UserIcon,
      action: "View Profile",
      path: "/profile",
      color: "bg-gradient-to-br from-purple-50 to-purple-100",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
      iconClass: "text-purple-500"
    },
    {
      title: "My Bookings",
      description: "Manage your travel bookings",
      icon: Calendar,
      action: "View Bookings",
      path: "/bookings",
      color: "bg-gradient-to-br from-blue-50 to-blue-100",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      iconClass: "text-blue-500"
    },
    {
      title: "Destinations",
      description: "Explore Zimbabwe's destinations",
      icon: MapPin,
      action: "Explore Destinations",
      path: "/destinations",
      color: "bg-gradient-to-br from-green-50 to-green-100",
      buttonClass: "bg-green-600 hover:bg-green-700",
      iconClass: "text-green-500"
    },
    {
      title: "Events",
      description: "Check upcoming events",
      icon: CalendarDays,
      action: "View Events",
      path: "/events",
      color: "bg-gradient-to-br from-amber-50 to-amber-100",
      buttonClass: "bg-amber-600 hover:bg-amber-700",
      iconClass: "text-amber-500"
    },
    {
      title: "My Wishlist",
      description: "View saved destinations",
      icon: BookmarkIcon,
      action: "View Wishlist",
      path: "/wishlist",
      color: "bg-gradient-to-br from-pink-50 to-pink-100",
      buttonClass: "bg-pink-600 hover:bg-pink-700",
      iconClass: "text-pink-500"
    }
  ];

  const adminCard = {
    title: "Admin Panel",
    description: "Manage users and content",
    icon: UserIcon,
    action: "Access Admin Panel",
    path: "/admin",
    color: "bg-gradient-to-br from-orange-50 to-orange-100",
    buttonClass: "bg-orange-600 hover:bg-orange-700",
    iconClass: "text-orange-500"
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Welcome back, {profile?.username || user?.email?.split('@')[0]}</h2>
          <p className="mt-2 text-purple-100">Discover Zimbabwe's best destinations and events</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title} className={cn("overflow-hidden transition-all hover:shadow-lg", card.color)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                  <card.icon className={cn("h-5 w-5", card.iconClass)} />
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <button 
                  onClick={() => navigate(card.path)} 
                  className={cn("mt-4 text-white px-4 py-2 rounded-md transition-colors w-full", card.buttonClass)}
                >
                  {card.action}
                </button>
              </CardContent>
            </Card>
          ))}

          {isAdmin && (
            <Card className="overflow-hidden border-2 border-orange-200 transition-all hover:shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{adminCard.title}</CardTitle>
                  <adminCard.icon className={adminCard.iconClass} />
                </div>
                <CardDescription>{adminCard.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <button 
                  onClick={() => navigate(adminCard.path)} 
                  className={cn("mt-4 text-white px-4 py-2 rounded-md transition-colors w-full", adminCard.buttonClass)}
                >
                  {adminCard.action}
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
