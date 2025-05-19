
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { searchDestinations } from "@/models/Destination";
import { searchEvents } from "@/models/Event";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchBar = ({ onSearch, initialValue = "" }: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Update query if initialValue changes
  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
    }
  }, [initialValue]);
  
  const categories = [
    "National Parks", "Historical Sites", "Adventure", "Cultural", "Wildlife", "Relaxation"
  ];
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      // Hide results when submitting search
      setShowResults(false);
      // Directly navigate to browse page with search query
      navigate(`/browse?search=${encodeURIComponent(query)}`);
    }
  };
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Fetch quick search results
  useEffect(() => {
    const fetchQuickResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }
      
      setIsTyping(true);
      
      // Debounce search requests
      const timer = setTimeout(async () => {
        try {
          // Fetch limited results for quick search
          const destinations = await searchDestinations(query);
          const events = await searchEvents(query);
          
          // Combine and limit results
          const combined = [
            ...destinations.slice(0, 3).map(d => ({...d, type: 'destination'})),
            ...events.slice(0, 2).map(e => ({...e, type: 'event'}))
          ].slice(0, 4);
          
          setResults(combined);
          setShowResults(combined.length > 0);
        } catch (error) {
          console.error("Error fetching quick results:", error);
        } finally {
          setIsTyping(false);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    };
    
    fetchQuickResults();
  }, [query]);
  
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

  const handleResultClick = (result: any) => {
    if (result.type === 'destination') {
      navigate(`/destination/${result.id}/details`);
    } else {
      navigate(`/booking/event/${result.id}`);
    }
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="relative bg-white rounded-lg overflow-hidden shadow-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500" size={20} />
            <Input
              type="text"
              placeholder="Where would you like to explore?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 py-6 text-base w-full shadow-sm border-0 focus-visible:ring-indigo-500 rounded-lg h-[52px]"
            />
          </div>
          
          {/* Quick Search Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
              >
                <div className="p-4">
                  <h3 className="font-medium text-gray-500 text-xs uppercase tracking-wider mb-3">
                    {isTyping ? 'Searching...' : 'Quick Results'}
                  </h3>
                  <div className="space-y-3">
                    {isTyping ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-pulse w-6 h-6 rounded-full bg-indigo-200"></div>
                      </div>
                    ) : results.length > 0 ? (
                      <>
                        {results.map((result) => (
                          <div 
                            key={`${result.type}-${result.id}`}
                            className="p-2 hover:bg-indigo-50 rounded-lg cursor-pointer flex items-center"
                            onClick={() => handleResultClick(result)}
                          >
                            <div 
                              className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 bg-indigo-100"
                              style={result.image_url ? {
                                backgroundImage: `url(${result.image_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              } : {}}
                            ></div>
                            <div className="flex-grow">
                              <p className="font-medium">{result.name || result.title}</p>
                              <p className="text-sm text-gray-500">
                                {result.type === 'destination' ? 
                                  <span className="flex items-center"><MapPin size={12} className="mr-1" /> {result.location}</span> : 
                                  <span className="flex items-center"><Calendar size={12} className="mr-1" /> {result.event_type || 'Event'}</span>
                                }
                              </p>
                            </div>
                            <Badge 
                              className={`ml-2 ${result.type === 'destination' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}
                              variant="outline"
                            >
                              {result.type === 'destination' ? 'Place' : 'Event'}
                            </Badge>
                          </div>
                        ))}
                        <div className="text-center pt-2 border-t">
                          <Button 
                            variant="link" 
                            onClick={() => handleSubmit()}
                            className="text-indigo-600"
                          >
                            See all results
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No results match your search
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white border-indigo-100 hover:border-indigo-300 rounded-lg p-4 h-[52px] text-indigo-500 hover:text-indigo-700"
            >
              <Filter className="h-5 w-5" />
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
                  handleSubmit();
                }}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-[52px] px-6 rounded-lg shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/40"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
