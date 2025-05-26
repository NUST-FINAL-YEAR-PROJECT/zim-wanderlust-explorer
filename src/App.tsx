
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from "./contexts/AuthContext";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import SplashScreen from './components/SplashScreen.tsx'
import Browse from "./pages/Browse";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import PublicDestinationDetails from "./pages/PublicDestinationDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import CitiesExplorer from "./pages/CitiesExplorer";
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
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Error handling
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Application error:', event.error);
      setError('An unexpected error occurred. Please refresh the page and try again.');
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="zimbabwe-travels-theme">
          <BrowserRouter>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            
            <AnimatePresence mode="wait">
              {!showSplash && (
                <motion.div
                  key="app"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-indigo-900"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
            
            <Toaster />
            
            <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
              <AlertDialogContent className="border-0 shadow-xl rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center text-blue-800 dark:text-blue-200">
                    <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-full mr-2">
                      <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    Application Error
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {error}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                  >
                    Refresh Page
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
