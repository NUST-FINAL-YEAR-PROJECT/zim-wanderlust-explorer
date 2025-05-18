
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar, X, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { searchDestinations } from "@/models/Destination";
import { searchEvents } from "@/models/Event";
import { toast } from "@/components/ui/use-toast";

const HeroSearchBar = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(""); 
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error("Error loading recent searches", e);
        setRecentSearches([]);
      }
    }
  }, []);

  // Handle clicks outside search results container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search function with debounce
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeTab]);

  const performSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const results = activeTab === "destinations" 
        ? await searchDestinations(searchTerm)
        : await searchEvents(searchTerm);
      
      setSearchResults(results.slice(0, 5)); // Limit to 5 results
      setShowResults(true);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [
      term, 
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5); // Keep only 5 recent searches
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
    toast({
      title: "Search history cleared",
      description: "Your recent searches have been cleared"
    });
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Type something to search for destinations or events"
      });
      return;
    }
    
    saveRecentSearch(searchTerm);
    
    const searchParams = new URLSearchParams();
    searchParams.set('search', searchTerm);
    searchParams.set('tab', activeTab);
    
    if (selectedDate) {
      searchParams.set('date', selectedDate);
    }
    
    navigate(`/browse?${searchParams.toString()}`);
  };

  const handleResultClick = (result: any) => {
    saveRecentSearch(result.name);
    
    if (activeTab === "destinations") {
      navigate(`/destination/${result.id}/details`);
    } else {
      navigate(`/booking/event/${result.id}`);
    }
    
    setShowResults(false);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    performSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Box with Tabs */}
      <motion.div 
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-2 bg-white/20">
            <TabsTrigger 
              value="destinations" 
              className="flex-1 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Destinations
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex-1 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Experiences
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input and Button */}
        <div className="flex mt-2 gap-2">
          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-white" />
              <Input
                type="text"
                placeholder={activeTab === "destinations" 
                  ? "Where do you want to explore?" 
                  : "What experience are you looking for?"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchTerm.trim() && searchResults.length > 0) {
                    setShowResults(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                className="pl-10 py-6 text-white placeholder:text-white/70 bg-white/10 border-white/20 focus:border-white/40 rounded-lg w-full"
              />
              {searchTerm && (
                <button 
                  className="absolute right-3" 
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                    setShowResults(false);
                  }}
                >
                  <X size={18} className="text-white/70 hover:text-white" />
                </button>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6"
          >
            Search
          </Button>
        </div>

        {/* Date selection for events */}
        <AnimatePresence>
          {activeTab === "events" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white/10 border-white/20 text-white py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <span className="text-white/80 text-sm">Select date (optional)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search Results & Recent Searches */}
      <AnimatePresence>
        {showResults && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-indigo-100 max-h-80 overflow-y-auto z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-700 mx-auto"></div>
                <p className="mt-2 text-indigo-900">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-2">
                <p className="text-xs font-medium text-indigo-700 px-2 py-1">
                  Search Results
                </p>
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.id}-${index}`}
                    className="hover:bg-indigo-50 rounded-lg p-2 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <p className="font-medium text-indigo-900">{result.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {activeTab === "destinations" ? result.location : result.date}
                    </p>
                  </div>
                ))}
                <div className="border-t border-indigo-100 mt-2 pt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50"
                    onClick={handleSearch}
                  >
                    <span>See all results for "{searchTerm}"</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            ) : searchTerm.trim() ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">No results found</p>
                <p className="text-sm text-gray-400">Try a different search term</p>
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="p-2">
                <div className="flex justify-between items-center px-2 py-1">
                  <p className="text-xs font-medium text-indigo-700">Recent Searches</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto text-xs text-gray-500 hover:text-gray-700 p-1"
                    onClick={clearRecentSearches}
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.map((term, index) => (
                  <div
                    key={`recent-${index}`}
                    className="flex items-center hover:bg-indigo-50 rounded-lg p-2 cursor-pointer transition-colors"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    <Search size={14} className="text-gray-400 mr-2" />
                    <span className="text-gray-800">{term}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Popular Searches Badges */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {["Victoria Falls", "Safari", "National Parks", "Great Zimbabwe", "Wildlife"].map((term) => (
          <Badge
            key={term}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 cursor-pointer text-white border-white/10"
            onClick={() => {
              setSearchTerm(term);
              performSearch();
            }}
          >
            {term}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default HeroSearchBar;
