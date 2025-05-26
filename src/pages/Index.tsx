
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
import StatsCounter from "@/components/StatsCounter";
import { Calendar, CalendarDays, ChevronRight, Compass, Heart, Info, MapPin, Search, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import FeaturedSection from "@/components/FeaturedSection";
import HeroCarousel from "@/components/HeroCarousel";
import MapExplorer from "@/components/MapExplorer";
import WhyZimbabwe from "@/components/WhyZimbabwe";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        
        // Take just the first 4 for the preview
        setDestinations(destinationsData.slice(0, 4));
        setEvents(eventsData.slice(0, 4));
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

  // Quick action cards
  const quickActions = [
    {
      title: "Find Destinations",
      description: "Discover amazing places to visit in Zimbabwe",
      icon: MapPin,
      color: "from-indigo-500 to-indigo-600",
      onClick: () => navigate("/destinations")
    },
    {
      title: "Upcoming Events",
      description: "Check out events happening around you",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      onClick: () => navigate("/events")
    },
    {
      title: "Plan Your Trip",
      description: "Create a custom itinerary for your visit",
      icon: Compass,
      color: "from-emerald-500 to-emerald-600",
      onClick: () => navigate("/itineraries/create")
    },
    {
      title: "Save Favorites",
      description: "Keep track of places you want to visit",
      icon: Heart,
      color: "from-rose-500 to-rose-600",
      onClick: () => navigate("/wishlist")
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Carousel with enhanced search functionality */}
      <HeroCarousel />
      
      {/* Quick Actions Section */}
      <motion.div
        className="container mx-auto px-4 py-12 -mt-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={action.onClick}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden border-indigo-100 hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader className={`bg-gradient-to-r ${action.color} text-white p-4`}>
                  <div className="rounded-full bg-white/20 w-10 h-10 flex items-center justify-center mb-2">
                    <action.icon size={20} />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Featured Experiences Section */}
      <FeaturedSection />
      
      {/* Popular Destinations/Events Section */}
      <motion.div 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-display font-bold text-indigo-900">Popular in Zimbabwe</h2>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 rounded-xl border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700"
              onClick={handleExploreMore}
            >
              <span>Show all</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs defaultValue="destinations" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start space-x-10 rounded-none bg-transparent h-auto mb-8 px-0">
              <TabsTrigger 
                value="destinations" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0 text-indigo-500"
              >
                Destinations
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0 text-indigo-500"
              >
                Experiences
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="destinations" className="animate-fade-in">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-xl overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {destinations.map((destination, i) => (
                    <motion.div 
                      key={destination.id} 
                      className="cursor-pointer"
                      onClick={() => handleCardClick(destination, 'destination')}
                      custom={i}
                      variants={cardVariants}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                      <DestinationCard 
                        destination={destination}
                        className="hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden bg-white border border-indigo-100 hover:border-indigo-200" 
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="events" className="animate-fade-in">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-xl overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {events.map((event, i) => (
                    <motion.div 
                      key={event.id} 
                      className="cursor-pointer"
                      onClick={() => handleCardClick(event, 'event')}
                      custom={i}
                      variants={cardVariants}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                      <EventCard 
                        event={event}
                        className="hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden bg-white border border-indigo-100 hover:border-indigo-200"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
      
      {/* Travel Categories Section */}
      <motion.div
        className="bg-indigo-50/50 dark:bg-indigo-900/30 py-16"
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center text-indigo-900 dark:text-indigo-100 mb-3">Explore by Category</h2>
          <p className="text-indigo-600/80 dark:text-indigo-300 text-center max-w-2xl mx-auto mb-10">Find the perfect Zimbabwe experience that matches your interests</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Wildlife Safaris", icon: <img src="/lovable-uploads/1ade5812-07e4-42d2-910d-e4aeb007e0db.png" alt="Wildlife" className="w-10 h-10 object-cover" />, color: "bg-amber-100 dark:bg-amber-900/30" },
              { name: "Cultural Tours", icon: <img src="/lovable-uploads/4d89aba9-e022-4e41-95ec-7b887bfbd453.png" alt="Culture" className="w-10 h-10 object-cover" />, color: "bg-purple-100 dark:bg-purple-900/30" },
              { name: "Adventure", icon: <img src="/lovable-uploads/6bfb6348-89bd-42b4-b8ea-b77d0d3bb6c8.png" alt="Adventure" className="w-10 h-10 object-cover" />, color: "bg-emerald-100 dark:bg-emerald-900/30" },
              { name: "Festivals", icon: <Ticket className="w-10 h-10 text-rose-500" />, color: "bg-rose-100 dark:bg-rose-900/30" },
              { name: "Historical Sites", icon: <Info className="w-10 h-10 text-blue-500" />, color: "bg-blue-100 dark:bg-blue-900/30" },
              { name: "Nature Reserves", icon: <MapPin className="w-10 h-10 text-green-500" />, color: "bg-green-100 dark:bg-green-900/30" },
              { name: "Photography Tours", icon: <Search className="w-10 h-10 text-indigo-500" />, color: "bg-indigo-100 dark:bg-indigo-900/30" },
              { name: "Seasonal Events", icon: <CalendarDays className="w-10 h-10 text-orange-500" />, color: "bg-orange-100 dark:bg-orange-900/30" },
            ].map((category, i) => (
              <motion.div
                key={category.name}
                custom={i}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.2 } }}
                className="cursor-pointer"
                onClick={() => navigate(`/browse?category=${encodeURIComponent(category.name)}`)}
              >
                <div className={`${category.color} rounded-xl p-4 h-full flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300`}>
                  <div className="mb-3 flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-indigo-900 dark:text-indigo-100">{category.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Why Visit Zimbabwe Section */}
      <WhyZimbabwe />
      
      {/* Map Explorer */}
      <MapExplorer />
      
      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-cover bg-center relative" 
        style={{ backgroundImage: "linear-gradient(rgba(79, 70, 229, 0.85), rgba(67, 56, 202, 0.9)), url('/lovable-uploads/6d4e39d4-1981-4237-afb7-a1a7afe47fb3.png')" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <motion.h2 
              className="text-3xl md:text-5xl font-display font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Ready for Your Zimbabwe Adventure?
            </motion.h2>
            <motion.p 
              className="mb-10 text-xl text-white/90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {isLoggedIn 
                ? "Explore more destinations and start planning your trip today!" 
                : "Create an account to save your favorites and get personalized recommendations."}
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="gradient"
                  onClick={handleStartPlanning}
                  className="text-lg px-8 py-6 rounded-xl shadow-lg"
                >
                  {isLoggedIn ? "Go to Dashboard" : "Start Planning"}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl"
                  onClick={handleBrowseExperiences}
                >
                  Browse Experiences
                </Button>
              </motion.div>
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
