
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
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Calendar, MapPin, Grid, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "destinations";
  const initialSearch = searchParams.get("search") || "";
  const category = searchParams.get("category");
  const selectedDate = searchParams.get("date");
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"popular" | "price-low" | "price-high">("popular");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  const filterOptions = [
    "Family Friendly", 
    "Adventure", 
    "Cultural", 
    "Nature", 
    "Luxury", 
    "Budget"
  ];
  
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
  }, [searchQuery, category, selectedDate]);
  
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

  const handleSortChange = (sort: "popular" | "price-low" | "price-high") => {
    setSortOrder(sort);
    
    // Sort the destinations/events based on the selected sort order
    if (activeTab === "destinations") {
      const sortedDestinations = [...destinations].sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        return b.rating - a.rating; // Default popular sort
      });
      setDestinations(sortedDestinations);
    } else {
      const sortedEvents = [...events].sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        return b.attendees - a.attendees; // Default popular sort
      });
      setEvents(sortedEvents);
    }
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getSortLabel = () => {
    switch(sortOrder) {
      case "popular": return "Most Popular";
      case "price-low": return "Price: Low to High";
      case "price-high": return "Price: High to Low";
      default: return "Sort";
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.1 * (i % 8) // Reset delay after 8 items for better performance
      }
    })
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-gradient-to-b from-white to-sky-50"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Enhanced Header */}
      <div className="bg-indigo-800 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold mb-2 text-white">Explore Zimbabwe</h1>
              <p className="text-indigo-100 mb-4">Discover the beauty, culture and adventure of Zimbabwe</p>
            </div>
            <div className="w-full lg:w-2/3">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          
          {searchQuery && (
            <div className="mt-4 text-lg text-white">
              <span className="font-medium">Results for: </span>
              <span className="text-indigo-200">"{searchQuery}"</span>
              <span className="text-indigo-300 ml-2">({getResultsCount()} found)</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <DestinationCategories />
      </div>
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <TabsList className="justify-start space-x-2 rounded-lg bg-indigo-50 p-1 mb-4 md:mb-0">
              <TabsTrigger 
                value="destinations"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Places to stay ({destinations.length})
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Experiences ({events.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Sorting and Filtering */}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    {getSortLabel()}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === "popular"}
                    onCheckedChange={() => handleSortChange("popular")}
                  >
                    Most Popular
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === "price-low"}
                    onCheckedChange={() => handleSortChange("price-low")}
                  >
                    Price: Low to High
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === "price-high"}
                    onCheckedChange={() => handleSortChange("price-high")}
                  >
                    Price: High to Low
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {selectedFilters.length > 0 && (
                  <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedFilters.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {filtersVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                <h3 className="font-medium mb-3">Filter By:</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {filterOptions.map(filter => (
                    <Button
                      key={filter}
                      variant={selectedFilters.includes(filter) ? "default" : "outline"}
                      size="sm"
                      className={selectedFilters.includes(filter) 
                        ? "bg-indigo-600" 
                        : "border-indigo-200 text-indigo-700"}
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedFilters([])}
                  >
                    Clear Filters
                  </Button>
                  
                  <Button 
                    onClick={() => setFiltersVisible(false)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          <TabsContent value="destinations" className="space-y-6 animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-sm border border-indigo-100 bg-white">
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
              <motion.div 
                className="text-center py-12 bg-white rounded-lg shadow-sm border border-indigo-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Search className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No destinations found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search query or browsing our categories</p>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setSearchQuery("")}
                >
                  View All Destinations
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {destinations.map((destination, i) => (
                  <motion.div 
                    key={destination.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <DestinationCard 
                      destination={destination} 
                      className="h-full hover:shadow-lg transition-all duration-300 bg-white border border-indigo-100 rounded-xl overflow-hidden transform hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6 animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-sm border border-indigo-100 bg-white">
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
              <motion.div 
                className="text-center py-12 bg-white rounded-lg shadow-sm border border-indigo-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Calendar className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search query</p>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setSearchQuery("")}
                >
                  View All Events
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event, i) => (
                  <motion.div 
                    key={event.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <EventCard 
                      event={event}
                      className="h-full hover:shadow-lg transition-all duration-300 bg-white border border-indigo-100 rounded-xl overflow-hidden transform hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </motion.div>
  );
};

export default Browse;
