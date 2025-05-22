import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Destinations from "@/pages/Destinations";
import DestinationDetailsPage from "@/pages/DestinationDetailsPage";
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
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destination/:id" element={<DestinationDetailsPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/cities" element={<CitiesExplorer />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/accommodation/:id" element={<AccommodationDetails />} />
            <Route path="/booking/:id" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
            <Route path="/event-booking/:id" element={<ProtectedRoute><EventBookingPage /></ProtectedRoute>} />
            <Route path="/payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
            <Route path="/invoice/:id" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/itineraries" element={<ProtectedRoute><ItinerariesPage /></ProtectedRoute>} />
            <Route path="/itineraries/:id" element={<ProtectedRoute><ItineraryDetailsPage /></ProtectedRoute>} />
            <Route path="/itinerary/create" element={<ProtectedRoute><ItineraryCreatePage /></ProtectedRoute>} />
            <Route path="/share/:shareCode" element={<ItinerarySharedPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
