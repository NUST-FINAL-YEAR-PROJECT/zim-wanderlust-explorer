
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, X, Filter, Clock, TrendingUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { searchDestinations } from "@/models/Destination";
import { searchEvents } from "@/models/Event";
import { toast } from "@/hooks/use-toast";

const EnhancedSearchBar = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const categories = [
    "National Parks", "Historical Sites", "Adventure", "Cultural", "Wildlife", "Relaxation"
  ];

  const popularSearches = [
    "Victoria Falls", "Hwange National Park", "Great Zimbabwe", "Mana Pools", "Matobo Hills"
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
      } catch (error) {
        console.error("Error parsing recent searches:", error);
      }
    }
  }, []);

  // Handle clicks outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search with debounce
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
      
      setSearchResults(results.slice(0, 8));
      setShowResults(true);
    } catch (error) {
      console.error("Error searching:", error);
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
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
    
    const params = new URLSearchParams();
    params.append('search', searchTerm);
    params.append('tab', activeTab);
    
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());
    }
    
    if (selectedCategories.length > 0) {
      params.append('categories', selectedCategories.join(','));
    }
    
    navigate(`/browse?${params.toString()}`);
    setShowResults(false);
  };

  const handleResultClick = (result: any) => {
    saveRecentSearch(result.name || result.title);
    
    if (activeTab === "destinations") {
      navigate(`/destination/${result.id}/details`);
    } else {
      navigate(`/booking/event/${result.id}`);
    }
    
    setShowResults(false);
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchTerm(term);
    saveRecentSearch(term);
    
    const params = new URLSearchParams();
    params.append('search', term);
    params.append('tab', activeTab);
    
    navigate(`/browse?${params.toString()}`);
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto" ref={searchRef}>
      <motion.div 
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
          <TabsList className="w-full bg-white/20 backdrop-blur-sm">
            <TabsTrigger 
              value="destinations" 
              className="flex-1 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Destinations
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex-1 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Experiences
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input with Filters */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-white/70" />
              <Input
                type="text"
                placeholder={activeTab === "destinations" 
                  ? "Search destinations, cities, or attractions..." 
                  : "Search experiences, events, or activities..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if ((searchTerm.trim() && searchResults.length > 0) || recentSearches.length > 0) {
                    setShowResults(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-10 py-4 text-white placeholder:text-white/70 bg-white/10 border-white/20 focus:border-white/40 rounded-xl text-lg"
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
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl px-4 py-4"
              >
                <Filter className="h-5 w-5" />
                {selectedCategories.length > 0 && (
                  <Badge className="ml-2 bg-indigo-600 text-white">
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6 rounded-xl shadow-xl bg-white/95 backdrop-blur-lg border-white/20">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-gray-800">Price Range</h4>
                  <Slider 
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000} 
                    step={10} 
                    className="my-4" 
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-gray-800">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge 
                        key={category}
                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                        className={`cursor-pointer ${
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
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-4 text-lg shadow-lg"
          >
            Search
          </Button>
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-white/70 text-sm mr-2">Popular:</span>
          {popularSearches.map((term) => (
            <Badge
              key={term}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 cursor-pointer text-white border-white/10 transition-all duration-200"
              onClick={() => handlePopularSearchClick(term)}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {term}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className="text-indigo-900">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-indigo-900">
                    {searchResults.length} {activeTab} found
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearch}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={`${result.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 border-indigo-100 hover:border-indigo-300"
                        onClick={() => handleResultClick(result)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg text-indigo-900">
                                {result.name || result.title}
                              </CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {result.location}
                              </CardDescription>
                            </div>
                            {result.price && (
                              <Badge className="bg-emerald-100 text-emerald-800">
                                ${result.price}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        {result.description && (
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {result.description}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : searchTerm.trim() ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-2">No results found for "{searchTerm}"</p>
                <p className="text-sm text-gray-400 mb-4">Try adjusting your search terms or filters</p>
                <Button
                  variant="outline"
                  onClick={handleSearch}
                  className="text-indigo-600 border-indigo-200"
                >
                  Search Anyway
                </Button>
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="p-4">
                <h3 className="font-semibold text-indigo-900 mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((term, index) => (
                    <div
                      key={`recent-${index}`}
                      className="flex items-center hover:bg-indigo-50 rounded-lg p-2 cursor-pointer transition-colors"
                      onClick={() => handlePopularSearchClick(term)}
                    >
                      <Search size={14} className="text-gray-400 mr-3" />
                      <span className="text-gray-800">{term}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;
