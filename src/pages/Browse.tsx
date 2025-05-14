
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import DestinationCard from "@/components/DestinationCard";
import EventCard from "@/components/EventCard";
import { getDestinations, searchDestinations } from "@/models/Destination";
import { getEvents, searchEvents } from "@/models/Event";
import { Skeleton } from "@/components/ui/skeleton";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "destinations";
  const initialSearch = searchParams.get("search") || "";
  
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
    <div className="min-h-screen flex flex-col">
      <div className="bg-green-900 py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Browse Zimbabwe</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-6">
            <TabsList className="bg-green-50">
              <TabsTrigger 
                value="destinations"
                className="data-[state=active]:bg-green-700 data-[state=active]:text-white"
              >
                Destinations
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:bg-green-700 data-[state=active]:text-white"
              >
                Events
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="destinations" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ) : destinations.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">No destinations found</h3>
                <p className="text-muted-foreground">Try adjusting your search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map(destination => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
