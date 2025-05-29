import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import DestinationCard from "@/components/DestinationCard";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import { getDestinations } from "@/models/Destination";
import { getEvents } from "@/models/Event";
import { Skeleton } from "@/components/ui/skeleton";
import AiAssistant from "@/components/AiAssistant";
import { Calendar, ChevronRight, Compass, Heart, MapPin, Star, TrendingUp, Users, Eye, ArrowRight, Play, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import FeaturedSection from "@/components/FeaturedSection";
import HeroCarousel from "@/components/HeroCarousel";
import MapExplorer from "@/components/MapExplorer";
import WhyZimbabwe from "@/components/WhyZimbabwe";
import TestimonialSlider from "@/components/TestimonialSlider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [destinations, setDestinations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  // Check auth status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuthStatus();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Fetch data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const destinationsData = await getDestinations();
        const eventsData = await getEvents();
        
        // Take just the first 6 for better grid layout
        setDestinations(destinationsData.slice(0, 6));
        setEvents(eventsData.slice(0, 6));
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Failed to load data",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleExploreMore = () => {
    navigate(`/browse?tab=${activeTab}`);
  };

  const handleStartPlanning = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleBrowseExperiences = () => {
    navigate("/browse");
  };
  
  const handleCardClick = (item: any, type: string) => {
    if (type === 'destination') {
      navigate(`/destination/${item.id}/details`);
    } else {
      navigate(`/booking/event/${item.id}`);
    }
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.1 * i
      }
    })
  };

  const staggeredChildVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Trust indicators data
  const trustIndicators = [
    { number: "15,000+", label: "Happy Travelers", icon: Users },
    { number: "120+", label: "Destinations", icon: MapPin },
    { number: "350+", label: "Experiences", icon: Calendar },
    { number: "4.9", label: "Average Rating", icon: Star }
  ];

  // Quick action cards with improved design including sign in
  const quickActions = [
    {
      title: "Explore Destinations",
      description: "Discover amazing places to visit",
      icon: MapPin,
      gradient: "from-blue-500 to-blue-600",
      onClick: () => navigate("/destinations"),
      badge: "Popular"
    },
    {
      title: "Book Experiences",
      description: "Find unique cultural experiences",
      icon: Calendar,
      gradient: "from-purple-500 to-purple-600",
      onClick: () => navigate("/events"),
      badge: "New"
    },
    {
      title: "Plan Your Trip",
      description: "Create a custom itinerary",
      icon: Compass,
      gradient: "from-emerald-500 to-emerald-600",
      onClick: () => navigate("/itineraries/create"),
      badge: "AI Powered"
    },
    {
      title: isLoggedIn ? "My Account" : "Sign In",
      description: isLoggedIn ? "Access your dashboard" : "Join our community",
      icon: isLoggedIn ? Users : LogIn,
      gradient: "from-rose-500 to-rose-600",
      onClick: isLoggedIn ? () => navigate("/dashboard") : handleSignIn,
      badge: isLoggedIn ? "Account" : "Free"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Enhanced Hero Section */}
      <HeroCarousel />
      
      {/* Sign In Button in Top Right */}
      <motion.div 
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {!isLoggedIn && (
          <Button 
            variant="default" 
            onClick={handleSignIn}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        )}
        {isLoggedIn && (
          <Button 
            variant="default" 
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Dashboard
          </Button>
        )}
      </motion.div>
      
      {/* Trust Indicators Bar */}
      <motion.div
        className="bg-indigo-600 text-white py-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustIndicators.map((indicator, i) => (
              <motion.div
                key={indicator.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <indicator.icon className="h-5 w-5 text-indigo-200" />
                  <span className="text-2xl font-bold">{indicator.number}</span>
                </div>
                <span className="text-indigo-200 text-sm">{indicator.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Quick Actions Section with Enhanced Design */}
      <motion.div
        className="container mx-auto px-4 py-16 -mt-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4"
            variants={staggeredChildVariants}
          >
            Start Your Zimbabwe Adventure
          </motion.h2>
          <motion.p 
            className="text-indigo-600/80 max-w-2xl mx-auto"
            variants={staggeredChildVariants}
          >
            Choose how you'd like to explore Zimbabwe's beauty and culture
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              custom={i}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.3 } 
              }}
              onClick={action.onClick}
              className="cursor-pointer group"
            >
              <Card className="overflow-hidden border-indigo-100 hover:shadow-2xl transition-all duration-300 h-full relative">
                {action.badge && (
                  <Badge className="absolute top-3 right-3 z-10 bg-amber-500 text-white">
                    {action.badge}
                  </Badge>
                )}
                <CardHeader className={`bg-gradient-to-r ${action.gradient} text-white p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="relative z-10">
                    <div className="rounded-full bg-white/20 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <action.icon size={24} />
                    </div>
                    <CardTitle className="text-xl mb-2">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <CardDescription className="text-gray-600 mb-4">
                    {action.description}
                  </CardDescription>
                  <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors">
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Featured Experiences Section */}
      <FeaturedSection />
      
      {/* Popular Content Section with Enhanced Design */}
      <motion.div 
        className="container mx-auto px-4 py-20 bg-gradient-to-b from-white to-indigo-50/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4"
            variants={staggeredChildVariants}
          >
            Trending in Zimbabwe
          </motion.h2>
          <motion.p 
            className="text-indigo-600/80 max-w-2xl mx-auto"
            variants={staggeredChildVariants}
          >
            Discover the most popular destinations and experiences chosen by travelers
          </motion.p>
        </div>
        
        <Tabs defaultValue="destinations" className="mb-8" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white shadow-lg border border-indigo-100 rounded-full p-1">
              <TabsTrigger 
                value="destinations" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-full px-6 py-3 font-medium transition-all duration-300"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Destinations
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-full px-6 py-3 font-medium transition-all duration-300"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Experiences
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="destinations" className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <Skeleton className="h-64 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((destination, i) => (
                  <motion.div 
                    key={destination.id} 
                    className="cursor-pointer"
                    onClick={() => handleCardClick(destination, 'destination')}
                    custom={i}
                    variants={cardVariants}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.02,
                      transition: { duration: 0.3 } 
                    }}
                  >
                    <DestinationCard 
                      destination={destination}
                      className="hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white border border-indigo-100 hover:border-indigo-200" 
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <Skeleton className="h-64 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, i) => (
                  <motion.div 
                    key={event.id} 
                    className="cursor-pointer"
                    onClick={() => handleCardClick(event, 'event')}
                    custom={i}
                    variants={cardVariants}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.02,
                      transition: { duration: 0.3 } 
                    }}
                  >
                    <EventCard 
                      event={event}
                      className="hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white border border-indigo-100 hover:border-indigo-200"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-12">
          <Button 
            onClick={handleExploreMore}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>Explore All {activeTab === 'destinations' ? 'Destinations' : 'Experiences'}</span>
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </motion.div>
      
      {/* Why Visit Zimbabwe Section */}
      <WhyZimbabwe />
      
      {/* Testimonials Section */}
      <TestimonialSlider />
      
      {/* Map Explorer */}
      <MapExplorer />
      
      {/* Enhanced CTA Section */}
      <motion.section 
        className="py-24 bg-cover bg-center relative overflow-hidden" 
        style={{ 
          backgroundImage: "linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(67, 56, 202, 0.95)), url('/lovable-uploads/6d4e39d4-1981-4237-afb7-a1a7afe47fb3.png')" 
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/3 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2 text-sm">
                ✨ Start Your Adventure Today
              </Badge>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Ready for Your
              <span className="block text-amber-300">Zimbabwe Adventure?</span>
            </motion.h2>
            
            <motion.p 
              className="mb-12 text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {isLoggedIn 
                ? "Your dashboard is ready! Explore more destinations and start planning your perfect Zimbabwe experience." 
                : "Join thousands of travelers who have discovered Zimbabwe's magic. Create your account and unlock personalized recommendations."}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg"
                  onClick={handleStartPlanning}
                  className="bg-white text-indigo-600 hover:bg-gray-50 text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
                >
                  {isLoggedIn ? (
                    <>
                      <Compass className="h-5 w-5 mr-2" />
                      Go to Dashboard
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Planning Free
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6 rounded-full backdrop-blur-sm transition-all duration-300 font-medium"
                  onClick={handleBrowseExperiences}
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Browse Experiences
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-12 text-white/70 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <p>✓ Free to start • ✓ No hidden fees • ✓ Expert local guides</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      <Footer />
      <AiAssistant />
    </div>
  );
};

export default Index;
