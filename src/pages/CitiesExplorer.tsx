
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin } from 'lucide-react';
import CityGroupView from '@/components/CityGroupView';
import { getDestinations } from '@/models/Destination';
import { getEvents } from '@/models/Event';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const CitiesExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedData, setGroupedData] = useState<Array<{
    city: string;
    destinations: any[];
    events: any[];
  }>>([]);

  // Fetch destinations and events data
  const { data: destinations = [], isLoading: isLoadingDestinations } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });

  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  // Process and group data by city
  useEffect(() => {
    if (!isLoadingDestinations && !isLoadingEvents) {
      const citiesMap = new Map<string, { 
        city: string; 
        destinations: any[]; 
        events: any[];
      }>();

      // Group destinations by city (location)
      destinations.forEach(destination => {
        if (!destination.location) return;
        
        const city = destination.location;
        if (!citiesMap.has(city)) {
          citiesMap.set(city, { city, destinations: [], events: [] });
        }
        citiesMap.get(city)?.destinations.push(destination);
      });

      // Group events by city (location)
      events.forEach(event => {
        if (!event.location) return;
        
        const city = event.location;
        if (!citiesMap.has(city)) {
          citiesMap.set(city, { city, destinations: [], events: [] });
        }
        citiesMap.get(city)?.events.push(event);
      });

      // Convert map to array and filter by search query if provided
      let groupedArray = Array.from(citiesMap.values());
      
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        groupedArray = groupedArray.filter(group => 
          group.city.toLowerCase().includes(lowerCaseQuery) ||
          group.destinations.some(d => 
            d.name.toLowerCase().includes(lowerCaseQuery) ||
            (d.description && d.description.toLowerCase().includes(lowerCaseQuery))
          ) ||
          group.events.some(e => 
            e.title.toLowerCase().includes(lowerCaseQuery) ||
            (e.description && e.description.toLowerCase().includes(lowerCaseQuery))
          )
        );
      }
      
      // Sort by city name
      groupedArray.sort((a, b) => a.city.localeCompare(b.city));
      
      setGroupedData(groupedArray);
    }
  }, [destinations, events, isLoadingDestinations, isLoadingEvents, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied via useEffect
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 pb-8"
      >
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 mb-8 shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Explore Zimbabwe by City
            </h1>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl">
              Discover destinations and events grouped by city for easy exploration
            </p>

            <form onSubmit={handleSearchSubmit} className="max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                <Input
                  placeholder="Search cities, destinations, or events..."
                  className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-blue-200 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </motion.div>
          
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-blue-500/30 blur-2xl"></div>
          <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        {/* City group view */}
        {isLoadingDestinations || isLoadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-[calc(100vh-300px)]" />
            <div className="md:col-span-3 space-y-6">
              <Skeleton className="h-20 w-2/3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-80" />
                ))}
              </div>
            </div>
          </div>
        ) : groupedData.length > 0 ? (
          <CityGroupView data={groupedData} />
        ) : (
          <div className="text-center py-16 bg-white dark:bg-blue-900/30 rounded-xl shadow-md border border-blue-100 dark:border-blue-800">
            <div className="mb-6 bg-blue-50 dark:bg-blue-800/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-10 w-10 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-medium text-blue-900 dark:text-blue-100 mb-3">No cities found</h3>
            <p className="text-blue-600 dark:text-blue-400 mb-8 max-w-md mx-auto">
              {searchQuery ? 'No cities match your search criteria.' : 'There are currently no cities with destinations or events.'}
            </p>
            {searchQuery && (
              <Button 
                variant="outline"
                onClick={() => setSearchQuery('')}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default CitiesExplorer;
