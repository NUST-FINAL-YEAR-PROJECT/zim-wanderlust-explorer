
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
import StatsCounter from "@/components/StatsCounter";

const Index = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [destinations, setDestinations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
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
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleExploreMore = () => {
    navigate(`/browse?tab=${activeTab}`);
  };

  const features = [
    {
      title: "Diverse Landscapes",
      description: "From cascading waterfalls to expansive savannahs and majestic mountains",
      image: "/nyanga.jpg"
    },
    {
      title: "Rich Cultural Heritage",
      description: "Experience traditions and history dating back thousands of years",
      image: "/great-zimbabwe.jpg"
    },
    {
      title: "Incredible Wildlife",
      description: "Home to the Big Five and over 350 bird species in pristine habitats",
      image: "/hwange.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F0FB]">
      {/* Hero Carousel */}
      <HeroCarousel />
      
      {/* Categories Section */}
      <div className="py-16 container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-800">Discover Zimbabwe</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our curated categories and find your perfect destination
          </p>
        </div>
        <DestinationCategories />
      </div>
      
      {/* Stats Counter Section */}
      <StatsCounter />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-800">Why Visit Zimbabwe?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the magic of one of Africa's most beautiful destinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white border border-gray-100">
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Destinations/Events Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-display font-bold text-gray-800">Popular in Zimbabwe</h2>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 rounded-xl border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
              onClick={handleExploreMore}
            >
              <span>Show all</span>
            </Button>
          </div>
          
          <Tabs defaultValue="destinations" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start space-x-10 rounded-none bg-transparent h-auto mb-8 px-0">
              <TabsTrigger 
                value="destinations" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0 text-gray-600"
              >
                Destinations
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0 text-gray-600"
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
                  {destinations.map((destination) => (
                    <DestinationCard 
                      key={destination.id} 
                      destination={destination}
                      className="hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden" 
                    />
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
                  {events.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      className="hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="py-20 bg-cover bg-center relative" style={{ backgroundImage: "url('/hero.jpg')" }}>
        <div className="absolute inset-0 bg-indigo-900/70 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready for Your Zimbabwe Adventure?</h2>
            <p className="mb-10 text-xl text-white/90">
              Create an account to save your favorites and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white hover:bg-gray-100 text-indigo-700 text-lg px-8 py-6 rounded-xl shadow-lg"
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
