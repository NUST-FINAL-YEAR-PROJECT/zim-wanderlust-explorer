
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import DestinationCard from "@/components/DestinationCard";
import EventCard from "@/components/EventCard";
import { getDestinations, searchDestinations } from "@/models/Destination";
import { getEvents, searchEvents } from "@/models/Event";
import { Skeleton } from "@/components/ui/skeleton";
import DestinationCategories from "@/components/DestinationCategories";
import Navigation from "@/components/Navigation";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "destinations";
  const initialSearch = searchParams.get("search") || "";
  const category = searchParams.get("category");
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const destinationResults = await searchDestinations(searchQuery);
          const eventResults = await searchEvents(searchQuery);
          setDestinations(destinationResults);
          setEvents(eventResults);
        } else {
          const destinationResults = await getDestinations();
          const eventResults = await getEvents();
          setDestinations(destinationResults);
          setEvents(eventResults);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchQuery]);
  
  useEffect(() => {
    // Update URL when tab changes
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("tab", activeTab);
      if (searchQuery) {
        newParams.set("search", searchQuery);
      }
      return newParams;
    });
  }, [activeTab, searchQuery, setSearchParams]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-[url('/nyanga.jpg')] bg-cover bg-center h-64 relative">
        <div className="absolute inset-0 bg-[#004AAD] opacity-75"></div>
        <Navigation />
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Explore Zimbabwe</h1>
          <div className="w-full max-w-xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <DestinationCategories />
      </div>
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="w-full justify-start space-x-10 rounded-none bg-transparent h-auto mb-6 px-0 border-b border-[#004AAD]/20">
              <TabsTrigger 
                value="destinations"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#004AAD] data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0 text-[#004AAD]"
              >
                Places to stay
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#004AAD] data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0 text-[#004AAD]"
              >
                Experiences
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="destinations" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="border border-[#004AAD]/10 rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full bg-[#E6F0FF]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4 bg-[#E6F0FF]" />
                      <Skeleton className="h-4 w-1/2 bg-[#E6F0FF]" />
                      <Skeleton className="h-4 w-full bg-[#E6F0FF]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : destinations.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-[#004AAD]">No destinations found</h3>
                <p className="text-[#004AAD]/70">Try adjusting your search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {destinations.map(destination => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="border border-[#004AAD]/10 rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full bg-[#E6F0FF]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4 bg-[#E6F0FF]" />
                      <Skeleton className="h-4 w-1/2 bg-[#E6F0FF]" />
                      <Skeleton className="h-4 w-full bg-[#E6F0FF]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-[#004AAD]">No events found</h3>
                <p className="text-[#004AAD]/70">Try adjusting your search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Browse;
