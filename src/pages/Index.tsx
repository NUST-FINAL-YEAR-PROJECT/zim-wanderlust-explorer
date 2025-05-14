
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
import DestinationCategories from "@/components/DestinationCategories";
import { Globe } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import AiAssistant from "@/components/AiAssistant";

const Index = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [destinations, setDestinations] = useState<any[]>([]);
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
        
        // Take just the first 4 for the preview
        setDestinations(destinationsData.slice(0, 4));
        setEvents(eventsData.slice(0, 4));
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Carousel - Main visual element */}
      <HeroCarousel />
      
      {/* Categories Section */}
      <div className="py-12 container mx-auto px-4">
        <DestinationCategories />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Popular in Zimbabwe</h2>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 rounded-full border-gray-300 hover:bg-gray-50"
              onClick={handleExploreMore}
            >
              <span>Show all</span>
            </Button>
          </div>
          
          <Tabs defaultValue="destinations" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start space-x-10 rounded-none bg-transparent h-auto mb-6 px-0">
              <TabsTrigger 
                value="destinations" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0"
              >
                Destinations
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0"
              >
                Experiences
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="destinations" className="animate-fade-in">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="border rounded-lg overflow-hidden">
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
                  {destinations.map((destination) => (
                    <DestinationCard 
                      key={destination.id} 
                      destination={destination}
                      className="hover:shadow-md transition-all duration-300" 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="events" className="animate-fade-in">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="border rounded-lg overflow-hidden">
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
                  {events.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Inspiration Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold mb-10">Inspiration for your trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative rounded-2xl overflow-hidden h-72 group">
            <img src="/victoria-falls.jpg" alt="Victoria Falls" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold">Natural Wonders</h3>
              <p className="mt-2">Experience breathtaking landscapes</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-72 group">
            <img src="/traditional.jpg" alt="Cultural Experiences" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold">Cultural Immersion</h3>
              <p className="mt-2">Connect with local traditions</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-72 group">
            <img src="/hwange.jpg" alt="Wildlife Safari" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold">Wildlife Safari</h3>
              <p className="mt-2">Encounter majestic animals</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="py-16 bg-cover bg-center relative" style={{ backgroundImage: "url('/hero.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Zimbabwe Adventure?</h2>
            <p className="mb-8 text-lg text-white/90">
              Create an account to save your favorites and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-6 rounded-xl"
                onClick={() => navigate("/auth")}
              >
                Start Planning
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl"
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
