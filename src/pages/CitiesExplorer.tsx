
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CityGroupView from '@/components/CityGroupView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Compass, TreePine, Users, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCities } from '@/models/Location';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const CitiesExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const navigate = useNavigate();

  // Fetch all cities
  const { data: cities, isLoading, error } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  if (error) {
    console.error('Error loading cities:', error);
    toast.error("Error loading cities", {
      description: "Please try again later"
    });
  }

  const filteredCities = cities?.filter((city: string) => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Group cities by first letter
  const groupedCities: { [key: string]: string[] } = {};
  
  if (filteredCities.length > 0) {
    filteredCities.forEach((city: string) => {
      const firstLetter = city.charAt(0).toUpperCase();
      if (!groupedCities[firstLetter]) {
        groupedCities[firstLetter] = [];
      }
      groupedCities[firstLetter].push(city);
    });
  }

  // Sort keys alphabetically
  const sortedKeys = Object.keys(groupedCities).sort();

  const popularCities = ['Harare', 'Bulawayo', 'Victoria Falls', 'Mutare', 'Masvingo', 'Gweru'];
  const nationalParks = [
    'Hwange National Park', 
    'Mana Pools National Park', 
    'Gonarezhou National Park', 
    'Matobo National Park',
    'Nyanga National Park',
    'Victoria Falls National Park'
  ];

  const cityStats = {
    total: cities?.length || 0,
    popular: popularCities.length,
    parks: nationalParks.length
  };

  const CityCard = ({ city, icon: Icon = MapPin, color = "indigo", isNationalPark = false }: { 
    city: string; 
    icon?: any; 
    color?: string; 
    isNationalPark?: boolean;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-${color}-500 hover:border-l-${color}-600 bg-gradient-to-br from-white to-${color}-50/30 dark:from-gray-800 dark:to-${color}-950/20`}
        onClick={() => {
          if (isNationalPark) {
            navigate(`/destinations?query=${encodeURIComponent(city)}`);
          } else {
            navigate(`/destinations?city=${encodeURIComponent(city)}`);
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 group-hover:bg-${color}-200 dark:group-hover:bg-${color}-900/50 transition-colors`}>
                <Icon className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                  {city}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explore destinations
                </p>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="secondary" className="text-xs">
                View
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-t-4 border-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 opacity-60" />
          <CardHeader className="relative bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <Compass className="h-7 w-7" />
                  </div>
                  Zimbabwe Cities Explorer
                </CardTitle>
                <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                  Discover amazing destinations and attractions across Zimbabwe's vibrant cities
                </CardDescription>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium">{cityStats.total} Cities</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{cityStats.popular} Popular</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TreePine className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{cityStats.parks} National Parks</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/destinations')}
                  className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  size="lg"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  All Destinations
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/events')}
                  className="border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-950/30"
                  size="lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Events
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search cities, destinations, or national parks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-indigo-100 dark:bg-indigo-900/30 p-1 rounded-xl shadow-md">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-6 py-2 transition-all duration-300"
              >
                <MapPin className="mr-2 h-4 w-4" />
                All Cities
              </TabsTrigger>
              <TabsTrigger 
                value="popular" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-6 py-2 transition-all duration-300"
              >
                <Star className="mr-2 h-4 w-4" />
                Popular
              </TabsTrigger>
              <TabsTrigger 
                value="national-parks" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-6 py-2 transition-all duration-300"
              >
                <TreePine className="mr-2 h-4 w-4" />
                National Parks
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-8">
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-24" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(j => (
                        <Skeleton key={j} className="h-20 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedKeys.length > 0 ? (
              <div className="space-y-10">
                {sortedKeys.map(letter => (
                  <motion.div
                    key={letter}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CityGroupView
                      letter={letter}
                      cities={groupedCities[letter]}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">No cities found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any cities matching your search. Try adjusting your search terms.
                </p>
                <Button 
                  onClick={() => setSearchQuery('')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  size="lg"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularCities.map((city, index) => (
                <motion.div
                  key={city}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CityCard city={city} icon={Star} color="amber" />
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="national-parks" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nationalParks.map((park, index) => (
                <motion.div
                  key={park}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CityCard city={park} icon={TreePine} color="green" isNationalPark={true} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default CitiesExplorer;
