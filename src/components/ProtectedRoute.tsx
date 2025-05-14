
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show notification if user tries to access admin route without admin privileges
    if (user && requireAdmin && !isAdmin && !isLoading) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges to access this page.",
        variant: "destructive"
      });
    }
  }, [user, isAdmin, requireAdmin, isLoading, toast]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mr-2"></div>
      <span>Verifying authentication...</span>
    </div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log("User not authenticated, redirecting to auth page");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  
  // Check for admin access if required and redirect to dashboard if not admin
  if (requireAdmin && !isAdmin) {
    console.log("User is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("Rendering protected content, requireAdmin:", requireAdmin, "isAdmin:", isAdmin);
  return <>{children}</>;
};

export default ProtectedRoute;
