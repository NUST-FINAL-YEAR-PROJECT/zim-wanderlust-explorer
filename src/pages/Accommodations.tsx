import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Hotel, Search, MapPin, Star, Wifi, Car, Utensils, Users } from 'lucide-react';
import { getAccommodations, type Accommodation } from '@/models/Accommodation';
import { useQuery } from '@tanstack/react-query';
import AccommodationCard from '@/components/AccommodationCard';

const Accommodations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const { data: accommodations = [], isLoading } = useQuery({
    queryKey: ['accommodations'],
    queryFn: getAccommodations,
  });

  // Get unique locations for filter
  const locations = Array.from(new Set(accommodations.map(a => a.location).filter(Boolean))).sort();

  // Filter accommodations based on search and filters
  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesSearch = !searchQuery || 
      accommodation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accommodation.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accommodation.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || accommodation.location === locationFilter;
    
    // Since 'type' doesn't exist on Accommodation, we'll skip type filtering for now
    const matchesType = typeFilter === 'all';
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      const price = accommodation.price_per_night;
      if (priceFilter === 'budget' && price > 100) matchesPrice = false;
      if (priceFilter === 'mid' && (price <= 100 || price > 300)) matchesPrice = false;
      if (priceFilter === 'luxury' && price <= 300) matchesPrice = false;
    }
    
    return matchesSearch && matchesLocation && matchesType && matchesPrice;
  });

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already applied via the filter
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Accommodations</h1>
          <p className="text-muted-foreground">Find the perfect place to stay in Zimbabwe</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search accommodations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {locations.map(location => location && (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-1 block">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="lodge">Lodge</SelectItem>
                <SelectItem value="guesthouse">Guesthouse</SelectItem>
                <SelectItem value="resort">Resort</SelectItem>
                <SelectItem value="backpacker">Backpacker</SelectItem>
                <SelectItem value="safari_camp">Safari Camp</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-1 block">Price Range</label>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All prices</SelectItem>
                <SelectItem value="budget">Budget ($0-$100)</SelectItem>
                <SelectItem value="mid">Mid-range ($100-$300)</SelectItem>
                <SelectItem value="luxury">Luxury ($300+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="mt-4 md:mt-0">
            Apply Filters
          </Button>
        </form>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 rounded-t-lg" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAccommodations.length === 0 ? (
            <div className="text-center py-12">
              <Hotel className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No accommodations found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setLocationFilter('all');
                setTypeFilter('all');
                setPriceFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccommodations.map((accommodation) => (
                <AccommodationCard 
                  key={accommodation.id} 
                  accommodation={accommodation}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          {isLoading ? (
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-24 w-32 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-6 w-20 mb-2" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAccommodations.length === 0 ? (
            
            <div className="text-center py-12">
              <Hotel className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No accommodations found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setLocationFilter('all');
                setTypeFilter('all');
                setPriceFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAccommodations.map((accommodation) => (
                <Card key={accommodation.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex gap-4" onClick={() => navigate(`/accommodation/${accommodation.id}`)}>
                      <div className="w-32 h-24 flex-shrink-0">
                        <img
                          src={accommodation.image_url || '/placeholder.svg'}
                          alt={accommodation.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{accommodation.name}</h3>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <MapPin size={14} className="mr-1" />
                              <span className="text-sm">{accommodation.location}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 text-sm">{accommodation.rating}/5</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {accommodation.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-bold text-lg">${accommodation.price_per_night}</div>
                            <div className="text-sm text-muted-foreground">per night</div>
                            <Button size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accommodations;
