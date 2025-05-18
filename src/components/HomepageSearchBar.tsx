import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { searchDestinations } from "@/models/Destination";
import { searchEvents } from "@/models/Event";

const HomepageSearchBar = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const [activeTab, setActiveTab] = useState("stay");
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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
  
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };
  
  const handleSearch = async () => {
    if (!searchText.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Enter a destination or experience you're looking for",
      });
      return;
    }
    
    // Save search term
    saveRecentSearch(searchText);
    
    // If onSearch prop is provided (for in-page search), use it
    if (onSearch) {
      onSearch(searchText);
      return;
    }
    
    // Otherwise navigate to search results page
    const params = new URLSearchParams();
    params.append('search', searchText);
    params.append('tab', activeTab === "stay" ? "destinations" : "events");
    
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());
    }
    
    if (selectedCategories.length > 0) {
      params.append('categories', selectedCategories.join(','));
    }
    
    // Quick check if there are actual results before navigating
    try {
      const results = activeTab === "stay" 
        ? await searchDestinations(searchText)
        : await searchEvents(searchText);
        
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: `No ${activeTab === "stay" ? "destinations" : "events"} match your search.`,
          variant: "default",
        });
        // Still navigate to show the empty state
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
    
    navigate(`/browse?${params.toString()}`);
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  return (
    <div className="w-full flex flex-col gap-4">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start mb-4 bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
          <TabsTrigger 
            value="stay" 
            className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md m-1 transition-all duration-300"
          >
            <span className="text-sm font-medium">Places to Stay</span>
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md m-1 transition-all duration-300"
          >
            <span className="text-sm font-medium">Experiences</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1 bg-white rounded-lg overflow-hidden shadow-md">
          <div className="flex items-center">
            <Search className="ml-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "stay" ? "Where do you want to go?" : "What do you want to experience?"}
              className="w-full py-4 px-4 outline-none text-gray-800 placeholder-gray-500 text-lg bg-transparent"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              list="recent-searches"
            />
            {recentSearches.length > 0 && (
              <datalist id="recent-searches">
                {recentSearches.map((search, index) => (
                  <option key={index} value={search} />
                ))}
              </datalist>
            )}
          </div>
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-[52px] rounded-lg shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/40"
        >
          <Search className="h-5 w-5" />
          <span className="ml-2 hidden md:inline">Search</span>
        </Button>
      </div>
    </div>
  );
};

export default HomepageSearchBar;
