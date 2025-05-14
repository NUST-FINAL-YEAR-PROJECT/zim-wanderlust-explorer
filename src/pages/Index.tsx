
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import DestinationCard from "@/components/DestinationCard";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import { Destination } from "@/models/Destination";
import { Event } from "@/models/Event";
import { getDestinations } from "@/models/Destination";
import { getEvents } from "@/models/Event";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCounter from "@/components/StatsCounter";
import TestimonialSlider from "@/components/TestimonialSlider";
import WhyZimbabwe from "@/components/WhyZimbabwe";
import MapExplorer from "@/components/MapExplorer";
import AiAssistant from "@/components/AiAssistant";

const Index = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Fetch data from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const destinationsData = await getDestinations();
        const eventsData = await getEvents();
        
        // Take just the first 6 for the preview
        setDestinations(destinationsData.slice(0, 6));
        setEvents(eventsData.slice(0, 6));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleExploreMore = () => {
    navigate(`/browse?tab=${activeTab}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeroCarousel />
      
      <StatsCounter />
      
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-2">Popular Destinations & Events</h2>
          <p className="text-center text-muted-foreground mb-8">Explore our handpicked experiences in Zimbabwe</p>
          
          <Tabs defaultValue="destinations" className="mb-12" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-amber-50">
                <TabsTrigger 
                  value="destinations" 
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white px-6 py-3 text-lg"
                >
                  Top Attractions
                </TabsTrigger>
                <TabsTrigger 
                  value="events"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white px-6 py-3 text-lg"
                >
                  Upcoming Events
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="destinations" className="space-y-8 animate-fade-in">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((destination) => (
                      <DestinationCard 
                        key={destination.id} 
                        destination={destination}
                        className="hover:translate-y-[-5px] transition-all duration-300" 
                      />
                    ))}
                  </div>
                  <div className="flex justify-center mt-8">
                    <Button 
                      className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6"
                      onClick={handleExploreMore}
                    >
                      View All Destinations
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="events" className="space-y-8 animate-fade-in">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center mt-8">
                    <Button 
                      className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6"
                      onClick={handleExploreMore}
                    >
                      View All Events
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <WhyZimbabwe />
      
      <MapExplorer />
      
      <TestimonialSlider />
      
      <section className="py-16 bg-cover bg-center relative" style={{ backgroundImage: "url('/hero.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Zimbabwe Adventure?</h2>
            <p className="mb-8 text-lg text-white/90">
              Create an account to book your perfect trip, save favorites, and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-green-700 hover:bg-green-800 text-white text-lg px-10 py-6"
                onClick={() => navigate("/auth")}
              >
                Start Planning Now
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 text-lg px-10 py-6"
                onClick={() => navigate("/browse")}
              >
                Browse Experiences
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      <AiAssistant />
    </div>
  );
};

export default Index;
