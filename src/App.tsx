
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

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="zimbabwe-travels-theme">
          <Toaster />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/auth" element={<Auth />} />
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
            <Route path="/public/destination/:id" element={<PublicDestinationDetails />} />
            <Route 
              path="/cities" 
              element={
                <ProtectedRoute>
                  <CitiesExplorer />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
