
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { signIn, signUp, signInWithGoogle } from '@/models/Auth';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Success',
        description: 'Signed in successfully.',
      });
      navigate('/dashboard');
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Banner section */}
      <div className="md:w-1/2 gradient-purple p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/victoria-falls.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 text-white max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-white/20 p-2">
              <MapPin size={32} />
            </div>
            <h1 className="text-4xl font-bold">Zimbabwe Tourism</h1>
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
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
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
                      <svg 
                        className="mr-2 h-4 w-4" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                      >
                        <path 
                          fill="currentColor" 
                          d="M12 22q-2.05 0-3.875-.788t-3.188-2.15-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175 3.188-2.137T12 2q2.075 0 3.9.788t3.175 2.137 2.138 3.175T22 12q0 2.05-.788 3.9t-2.137 3.175-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm-1-3h2v-4h4v-2h-4V7h-2v4H7v2h4v4Z"
                        />
                      </svg>
                      Google
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
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
                      <svg 
                        className="mr-2 h-4 w-4" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                      >
                        <path 
                          fill="currentColor" 
                          d="M12 22q-2.05 0-3.875-.788t-3.188-2.15-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175 3.188-2.137T12 2q2.075 0 3.9.788t3.175 2.137 2.138 3.175T22 12q0 2.05-.788 3.9t-2.137 3.175-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm-1-3h2v-4h4v-2h-4V7h-2v4H7v2h4v4Z"
                        />
                      </svg>
                      Google
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
