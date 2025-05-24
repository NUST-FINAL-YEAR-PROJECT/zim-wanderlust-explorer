
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Filter, Search, Grid, List, Sliders, Heart } from 'lucide-react';
import { getDestinations, Destination } from '@/models/Destination';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const Destinations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });

  // Get unique locations for filter
  const locations = Array.from(new Set(destinations.map(d => d.location)))
    .filter(Boolean)
    .sort();

  // Sort destinations based on the selected sort order
  const sortDestinations = (destinations: Destination[]) => {
    switch (sortOrder) {
      case 'price-low':
        return [...destinations].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...destinations].sort((a, b) => b.price - a.price);
      case 'name':
      default:
        return [...destinations].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  // Filter destinations based on search and filters
  const filteredDestinations = sortDestinations(destinations.filter(destination => {
    const matchesSearch = !searchQuery || 
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (destination.description && destination.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      destination.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = priceFilter === 'all' || 
      (priceFilter === 'low' && destination.price <= 50) ||
      (priceFilter === 'medium' && destination.price > 50 && destination.price <= 150) ||
      (priceFilter === 'high' && destination.price > 150);
    
    const matchesLocation = locationFilter === 'all' || destination.location === locationFilter;
    
    return matchesSearch && matchesPrice && matchesLocation;
  }));

  const handleViewDestination = (id: string) => {
    navigate(`/destination/${id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationFilter('all');
    setPriceFilter('all');
    setSortOrder('name');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 mb-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Explore Amazing Destinations
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl">
            Discover Zimbabwe's best-kept secrets and popular attractions for your next adventure
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
              <Input
                placeholder="Search destinations by name or location..."
                className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-blue-200 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>
        </div>
        
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-blue-500/30 blur-2xl"></div>
        <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="overflow-hidden">
          <Card className="border-blue-100 dark:border-blue-800 mb-6 overflow-hidden bg-white/90 backdrop-blur-sm shadow-md">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-blue-700 dark:text-blue-300">Location</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="border-blue-200 dark:border-blue-700 focus:ring-blue-300">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-700">
                      <SelectItem value="all">All locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-blue-700 dark:text-blue-300">Price Range</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="border-blue-200 dark:border-blue-700 focus:ring-blue-300">
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-700">
                      <SelectItem value="all">All prices</SelectItem>
                      <SelectItem value="low">Budget (Under $50)</SelectItem>
                      <SelectItem value="medium">Mid-range ($50-$150)</SelectItem>
                      <SelectItem value="high">Premium (Over $150)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-blue-700 dark:text-blue-300">Sort By</label>
                  <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                    <SelectTrigger className="border-blue-200 dark:border-blue-700 focus:ring-blue-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-700">
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="border-blue-200 text-blue-700"
                >
                  Clear Filters
                </Button>
                <Button 
                  onClick={() => setShowFilterPanel(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
              {filteredDestinations.length} {filteredDestinations.length === 1 ? 'Destination' : 'Destinations'} Found
            </h2>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {priceFilter !== 'all' || locationFilter !== 'all' ? 'Filtered results' : 'Showing all destinations'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-blue-50 dark:bg-blue-900/50 rounded-lg p-1 border border-blue-100 dark:border-blue-800">
              <Button
                variant={view === 'grid' ? 'gradient' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                className={`rounded-md ${view === 'grid' ? '' : 'text-blue-700 dark:text-blue-300'}`}
              >
                <Grid className="h-4 w-4 mr-1" /> Grid
              </Button>
              <Button
                variant={view === 'list' ? 'gradient' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className={`rounded-md ${view === 'list' ? '' : 'text-blue-700 dark:text-blue-300'}`}
              >
                <List className="h-4 w-4 mr-1" /> List
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-blue-500" />
              <span className="text-sm text-blue-600 dark:text-blue-400 hidden sm:inline">Sorted by:</span>
              <span className="text-sm font-medium">
                {sortOrder === 'name' ? 'Name' : sortOrder === 'price-low' ? 'Price ↑' : 'Price ↓'}
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={view === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-blue-100 dark:border-blue-800 overflow-hidden">
                <Skeleton className={view === 'grid' ? "h-48 w-full" : "h-32 w-32"} />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {filteredDestinations.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-blue-900/30 rounded-xl shadow-md border border-blue-100 dark:border-blue-800">
                <div className="mb-6 bg-blue-50 dark:bg-blue-800/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-medium text-blue-900 dark:text-blue-100 mb-3">No destinations found</h3>
                <p className="text-blue-600 dark:text-blue-400 mb-8 max-w-md mx-auto">
                  We couldn't find any destinations matching your current filters. Try adjusting your search criteria.
                </p>
                <Button 
                  variant="gradient"
                  onClick={handleClearFilters}
                  size="lg"
                  className="px-8"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className={view === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-5"
              }>
                {filteredDestinations.map((destination, index) => (
                  <div key={destination.id} className="h-full">
                    <Card className={`overflow-hidden border-blue-100 dark:border-blue-800 bg-white dark:bg-blue-900/20 shadow-sm hover:shadow-md transition-all duration-300 ${
                      view === 'grid' ? 'h-full flex flex-col' : ''
                    }`}>
                      {view === 'grid' ? (
                        <>
                          <div className="h-56 overflow-hidden relative">
                            <img
                              src={destination.image_url || '/placeholder.svg'}
                              alt={destination.name}
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            <Badge 
                              variant="outline" 
                              className="absolute top-3 right-3 font-medium bg-white dark:bg-blue-900 text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-700"
                            >
                              ${destination.price}
                            </Badge>
                            <div className="absolute top-3 left-3">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="bg-white/80 backdrop-blur-sm hover:bg-white text-rose-500 h-9 w-9 p-0 rounded-full"
                              >
                                <Heart className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-5 flex-grow flex flex-col">
                            <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100 mb-2 line-clamp-1">{destination.name}</h3>
                            <div className="flex items-center text-blue-600 dark:text-blue-400 mb-3">
                              <MapPin size={16} className="mr-1 flex-shrink-0" />
                              <span className="text-sm">{destination.location}</span>
                            </div>
                            <p className="text-sm text-blue-700 dark:text-blue-300 line-clamp-3 flex-grow mb-4">
                              {destination.description}
                            </p>
                            
                            {destination.categories && destination.categories.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {destination.categories.slice(0, 3).map((category, i) => (
                                  <Badge key={i} variant="outline" className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-xs">
                                    {category}
                                  </Badge>
                                ))}
                                {destination.categories.length > 3 && (
                                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-xs">
                                    +{destination.categories.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            <Button 
                              className="w-full"
                              variant="gradient"
                              onClick={() => handleViewDestination(destination.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex">
                          <div className="w-44 h-44 flex-shrink-0 overflow-hidden relative">
                            <img
                              src={destination.image_url || '/placeholder.svg'}
                              alt={destination.name}
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            <div className="absolute top-2 left-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="bg-white/80 backdrop-blur-sm hover:bg-white text-rose-500 h-8 w-8 p-0 rounded-full"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex-grow p-5">
                            <div className="flex justify-between items-start">
                              <div className="flex-grow pr-4">
                                <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100">{destination.name}</h3>
                                <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                                  <MapPin size={14} className="mr-1" />
                                  <span className="text-sm">{destination.location}</span>
                                </div>
                                
                                <p className="text-sm text-blue-700 dark:text-blue-300 line-clamp-2 mb-3">
                                  {destination.description}
                                </p>
                                
                                {destination.categories && destination.categories.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {destination.categories.slice(0, 2).map((category, i) => (
                                      <Badge key={i} variant="outline" className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-xs">
                                        {category}
                                      </Badge>
                                    ))}
                                    {destination.categories.length > 2 && (
                                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-xs">
                                        +{destination.categories.length - 2} more
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant="outline" 
                                  className="mb-4 font-medium bg-white dark:bg-blue-900 text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-700"
                                >
                                  ${destination.price}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  variant="gradient"
                                  onClick={() => handleViewDestination(destination.id)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Destinations;
