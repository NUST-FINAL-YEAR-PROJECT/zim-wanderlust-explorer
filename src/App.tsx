
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PublicDestinationDetails from "./pages/PublicDestinationDetails";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Bookings from "./pages/Bookings";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import BookingForm from "./pages/BookingForm";
import PaymentPage from "./pages/PaymentPage";
import InvoicePage from "./pages/InvoicePage";
import Events from "./pages/Events";
import EventBookingPage from "./pages/EventBookingPage";
import Settings from "./pages/Settings";
import WishlistPage from "./pages/WishlistPage";
import ItinerariesPage from "./pages/ItinerariesPage";
import ItineraryCreatePage from "./pages/ItineraryCreatePage";
import ItineraryDetailsPage from "./pages/ItineraryDetailsPage";
import ItinerarySharedPage from "./pages/ItinerarySharedPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/destination/:id/details" element={<PublicDestinationDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/itinerary/shared/:shareCode" element={<ItinerarySharedPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/destinations" 
              element={
                <ProtectedRoute>
                  <Destinations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/destination/:id" 
              element={
                <ProtectedRoute>
                  <DestinationDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking/:id" 
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking/event/:id" 
              element={
                <ProtectedRoute>
                  <EventBookingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment/:id" 
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/invoice/:id" 
              element={
                <ProtectedRoute>
                  <InvoicePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wishlist" 
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } 
            />
            {/* Itinerary Routes */}
            <Route 
              path="/itineraries" 
              element={
                <ProtectedRoute>
                  <ItinerariesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/itineraries/create" 
              element={
                <ProtectedRoute>
                  <ItineraryCreatePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/itinerary/:id" 
              element={
                <ProtectedRoute>
                  <ItineraryDetailsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
