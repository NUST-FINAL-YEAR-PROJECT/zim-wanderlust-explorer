
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/components/SplashScreen';

// Import pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Destinations from '@/pages/Destinations';
import DestinationDetailsPage from '@/pages/DestinationDetailsPage';
import PublicDestinationDetails from '@/pages/PublicDestinationDetails';
import Accommodations from '@/pages/Accommodations';
import AccommodationDetailsPage from '@/pages/AccommodationDetailsPage';
import AccommodationBookingPage from '@/pages/AccommodationBookingPage';
import Events from '@/pages/Events';
import EventBookingPage from '@/pages/EventBookingPage';
import Bookings from '@/pages/Bookings';
import BookingForm from '@/pages/BookingForm';
import PaymentPage from '@/pages/PaymentPage';
import InvoicePage from '@/pages/InvoicePage';
import ItinerariesPage from '@/pages/ItinerariesPage';
import ItineraryCreatePage from '@/pages/ItineraryCreatePage';
import ItineraryDetailsPage from '@/pages/ItineraryDetailsPage';
import ItinerarySharedPage from '@/pages/ItinerarySharedPage';
import WishlistPage from '@/pages/WishlistPage';
import Settings from '@/pages/Settings';
import AdminDashboard from '@/pages/AdminDashboard';
import Browse from '@/pages/Browse';
import CitiesExplorer from '@/pages/CitiesExplorer';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  const { isLoading, user, isAdmin } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/destination/:id" element={<PublicDestinationDetails />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/cities" element={<CitiesExplorer />} />

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
              path="/destinations"
              element={
                <ProtectedRoute>
                  <Destinations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/destinations/:id"
              element={
                <ProtectedRoute>
                  <DestinationDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accommodations"
              element={
                <ProtectedRoute>
                  <Accommodations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accommodations/:id"
              element={
                <ProtectedRoute>
                  <AccommodationDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accommodations/:id/book"
              element={
                <ProtectedRoute>
                  <AccommodationBookingPage />
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
              path="/events/:id/book"
              element={
                <ProtectedRoute>
                  <EventBookingPage />
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
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:bookingId"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoice/:bookingId"
              element={
                <ProtectedRoute>
                  <InvoicePage />
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
              path="/itineraries/:id"
              element={
                <ProtectedRoute>
                  <ItineraryDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/itinerary/shared/:shareCode" element={<ItinerarySharedPage />} />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
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

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
