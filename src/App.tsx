
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Destinations from "@/pages/Destinations";
import DestinationDetails from "@/pages/DestinationDetails";
import PublicDestinationDetails from "@/pages/PublicDestinationDetails";
import Events from "@/pages/Events";
import AdminDashboard from "@/pages/AdminDashboard";
import WishlistPage from "@/pages/WishlistPage";
import CitiesExplorer from "@/pages/CitiesExplorer";
import Accommodations from "@/pages/Accommodations";
import AccommodationDetails from "@/pages/AccommodationDetails";
import BookingForm from "@/pages/BookingForm";
import EventBookingPage from "@/pages/EventBookingPage";
import PaymentPage from "@/pages/PaymentPage";
import InvoicePage from "@/pages/InvoicePage";
import Bookings from "@/pages/Bookings";
import Settings from "@/pages/Settings";
import ItinerariesPage from "@/pages/ItinerariesPage";
import ItineraryDetailsPage from "@/pages/ItineraryDetailsPage";
import ItineraryCreatePage from "@/pages/ItineraryCreatePage";
import ItinerarySharedPage from "@/pages/ItinerarySharedPage";
import NotFound from "@/pages/NotFound";
import TransportPage from "@/pages/TransportPage";

const queryClient = new QueryClient();

export default function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" enableSystem>
        <AuthProvider>
          <Routes>
            {/* Public routes without dashboard layout */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={<PublicDestinationDetails />} />
            <Route path="/browse/:id" element={<PublicDestinationDetails />} />
            <Route path="/accommodation/:id" element={<AccommodationDetails />} />
            <Route path="/share/:shareCode" element={<ItinerarySharedPage />} />
            
            {/* Admin route (has its own layout) */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            
            {/* Dashboard routes with consistent sidebar layout - single DashboardLayout wrapper */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/destinations" element={<ProtectedRoute><DashboardLayout><Destinations /></DashboardLayout></ProtectedRoute>} />
            <Route path="/destination/:id" element={<ProtectedRoute><DashboardLayout><DestinationDetails /></DashboardLayout></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><DashboardLayout><Events /></DashboardLayout></ProtectedRoute>} />
            <Route path="/cities" element={<ProtectedRoute><DashboardLayout><CitiesExplorer /></DashboardLayout></ProtectedRoute>} />
            <Route path="/accommodations" element={<ProtectedRoute><DashboardLayout><Accommodations /></DashboardLayout></ProtectedRoute>} />
            <Route path="/transport" element={<ProtectedRoute><DashboardLayout><TransportPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/itineraries" element={<ProtectedRoute><DashboardLayout><ItinerariesPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/itineraries/:id" element={<ProtectedRoute><DashboardLayout><ItineraryDetailsPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/itinerary/create" element={<ProtectedRoute><DashboardLayout><ItineraryCreatePage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><DashboardLayout><WishlistPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><DashboardLayout><Bookings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
            
            {/* Protected routes that need special layouts */}
            <Route path="/booking/:id" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
            <Route path="/event-booking/:id" element={<ProtectedRoute><EventBookingPage /></ProtectedRoute>} />
            <Route path="/payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
            <Route path="/invoice/:id" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
