
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
import DestinationCategories from "@/components/DestinationCategories";

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
          // Using Promise.all to fetch data in parallel
          const [destinationResults, eventResults] = await Promise.all([
            searchDestinations(searchQuery),
            searchEvents(searchQuery)
          ]);
          
          setDestinations(destinationResults);
          setEvents(eventResults);
          
          // Auto-switch to the tab with more results
          if (destinationResults.length === 0 && eventResults.length > 0) {
            setActiveTab("events");
          } else if (eventResults.length === 0 && destinationResults.length > 0) {
            setActiveTab("destinations");
          }
        } else if (category) {
          // If category filter is applied, fetch only destinations
          const destinationResults = await getDestinations();
          const filteredDestinations = destinationResults.filter(
            dest => dest.categories && dest.categories.includes(category)
          );
          setDestinations(filteredDestinations);
          
          // For events, just load all since we don't have category filtering for them
          const eventResults = await getEvents();
          setEvents(eventResults);
          
          // Auto-switch to destinations tab when filtering by category
          setActiveTab("destinations");
        } else {
          // Default: load all data
          const [destinationResults, eventResults] = await Promise.all([
            getDestinations(),
            getEvents()
          ]);
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
  }, [searchQuery, category]);
  
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
  
  const getResultsCount = () => {
    return activeTab === "destinations" ? destinations.length : events.length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-sky-50">
      <div className="bg-white py-8 px-4 border-b shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-900">Explore Zimbabwe</h1>
          <SearchBar onSearch={handleSearch} />
          
          {searchQuery && (
            <div className="mt-4 text-lg">
              <span className="font-medium">Results for: </span>
              <span className="text-indigo-700">"{searchQuery}"</span>
              <span className="text-gray-500 ml-2">({getResultsCount()} found)</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <DestinationCategories />
      </div>
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="w-full justify-start space-x-10 rounded-none bg-transparent h-auto mb-6 px-0 border-b">
              <TabsTrigger 
                value="destinations"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0"
              >
                Places to stay ({destinations.length})
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-0"
              >
                Experiences ({events.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="destinations" className="space-y-6 animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : destinations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-indigo-100">
                <h3 className="text-xl font-medium mb-2">No destinations found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search query or browsing our categories</p>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setSearchQuery("")}
                >
                  View All Destinations
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {destinations.map(destination => (
                  <DestinationCard 
                    key={destination.id} 
                    destination={destination} 
                    className="hover:shadow-lg transition-all duration-300 bg-white border border-indigo-100 rounded-xl overflow-hidden transform hover:scale-105"
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6 animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-indigo-100">
                <h3 className="text-xl font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search query</p>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setSearchQuery("")}
                >
                  View All Events
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                    className="hover:shadow-lg transition-all duration-300 bg-white border border-indigo-100 rounded-xl overflow-hidden transform hover:scale-105"
                  />
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
