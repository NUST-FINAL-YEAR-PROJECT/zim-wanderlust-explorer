
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Filter, Search, Grid, List } from 'lucide-react';
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

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });

  // Get unique locations for filter
  const locations = Array.from(new Set(destinations.map(d => d.location)))
    .filter(Boolean)
    .sort();

  // Filter destinations based on search and filters
  const filteredDestinations = destinations.filter(destination => {
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
  });

  const handleViewDestination = (id: string) => {
    navigate(`/destination/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Explore Destinations</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4 mr-2" /> Grid
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4 mr-2" /> List
            </Button>
          </div>
        </div>

        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search destinations..."
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
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
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
                    <SelectItem value="low">Budget (Under $50)</SelectItem>
                    <SelectItem value="medium">Mid-range ($50-$150)</SelectItem>
                    <SelectItem value="high">Premium (Over $150)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
          </p>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="dashboard-card">
                  <Skeleton className="h-48 rounded-t-lg" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredDestinations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <div className="mb-4">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No destinations found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className={view === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
                }>
                  {filteredDestinations.map((destination) => (
                    <Card 
                      key={destination.id}
                      className={view === 'list' ? "dashboard-card overflow-hidden" : "dashboard-action-card overflow-hidden h-full flex flex-col"}
                    >
                      {view === 'grid' ? (
                        <>
                          <div className="h-48 overflow-hidden">
                            <img
                              src={destination.image_url || '/placeholder.svg'}
                              alt={destination.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-5 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-xl">{destination.name}</h3>
                              <Badge variant="outline" className="font-medium text-green-700 border-green-200 bg-green-50">
                                ${destination.price}
                              </Badge>
                            </div>
                            <div className="flex items-center text-muted-foreground mb-4">
                              <MapPin size={16} className="mr-1 flex-shrink-0" />
                              <span className="text-sm">{destination.location}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                              {destination.description}
                            </p>
                            <div className="mt-4">
                              <Button 
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => handleViewDestination(destination.id)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex">
                          <div className="w-32 h-32 flex-shrink-0">
                            <img
                              src={destination.image_url || '/placeholder.svg'}
                              alt={destination.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg">{destination.name}</h3>
                                <div className="flex items-center text-muted-foreground mb-2">
                                  <MapPin size={14} className="mr-1" />
                                  <span className="text-sm">{destination.location}</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {destination.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="font-medium text-green-700 border-green-200 bg-green-50 mb-2">
                                  ${destination.price}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                  onClick={() => handleViewDestination(destination.id)}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Destinations;
