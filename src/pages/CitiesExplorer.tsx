
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import CityGroupView from '@/components/CityGroupView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCities } from '@/models/Location';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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
    toast.error("Error loading cities", {
      description: "Please try again later"
    });
  }

  const filteredCities = cities?.filter((city: string) => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group cities by first letter
  const groupedCities: { [key: string]: string[] } = {};
  
  if (filteredCities) {
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

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-display text-indigo-700 dark:text-indigo-300">
                  <MapPin className="inline-block mr-2 h-6 w-6" />
                  Zimbabwe Cities Explorer
                </CardTitle>
                <CardDescription className="mt-2">
                  Discover destinations and attractions in cities across Zimbabwe
                </CardDescription>
              </div>
              <Button 
                onClick={() => navigate('/destinations')}
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                All Destinations
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 bg-indigo-100 dark:bg-indigo-900/30">
                <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">All Cities</TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Popular</TabsTrigger>
                <TabsTrigger value="national-parks" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">National Parks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {isLoading ? (
                  <div className="space-y-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-8 w-24" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {[1, 2, 3, 4, 5, 6].map(j => (
                            <Skeleton key={j} className="h-10 w-full" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : sortedKeys.length > 0 ? (
                  <div className="space-y-8">
                    {sortedKeys.map(letter => (
                      <CityGroupView
                        key={letter}
                        letter={letter}
                        cities={groupedCities[letter]}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No cities found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your search query</p>
                    <Button 
                      onClick={() => setSearchQuery('')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {['Harare', 'Bulawayo', 'Victoria Falls', 'Mutare', 'Masvingo', 'Gweru'].map(city => (
                    <Card 
                      key={city}
                      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-indigo-500"
                      onClick={() => navigate(`/destinations?city=${encodeURIComponent(city)}`)}
                    >
                      <CardContent className="p-4 flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-indigo-500" />
                        <span className="font-medium">{city}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="national-parks">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    'Hwange National Park', 
                    'Mana Pools National Park', 
                    'Gonarezhou National Park', 
                    'Matobo National Park',
                    'Nyanga National Park',
                    'Victoria Falls National Park'
                  ].map(park => (
                    <Card 
                      key={park}
                      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500"
                      onClick={() => navigate(`/destinations?query=${encodeURIComponent(park)}`)}
                    >
                      <CardContent className="p-4 flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-green-500" />
                        <span className="font-medium">{park}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CitiesExplorer;
