
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plane, Car, Bus, Search, Filter } from 'lucide-react';
import { TransportOperator, getTransportOperators, getTransportOperatorsByType } from '@/models/TransportOperator';
import TransportOperatorCard from '@/components/transport/TransportOperatorCard';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TransportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'private' | 'public' | 'air'>('all');
  const [sortOrder, setSortOrder] = useState<'price-low' | 'price-high' | 'rating'>('rating');

  // Use the tanstack-query format with object options
  const { data: operators, isLoading } = useQuery({
    queryKey: ['transportOperators', activeTab],
    queryFn: () => activeTab === 'all' ? 
      getTransportOperators() : 
      getTransportOperatorsByType(activeTab),
    staleTime: 60000, // 1 minute
  });

  const filteredOperators = operators?.filter(op => 
    op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Sort operators
  const sortedOperators = [...filteredOperators].sort((a, b) => {
    if (sortOrder === 'price-low') {
      // Using price range as proxy for sorting
      return a.price_range.length - b.price_range.length;
    } else if (sortOrder === 'price-high') {
      return b.price_range.length - a.price_range.length;
    } else {
      // Default to rating sort
      return b.rating - a.rating;
    }
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'private' | 'public' | 'air');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold">Transportation in Zimbabwe</h1>
          <p className="mt-2 text-indigo-100">Find the perfect transportation option for your Zimbabwean adventure</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transport operators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-indigo-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium">Sort by:</span>
              </div>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger className="w-[180px] border-indigo-200">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6 bg-indigo-100 dark:bg-indigo-900/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              All Transport
            </TabsTrigger>
            <TabsTrigger value="private" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Car className="h-4 w-4 mr-2" /> Private
            </TabsTrigger>
            <TabsTrigger value="public" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Bus className="h-4 w-4 mr-2" /> Public
            </TabsTrigger>
            <TabsTrigger value="air" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Plane className="h-4 w-4 mr-2" /> Air
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedOperators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedOperators.map(operator => (
                  <TransportOperatorCard key={operator.id} operator={operator} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bus className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No transport options found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search query</p>
                <Button 
                  onClick={() => setSearchQuery('')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="private" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedOperators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedOperators.map(operator => (
                  <TransportOperatorCard key={operator.id} operator={operator} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No private transport options found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or check another category</p>
                <Button 
                  onClick={() => setActiveTab('all')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  View All Transport
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="public" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedOperators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedOperators.map(operator => (
                  <TransportOperatorCard key={operator.id} operator={operator} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bus className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No public transport options found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or check another category</p>
                <Button 
                  onClick={() => setActiveTab('all')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  View All Transport
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="air" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedOperators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedOperators.map(operator => (
                  <TransportOperatorCard key={operator.id} operator={operator} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Plane className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No air transport options found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or check another category</p>
                <Button 
                  onClick={() => setActiveTab('all')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  View All Transport
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-t-4 border-t-indigo-500">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
            <CardTitle className="text-xl font-display text-indigo-700 dark:text-indigo-300">
              Travel Tips for Zimbabwe
            </CardTitle>
            <CardDescription>
              Transportation advice to make your journey through Zimbabwe smooth and enjoyable
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bus className="h-5 w-5" /> Public Transport
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Public buses connect major cities and towns, but schedules can be unpredictable. For more reliable service, use private shuttle companies that cater to tourists.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="h-5 w-5" /> Self-Drive Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>If renting a car, a 4x4 vehicle is recommended for rural areas. Drive on the left side of the road and carry your driver's license along with an International Driving Permit.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plane className="h-5 w-5" /> Domestic Flights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Domestic flights connect major tourist destinations like Harare, Victoria Falls, and Bulawayo. Book in advance during peak season (July-October).</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransportPage;
