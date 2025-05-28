
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
import { Calendar, ChevronRight, Compass, Heart, MapPin, Star, Users, Eye, ArrowRight, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import HeroCarousel from "@/components/HeroCarousel";
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

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        delay: 0.1 * i
      }
    })
  };

  // Quick action cards
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
      title: "Save Favorites",
      description: "Keep track of places to visit",
      icon: Heart,
      gradient: "from-rose-500 to-rose-600",
      onClick: () => navigate("/wishlist"),
      badge: "Free"
    }
  ];

  // Trust indicators
  const trustIndicators = [
    { number: "15,000+", label: "Happy Travelers", icon: Users },
    { number: "120+", label: "Destinations", icon: MapPin },
    { number: "350+", label: "Experiences", icon: Calendar },
    { number: "4.9", label: "Average Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <HeroCarousel />
      
      {/* Trust Indicators */}
      <motion.div
        className="bg-indigo-600 text-white py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustIndicators.map((indicator, i) => (
              <motion.div
                key={indicator.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <indicator.icon className="h-4 w-4 text-indigo-200" />
                  <span className="text-xl font-bold">{indicator.number}</span>
                </div>
                <span className="text-indigo-200 text-sm">{indicator.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div
        className="container mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">
            Start Your Zimbabwe Adventure
          </h2>
          <p className="text-indigo-600/80 max-w-2xl mx-auto">
            Choose how you'd like to explore Zimbabwe's beauty and culture
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={action.onClick}
              className="cursor-pointer group"
            >
              <Card className="overflow-hidden border-indigo-100 hover:shadow-lg transition-all duration-300 h-full relative">
                {action.badge && (
                  <Badge className="absolute top-3 right-3 z-10 bg-amber-500 text-white">
                    {action.badge}
                  </Badge>
                )}
                <CardHeader className={`bg-gradient-to-r ${action.gradient} text-white p-6`}>
                  <div className="rounded-full bg-white/20 w-10 h-10 flex items-center justify-center mb-3">
                    <action.icon size={20} />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 pb-4">
                  <CardDescription className="text-gray-600 mb-3">
                    {action.description}
                  </CardDescription>
                  <div className="flex items-center text-indigo-600 font-medium">
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Popular Content */}
      <motion.div 
        className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-indigo-50/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">
            Trending in Zimbabwe
          </h2>
          <p className="text-indigo-600/80 max-w-2xl mx-auto">
            Discover the most popular destinations and experiences
          </p>
        </div>
        
        <Tabs defaultValue="destinations" className="mb-8" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white shadow-lg border border-indigo-100 rounded-full p-1">
              <TabsTrigger 
                value="destinations" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-full px-6 py-3"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Destinations
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-full px-6 py-3"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Experiences
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="destinations">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination, i) => (
                  <motion.div 
                    key={destination.id} 
                    className="cursor-pointer"
                    onClick={() => handleCardClick(destination, 'destination')}
                    custom={i}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <DestinationCard 
                      destination={destination}
                      className="hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden bg-white border border-indigo-100" 
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, i) => (
                  <motion.div 
                    key={event.id} 
                    className="cursor-pointer"
                    onClick={() => handleCardClick(event, 'event')}
                    custom={i}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <EventCard 
                      event={event}
                      className="hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden bg-white border border-indigo-100"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-10">
          <Button 
            onClick={handleExploreMore}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-lg"
          >
            <span>Explore All {activeTab === 'destinations' ? 'Destinations' : 'Experiences'}</span>
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </motion.div>
      
      {/* Why Visit Zimbabwe */}
      <WhyZimbabwe />
      
      {/* Testimonials */}
      <TestimonialSlider />
      
      {/* Final CTA */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              ✨ Start Your Adventure Today
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready for Your
              <span className="block text-amber-300">Zimbabwe Adventure?</span>
            </h2>
            
            <p className="mb-10 text-xl text-white/90 max-w-2xl mx-auto">
              {isLoggedIn 
                ? "Your dashboard is ready! Explore more destinations and start planning your perfect Zimbabwe experience." 
                : "Join thousands of travelers who have discovered Zimbabwe's magic. Create your account and unlock personalized recommendations."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={handleStartPlanning}
                className="bg-white text-indigo-600 hover:bg-gray-50 text-lg px-8 py-4 rounded-full shadow-lg font-semibold"
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
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full"
                onClick={handleBrowseExperiences}
              >
                <Eye className="h-5 w-5 mr-2" />
                Browse Experiences
              </Button>
            </div>
            
            <div className="mt-8 text-white/70 text-sm">
              <p>✓ Free to start • ✓ No hidden fees • ✓ Expert local guides</p>
            </div>
          </div>
        </div>
      </motion.section>
      
      <Footer />
      <AiAssistant />
    </div>
  );
};

export default Index;
