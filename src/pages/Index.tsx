
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import DestinationCard from "@/components/DestinationCard";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import { Destination } from "@/models/Destination";
import { Event } from "@/models/Event";
import { getDestinations } from "@/models/Destination";
import { getEvents } from "@/models/Event";
import { Skeleton } from "@/components/ui/skeleton";

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
        
        // Take just the first 3 for the preview
        setDestinations(destinationsData.slice(0, 3));
        setEvents(eventsData.slice(0, 3));
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
      <Hero />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-2">Discover Zimbabwe</h2>
          <p className="text-center text-muted-foreground mb-8">Explore our handpicked destinations and upcoming events</p>
          
          <Tabs defaultValue="destinations" className="mb-12" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-amber-50">
                <TabsTrigger 
                  value="destinations" 
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                >
                  Featured Destinations
                </TabsTrigger>
                <TabsTrigger 
                  value="events"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                >
                  Upcoming Events
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="destinations" className="space-y-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(i => (
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
                      <DestinationCard key={destination.id} destination={destination} />
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
            
            <TabsContent value="events" className="space-y-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(i => (
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
                      <EventCard key={event.id} event={event} />
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
        
        <section className="bg-amber-50 p-6 md:p-10 rounded-xl border border-amber-100 mb-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Zimbabwe Adventure?</h2>
            <p className="text-muted-foreground mb-6">
              Create an account to book your perfect trip, save favorites, and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => navigate("/auth")}
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outline" 
                className="border-green-700 text-green-700 hover:bg-green-50"
                onClick={() => navigate("/auth?mode=login")}
              >
                Already a Member? Log In
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
