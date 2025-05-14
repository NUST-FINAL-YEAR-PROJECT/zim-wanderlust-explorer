
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const categories = [
    "National Parks", "Historical Sites", "Adventure", "Cultural", "Wildlife", "Relaxation"
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1 bg-white rounded-lg overflow-hidden shadow-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500" size={20} />
          <Input
            type="text"
            placeholder="Where would you like to explore?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 py-6 text-base w-full shadow-sm border-0 focus-visible:ring-indigo-500 rounded-lg"
          />
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white border-indigo-100 hover:border-indigo-300 rounded-lg p-4 h-auto text-indigo-500 hover:text-indigo-700"
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
                  handleSubmit({ preventDefault: () => {} } as React.FormEvent);
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
