
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail, User, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WelcomeSplash from '@/components/WelcomeSplash';
import { motion } from 'framer-motion';

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
  useEffect(() => {
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      {showWelcomeSplash ? (
        <WelcomeSplash onComplete={() => navigate('/dashboard')} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-indigo-700 to-indigo-500 px-4 py-12">
          <motion.div 
            className="w-full max-w-md"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90 rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
              <CardHeader className="text-center space-y-1 pt-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </motion.div>
                <CardTitle className="text-3xl font-display text-indigo-900">Welcome to ExploreZim</CardTitle>
                <CardDescription className="text-indigo-700">Enter your details to continue your journey</CardDescription>
              </CardHeader>
              
              <Tabs defaultValue="login" className="px-6">
                <TabsList className="grid grid-cols-2 mb-6 bg-indigo-100/80">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit}>
                    <CardContent className="space-y-4">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                          <Input 
                            placeholder="Email" 
                            type="email" 
                            className="pl-10 bg-indigo-50/50 border-indigo-100 focus:border-indigo-300 h-12" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                          <Input 
                            placeholder="Password" 
                            type={showPassword ? "text" : "password"} 
                            className="pl-10 pr-10 bg-indigo-50/50 border-indigo-100 focus:border-indigo-300 h-12" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-0 top-0 h-full px-3 text-indigo-400 hover:text-indigo-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>
                    
                    <CardFooter className="flex-col space-y-4 pb-8">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 h-12 rounded-xl text-lg font-medium shadow-md shadow-indigo-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                          </div>
                        ) : "Sign in"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignupSubmit}>
                    <CardContent className="space-y-4">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                          <Input 
                            placeholder="Full Name" 
                            className="pl-10 bg-indigo-50/50 border-indigo-100 focus:border-indigo-300 h-12" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                          <Input 
                            placeholder="Email" 
                            type="email" 
                            className="pl-10 bg-indigo-50/50 border-indigo-100 focus:border-indigo-300 h-12" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                          <Input 
                            placeholder="Password" 
                            type={showPassword ? "text" : "password"} 
                            className="pl-10 pr-10 bg-indigo-50/50 border-indigo-100 focus:border-indigo-300 h-12" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-0 top-0 h-full px-3 text-indigo-400 hover:text-indigo-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                        </div>
                        <p className="text-xs text-indigo-500 pl-2">
                          Password must be at least 6 characters long
                        </p>
                      </motion.div>
                    </CardContent>
                    
                    <CardFooter className="flex-col space-y-4 pb-8">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 h-12 rounded-xl text-lg font-medium shadow-md shadow-indigo-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                          </div>
                        ) : "Create account"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="text-center pb-8">
                <Button 
                  variant="link" 
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  onClick={() => navigate('/')}
                >
                  <motion.span 
                    whileHover={{ x: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                  </motion.span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Auth;
