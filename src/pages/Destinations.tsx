
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
import { motion } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-display font-bold text-blue-800 dark:text-blue-200">Explore Destinations</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'gradient' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
              className="transition-all duration-300"
            >
              <Grid className="h-4 w-4 mr-2" /> Grid
            </Button>
            <Button
              variant={view === 'list' ? 'gradient' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
              className="transition-all duration-300"
            >
              <List className="h-4 w-4 mr-2" /> List
            </Button>
          </div>
        </div>

        <Card className="border-blue-100 dark:border-blue-800 overflow-hidden bg-white/80 backdrop-blur-sm shadow-md">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block text-blue-700 dark:text-blue-300">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                  <Input
                    placeholder="Search destinations..."
                    className="pl-10 border-blue-200 dark:border-blue-700 focus-within:border-blue-400 focus-within:ring-blue-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block text-blue-700 dark:text-blue-300">Location</label>
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
              <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block text-blue-700 dark:text-blue-300">Price Range</label>
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
            </div>
          </CardContent>
        </Card>

        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
          </p>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-blue-100 dark:border-blue-800">
                  <Skeleton className="h-48 rounded-t-lg bg-blue-100/50 dark:bg-blue-900/50" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-blue-100/50 dark:bg-blue-900/50" />
                    <Skeleton className="h-4 w-1/2 mb-4 bg-blue-100/50 dark:bg-blue-900/50" />
                    <Skeleton className="h-4 w-full mb-2 bg-blue-100/50 dark:bg-blue-900/50" />
                    <Skeleton className="h-4 w-full mb-2 bg-blue-100/50 dark:bg-blue-900/50" />
                    <Skeleton className="h-10 w-full mt-4 bg-blue-100/50 dark:bg-blue-900/50" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredDestinations.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12 bg-white dark:bg-blue-900/50 rounded-xl shadow-md border border-blue-100 dark:border-blue-800"
                >
                  <div className="mb-4 bg-blue-50 dark:bg-blue-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-blue-900 dark:text-blue-100">No destinations found</h3>
                  <p className="text-blue-600 dark:text-blue-400 mt-2 mb-6">Try adjusting your search or filters</p>
                  <Button 
                    variant="gradient"
                    onClick={() => {
                      setSearchQuery('');
                      setLocationFilter('all');
                      setPriceFilter('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={view === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                  }
                >
                  {filteredDestinations.map((destination) => (
                    <motion.div 
                      key={destination.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <Card 
                        className={view === 'list' 
                          ? "overflow-hidden border-blue-100 dark:border-blue-800 bg-white dark:bg-blue-900/50" 
                          : "overflow-hidden h-full flex flex-col border-blue-100 dark:border-blue-800 bg-white dark:bg-blue-900/50"
                        }
                      >
                        {view === 'grid' ? (
                          <>
                            <div className="h-52 overflow-hidden relative">
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
                            </div>
                            <div className="p-5 flex-grow flex flex-col">
                              <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100 mb-2">{destination.name}</h3>
                              <div className="flex items-center text-blue-600 dark:text-blue-400 mb-4">
                                <MapPin size={16} className="mr-1 flex-shrink-0" />
                                <span className="text-sm">{destination.location}</span>
                              </div>
                              <p className="text-sm text-blue-700 dark:text-blue-300 line-clamp-3 flex-grow">
                                {destination.description}
                              </p>
                              <div className="mt-4">
                                <Button 
                                  className="w-full"
                                  variant="gradient"
                                  onClick={() => handleViewDestination(destination.id)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex">
                            <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                              <img
                                src={destination.image_url || '/placeholder.svg'}
                                alt={destination.name}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                              />
                            </div>
                            <div className="flex-grow p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">{destination.name}</h3>
                                  <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                                    <MapPin size={14} className="mr-1" />
                                    <span className="text-sm">{destination.location}</span>
                                  </div>
                                  <p className="text-sm text-blue-700 dark:text-blue-300 line-clamp-2">
                                    {destination.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge 
                                    variant="outline" 
                                    className="mb-2 font-medium bg-white dark:bg-blue-900 text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-700"
                                  >
                                    ${destination.price}
                                  </Badge>
                                  <Button 
                                    size="sm" 
                                    variant="gradient"
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
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Destinations;
