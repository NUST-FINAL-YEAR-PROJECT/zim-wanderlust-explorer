import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import EventBooking from "./pages/EventBooking";
import PublicDestinationDetails from "./pages/PublicDestinationDetails";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import CitiesExplorer from "./pages/CitiesExplorer";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="zimbabwe-travels-theme">
          <Toaster />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destination/:id" element={<DestinationDetails />} />
            <Route path="/booking/event/:id" element={<EventBooking />} />
            <Route path="/public/destination/:id" element={<PublicDestinationDetails />} />
            <Route path="/cities" element={<CitiesExplorer />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
