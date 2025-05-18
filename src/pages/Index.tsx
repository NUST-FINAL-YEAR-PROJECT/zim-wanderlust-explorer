
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
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import FeaturedSection from "@/components/FeaturedSection";
import HeroCarousel from "@/components/HeroCarousel";
import MapExplorer from "@/components/MapExplorer";
import WhyZimbabwe from "@/components/WhyZimbabwe";

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Carousel */}
      <HeroCarousel />
      
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
      
      {/* Why Visit Zimbabwe Section */}
      <WhyZimbabwe />
      
      {/* Map Explorer */}
      <MapExplorer />
      
      {/* Stats Counter Section */}
      <StatsCounter />
      
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
                  className="bg-white hover:bg-gray-100 text-indigo-700 text-lg px-8 py-6 rounded-xl shadow-lg"
                  onClick={handleStartPlanning}
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
