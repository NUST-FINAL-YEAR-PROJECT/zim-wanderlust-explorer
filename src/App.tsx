
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Browse from "./pages/Browse";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import PublicDestinationDetails from "./pages/PublicDestinationDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import CitiesExplorer from "./pages/CitiesExplorer";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import WishlistPage from "./pages/WishlistPage";
import BookingForm from "./pages/BookingForm";
import Bookings from "./pages/Bookings";
import ItinerariesPage from "./pages/ItinerariesPage";
import ItineraryCreatePage from "./pages/ItineraryCreatePage";
import ItineraryDetailsPage from "./pages/ItineraryDetailsPage";
import PaymentPage from "./pages/PaymentPage";
import Settings from "./pages/Settings";
import EventBookingPage from "./pages/EventBookingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="zimbabwe-travels-theme">
          <Toaster />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/public/destination/:id" element={<PublicDestinationDetails />} />
            
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
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
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
              path="/cities"
              element={
                <ProtectedRoute>
                  <CitiesExplorer />
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
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingForm />
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
            <Route
              path="/payment/:id"
              element={
                <ProtectedRoute>
                  <PaymentPage />
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
              path="/booking/event/:id"
              element={
                <ProtectedRoute>
                  <EventBookingPage />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
