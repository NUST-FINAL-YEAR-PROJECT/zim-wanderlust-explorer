
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { searchDestinations } from "@/models/Destination";
import { searchEvents } from "@/models/Event";

const HeroSearchBar = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const categories = [
    "National Parks", "Historical Sites", "Adventure", "Cultural", "Wildlife", "Relaxation"
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches);
        if (Array.isArray(parsedSearches)) {
          setRecentSearches(parsedSearches.slice(0, 3));
        }
      } catch (error) {
        console.error("Error parsing recent searches:", error);
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updatedSearches);
    
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };
  
  // Quick search functionality
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = activeTab === "destinations" 
          ? await searchDestinations(query) 
          : await searchEvents(query);
        
        setSearchResults(results.slice(0, 5));
        setShowResults(results.length > 0);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Enter a destination or experience you're looking for",
      });
      return;
    }
    
    saveRecentSearch(query);
    
    const params = new URLSearchParams();
    params.append('search', query);
    params.append('tab', activeTab);
    
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());
    }
    
    if (selectedCategories.length > 0) {
      params.append('categories', selectedCategories.join(','));
    }
    
    navigate(`/browse?${params.toString()}`);
  };

  const handleResultClick = (result: any) => {
    if (activeTab === "destinations") {
      navigate(`/destination/${result.id}/details`);
    } else {
      navigate(`/booking/event/${result.id}`);
    }
    setShowResults(false);
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto" ref={searchRef}>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full mb-4"
      >
        <TabsList className="w-full justify-start bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
          <TabsTrigger 
            value="destinations" 
            className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md m-1 transition-all duration-300"
          >
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Destinations</span>
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md m-1 transition-all duration-300"
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Experiences</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2 relative">
        <div className="relative flex-1 bg-white rounded-lg overflow-hidden shadow-md">
          <div className="flex items-center">
            <Search className="ml-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "destinations" ? "Where do you want to go?" : "What do you want to experience?"}
              className="w-full py-4 px-4 outline-none text-gray-800 placeholder-gray-500 text-lg bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {query && (
              <button 
                className="mr-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setQuery("")}
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                </svg>
              </button>
            )}
          </div>
          
          {showResults && (
            <motion.div 
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto border border-gray-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                    {isSearching ? 'Searching...' : `Results for "${query}"`}
                  </h3>
                  <button
                    className="text-xs text-indigo-600 hover:underline"
                    onClick={() => setShowResults(false)}
                  >
                    Close
                  </button>
                </div>
                
                <div className="space-y-3">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-2 bg-slate-200 rounded"></div>
                          <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((result, index) => (
                        <motion.div 
                          key={`${activeTab}-${result.id}`}
                          className="p-2 hover:bg-indigo-50 rounded-lg cursor-pointer flex items-center"
                          onClick={() => handleResultClick(result)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div 
                            className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0 bg-indigo-100"
                            style={result.image_url ? {
                              backgroundImage: `url(${result.image_url})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            } : {}}
                          ></div>
                          <div className="flex-grow">
                            <p className="font-medium">{result.name || result.title}</p>
                            <p className="text-sm text-gray-500">
                              {activeTab === "destinations" ? result.location : result.event_type || 'Event'}
                            </p>
                          </div>
                          <Badge 
                            className={`ml-2 ${activeTab === "destinations" ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}
                            variant="outline"
                          >
                            {activeTab === "destinations" ? 'Place' : 'Event'}
                          </Badge>
                        </motion.div>
                      ))}
                      <div className="text-center pt-2 border-t">
                        <Button 
                          variant="link" 
                          onClick={handleSearch}
                          className="text-indigo-600"
                        >
                          See all results
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No results match your search
                    </div>
                  )}
                </div>
              </div>
              
              {recentSearches.length > 0 && !isSearching && searchResults.length === 0 && (
                <div className="border-t px-4 py-3">
                  <h3 className="font-medium text-gray-500 text-xs uppercase tracking-wider mb-2">
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline" 
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => setQuery(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white border-indigo-100 hover:border-indigo-300 rounded-lg p-4 h-auto"
            >
              <Filter className="h-5 w-5 text-indigo-700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-6 rounded-xl shadow-lg border-indigo-100">
            <div className="space-y-6">
              <div>
                <h4 className="font-display font-medium mb-3 text-gray-800">Price Range</h4>
                <div className="px-2">
                  <Slider 
                    defaultValue={[0, 1000]} 
                    max={1000} 
                    step={10} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6" 
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-display font-medium mb-3 text-gray-800">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge 
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1 ${
                        selectedCategories.includes(category) 
                          ? "bg-indigo-600 hover:bg-indigo-700" 
                          : "hover:border-indigo-300"
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  setShowFilters(false);
                  handleSearch();
                }}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-[52px] rounded-lg shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all duration-300"
        >
          <Search className="h-5 w-5" />
          <span className="ml-2 hidden md:inline">Search</span>
        </Button>
      </div>
    </div>
  );
};

export default HeroSearchBar;
