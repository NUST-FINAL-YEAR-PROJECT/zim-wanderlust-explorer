
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { signIn, signUp, signInWithGoogle } from '@/models/Auth';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, ShieldCheck } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isLoading } = useAuth();

  // Get the intended destination from location state, or default routes
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
  
  useEffect(() => {
    // Only redirect when we have determined the user state and they're logged in
    if (!isLoading && user) {
      const redirectPath = from || (isAdmin ? '/admin' : '/dashboard');
      console.log("User is logged in, redirecting to:", redirectPath, "isAdmin:", isAdmin);
      navigate(redirectPath, { replace: true });
    }
  }, [user, isAdmin, navigate, isLoading, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Success',
        description: 'Signed in successfully.',
      });
      // Will be handled by the useEffect above
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      // We don't check for admin role here - the redirect will be handled by the useEffect
      toast({
        title: 'Success',
        description: 'Signed in successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: 'Success',
        description: 'Account created successfully. Please check your email for verification.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // No need for success toast as user will be redirected after successful auth
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Show loading state if auth state is still being determined
  if (isLoading && user) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mr-2"></div>
      <span>Authenticating...</span>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Banner section */}
      <div className="md:w-1/2 gradient-purple p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/victoria-falls.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 text-white max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-white/20 p-2 cursor-pointer" onClick={handleGoBack}>
              <MapPin size={32} />
            </div>
            <h1 className="text-4xl font-bold cursor-pointer" onClick={handleGoBack}>Zimbabwe Tourism</h1>
          </div>
          <p className="text-xl mb-8">Experience the breathtaking beauty of Zimbabwe's landscapes, rich culture, and unforgettable adventures.</p>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <p className="italic text-white/90 text-lg">"Zimbabwe is not just a destination; it's an experience that stays with you forever."</p>
          </div>
        </div>
      </div>

      {/* Auth form section */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-purple-600">Welcome</CardTitle>
              <CardDescription>Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="admin" className="bg-purple-100 text-purple-800">Admin</TabsTrigger>
              </TabsList>
              
              {/* Regular User Sign In */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input 
                        id="signin-email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        className="bg-slate-50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input 
                        id="signin-password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="bg-slate-50"
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3">
                    <Button type="submit" className="w-full gradient-purple hover:opacity-90" disabled={loading}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-gray-300" 
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                        </g>
                      </svg>
                      Google
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        className="bg-slate-50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-50"
                        required 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3">
                    <Button type="submit" className="w-full gradient-purple hover:opacity-90" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-gray-300" 
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                        </g>
                      </svg>
                      Google
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              {/* Admin Sign In Tab */}
              <TabsContent value="admin">
                <form onSubmit={handleAdminSignIn}>
                  <CardContent className="space-y-4 pt-2">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full bg-purple-100 p-3">
                        <ShieldCheck className="h-6 w-6 text-purple-800" />
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <h3 className="font-medium">Admin Access</h3>
                      <p className="text-sm text-gray-500">Sign in with your admin credentials</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input 
                        id="admin-email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com" 
                        className="bg-slate-50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input 
                        id="admin-password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="bg-slate-50"
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white" 
                      disabled={loading}
                    >
                      {loading ? 'Authenticating...' : 'Access Admin Panel'}
                    </Button>
                    <p className="text-xs text-center mt-4 text-gray-500">
                      Only authorized administrators can access the management dashboard.
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="mt-6 text-center">
            <Button variant="link" onClick={handleGoBack} className="text-indigo-700">
              Return to Home
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
