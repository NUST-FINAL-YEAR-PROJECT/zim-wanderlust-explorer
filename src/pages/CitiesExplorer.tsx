
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Globe, X } from 'lucide-react';
import CityGroupView from '@/components/CityGroupView';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getAllCitiesWithContent, getCityContent } from '@/models/Location';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const CitiesExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedData, setGroupedData] = useState<Array<{
    city: string;
    destinations: any[];
    events: any[];
  }>>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch cities with content using react-query
  const { data: cities = [], isLoading: isLoadingCities, isError } = useQuery({
    queryKey: ['cities'],
    queryFn: getAllCitiesWithContent,
    onError: (error) => {
      console.error('Error fetching cities:', error);
      toast({
        title: 'Error fetching cities',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  });

  // Process and group data by city
  useEffect(() => {
    // If we have cities and aren't loading, fetch content for each city
    if (cities.length && !isLoadingCities) {
      const fetchCityContent = async () => {
        try {
          const cityContentPromises = cities.map(city => getCityContent(city));
          const citiesContent = await Promise.all(cityContentPromises);
          
          // Filter by search query if provided
          let filteredCities = citiesContent;
          if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filteredCities = filteredCities.filter(cityData => 
              cityData.city.toLowerCase().includes(lowerCaseQuery) ||
              cityData.destinations.some(d => 
                d.name?.toLowerCase().includes(lowerCaseQuery) ||
                (d.description && d.description.toLowerCase().includes(lowerCaseQuery))
              ) ||
              cityData.events.some(e => 
                e.title?.toLowerCase().includes(lowerCaseQuery) ||
                (e.description && e.description.toLowerCase().includes(lowerCaseQuery))
              )
            );
          }
          
          // Sort by city name
          filteredCities.sort((a, b) => a.city.localeCompare(b.city));
          setGroupedData(filteredCities);
        } catch (error) {
          console.error("Error fetching city content:", error);
          toast({
            title: 'Error loading city data',
            description: 'Please try again later',
            variant: 'destructive',
          });
          setGroupedData([]);
        }
      };

      fetchCityContent();
    }
  }, [cities, isLoadingCities, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied via useEffect
  };

  const clearSearch = () => {
    setSearchQuery('');
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 p-6 md:p-8 mb-8 shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-8 w-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                Explore Zimbabwe by City
              </h1>
            </div>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl">
              Discover destinations, accommodations, and events grouped by city for easy exploration
            </p>

            <form onSubmit={handleSearchSubmit} className="max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                <Input
                  placeholder="Search cities, destinations, or events..."
                  className="pl-10 pr-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-blue-200 w-full focus:ring-2 focus:ring-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>
          </motion.div>
          
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-blue-500/30 blur-2xl"></div>
          <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        {/* City group view */}
        {isLoadingCities ? (
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
        ) : isError ? (
          <div className="text-center py-16 bg-white dark:bg-blue-900/30 rounded-xl shadow-md border border-blue-100 dark:border-blue-800">
            <div className="mb-6 bg-red-50 dark:bg-red-800/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <X className="h-10 w-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-medium text-blue-900 dark:text-blue-100 mb-3">Error loading cities</h3>
            <p className="text-blue-600 dark:text-blue-400 mb-8 max-w-md mx-auto">
              We encountered a problem while loading the city data.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try again
            </Button>
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
                onClick={clearSearch}
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
