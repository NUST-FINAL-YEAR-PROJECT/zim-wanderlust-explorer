
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, Plane, Bus, Train, Search, MapPin, Clock, Star, Phone, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTransportOperators } from '@/models/TransportOperator';
import TransportOperatorCard from '@/components/transport/TransportOperatorCard';
import TransportRecommendations from '@/components/transport/TransportRecommendations';

const TransportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transportType, setTransportType] = useState('all');
  const [location, setLocation] = useState('all');

  const { data: operators = [], isLoading } = useQuery({
    queryKey: ['transport-operators'],
    queryFn: getTransportOperators,
  });

  // Filter operators based on search criteria
  const filteredOperators = operators.filter(operator => {
    const matchesSearch = !searchQuery || 
      operator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.services_offered?.some(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = transportType === 'all' || 
      operator.transport_type === transportType;

    const matchesLocation = location === 'all' || 
      operator.operating_areas?.includes(location);

    return matchesSearch && matchesType && matchesLocation;
  });

  // Get unique locations for filter
  const locations = Array.from(
    new Set(operators.flatMap(op => op.operating_areas || []))
  ).sort();

  const transportTypes = [
    { value: 'all', label: 'All Transport', icon: Car },
    { value: 'bus', label: 'Bus', icon: Bus },
    { value: 'taxi', label: 'Taxi', icon: Car },
    { value: 'shuttle', label: 'Shuttle', icon: Bus },
    { value: 'car_rental', label: 'Car Rental', icon: Car },
    { value: 'flight', label: 'Flight', icon: Plane },
    { value: 'train', label: 'Train', icon: Train },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transport Services</h1>
          <p className="text-muted-foreground">Find reliable transport options across Zimbabwe</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search transport services..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-1 block">Transport Type</label>
              <Select value={transportType} onValueChange={setTransportType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  {transportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="operators" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="operators">Transport Operators</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="operators">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOperators.length === 0 ? (
            <div className="text-center py-12">
              <Car className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No transport operators found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setTransportType('all');
                setLocation('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOperators.map((operator) => (
                <TransportOperatorCard key={operator.id} operator={operator} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations">
          <TransportRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportPage;
