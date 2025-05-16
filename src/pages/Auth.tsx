
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WelcomeSplash from '@/components/WelcomeSplash';

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeSplash, setShowWelcomeSplash] = useState(false);

  // If user is already logged in, show welcome splash then redirect
  React.useEffect(() => {
    if (user) {
      setShowWelcomeSplash(true);
    }
  }, [user]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // Show welcome splash, which will redirect after completion
      setShowWelcomeSplash(true);
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        // Create a profile for the user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              username: email.split('@')[0], 
              first_name: name.split(' ')[0],
              last_name: name.split(' ').slice(1).join(' '),
            }
          ]);
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
        
        toast({
          title: "Account created",
          description: "Welcome to ExploreZim! You are now logged in.",
        });
        
        // Show welcome splash
        setShowWelcomeSplash(true);
      }
      
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showWelcomeSplash ? (
        <WelcomeSplash onComplete={() => navigate('/dashboard')} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 py-12">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-indigo-100">
              <CardHeader className="text-center space-y-1">
                <CardTitle className="text-3xl font-display text-indigo-900">Welcome to ExploreZim</CardTitle>
                <CardDescription>Enter your details to continue your journey</CardDescription>
              </CardHeader>
              
              <Tabs defaultValue="login" className="px-6">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="Email" 
                            type="email" 
                            className="pl-10" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="Password" 
                            type={showPassword ? "text" : "password"} 
                            className="pl-10 pr-10" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex-col space-y-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign in"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignupSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="Full Name" 
                            className="pl-10" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="Email" 
                            type="email" 
                            className="pl-10" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="Password" 
                            type={showPassword ? "text" : "password"} 
                            className="pl-10 pr-10" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 6 characters long
                        </p>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex-col space-y-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create account"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="text-center pb-6">
                <Button 
                  variant="link" 
                  className="text-indigo-600"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default Auth;
