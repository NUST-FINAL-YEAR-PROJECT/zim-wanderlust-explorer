
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Map, CalendarIcon, BedDouble, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import DestinationCard from './DestinationCard';
import EventCard from './EventCard';
import AccommodationCard from './AccommodationCard';
import { Destination } from '@/models/Destination';
import { Event } from '@/models/Event';

interface CityGroupViewProps {
  data: {
    city: string;
    destinations: Destination[];
    events: Event[];
  }[];
  className?: string;
}

const CityGroupView = ({ data, className }: CityGroupViewProps) => {
  const [activeCity, setActiveCity] = useState<string>(data[0]?.city || '');
  const [selectedTab, setSelectedTab] = useState<string>('all');

  // Find the currently active city data
  const activeCityData = data.find(item => item.city === activeCity) || { 
    city: '', 
    destinations: [], 
    events: [] 
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6", className)}>
      {/* City selection sidebar */}
      <Card className="md:col-span-1 bg-white dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-300">
            <Globe size={20} className="flex-shrink-0" />
            <h3 className="font-semibold tracking-wide">Cities in Zimbabwe</h3>
          </div>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2 pr-4">
              {data.map((cityData) => (
                <Button
                  key={cityData.city}
                  variant={activeCity === cityData.city ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-lg transition-all",
                    activeCity === cityData.city 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                      : "hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  )}
                  onClick={() => setActiveCity(cityData.city)}
                >
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{cityData.city}</span>
                  <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full px-2 py-0.5">
                    {cityData.destinations.length + cityData.events.length}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Content area */}
      <div className="md:col-span-3">
        {activeCity ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 p-4 bg-white dark:bg-blue-900/10 rounded-xl shadow-sm border border-blue-50 dark:border-blue-800/30">
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  <MapPin size={24} className="mr-2 text-blue-600" />
                  Explore {activeCity}
                </h2>
                <p className="text-blue-600 dark:text-blue-400">
                  Discover exciting destinations, places to stay and events in {activeCity}
                </p>
              </div>
              
              <Tabs defaultValue="all" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-6 bg-blue-50 dark:bg-blue-900/30 p-1 rounded-lg">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="accommodations" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all"
                  >
                    <BedDouble className="mr-2 h-4 w-4" />
                    Accommodations ({activeCityData.destinations.filter(d => d.categories?.includes('accommodation')).length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="destinations" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all"
                  >
                    <Map className="mr-2 h-4 w-4" />
                    Attractions ({activeCityData.destinations.filter(d => !d.categories?.includes('accommodation')).length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="events" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Events ({activeCityData.events.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-8">
                  {/* Accommodations section */}
                  {activeCityData.destinations.filter(d => d.categories?.includes('accommodation')).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold px-1 text-blue-700 dark:text-blue-300 flex items-center border-l-4 border-blue-600 pl-2">
                        <BedDouble size={18} className="mr-2" /> Places to Stay
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeCityData.destinations
                          .filter(d => d.categories?.includes('accommodation'))
                          .slice(0, 3)
                          .map((destination) => (
                            <AccommodationCard 
                              key={destination.id} 
                              accommodation={{
                                id: destination.id,
                                name: destination.name,
                                description: destination.description,
                                location: destination.location,
                                price_per_night: destination.price,
                                image_url: destination.image_url,
                                rating: 4.5,
                                review_count: 12,
                                additional_images: destination.additional_images || [],
                                amenities: destination.amenities || [],
                                room_types: null,
                                max_guests: 4,
                                is_featured: destination.is_featured,
                                latitude: destination.latitude,
                                longitude: destination.longitude,
                                created_at: destination.created_at,
                                updated_at: destination.updated_at
                              }}
                            />
                          ))}
                      </div>
                      
                      {activeCityData.destinations.filter(d => d.categories?.includes('accommodation')).length > 3 && (
                        <div className="text-center mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedTab('accommodations')}
                            className="border-blue-200 text-blue-700"
                          >
                            View all accommodations
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Attractions section */}
                  {activeCityData.destinations.filter(d => !d.categories?.includes('accommodation')).length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-semibold px-1 text-blue-700 dark:text-blue-300 flex items-center border-l-4 border-blue-600 pl-2">
                        <Map size={18} className="mr-2" /> Attractions & Activities
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeCityData.destinations
                          .filter(d => !d.categories?.includes('accommodation'))
                          .slice(0, 3)
                          .map((destination) => (
                            <DestinationCard 
                              key={destination.id} 
                              destination={destination}
                            />
                          ))}
                      </div>
                      
                      {activeCityData.destinations.filter(d => !d.categories?.includes('accommodation')).length > 3 && (
                        <div className="text-center mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedTab('destinations')}
                            className="border-blue-200 text-blue-700"
                          >
                            View all attractions
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Events section */}
                  {activeCityData.events.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-semibold px-1 text-blue-700 dark:text-blue-300 flex items-center border-l-4 border-blue-600 pl-2">
                        <CalendarIcon size={18} className="mr-2" /> Upcoming Events
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeCityData.events.slice(0, 3).map((event) => (
                          <EventCard 
                            key={event.id} 
                            event={{
                              id: event.id,
                              title: event.title,
                              description: event.description || '',
                              location: event.location || 'Location not specified',
                              start_date: event.start_date,
                              end_date: event.end_date,
                              image_url: event.image_url,
                              price: event.price
                            }} 
                          />
                        ))}
                      </div>
                      
                      {activeCityData.events.length > 3 && (
                        <div className="text-center mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedTab('events')}
                            className="border-blue-200 text-blue-700"
                          >
                            View all events
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeCityData.destinations.length === 0 && activeCityData.events.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info size={24} className="text-blue-500" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No listings found</h3>
                      <p className="text-muted-foreground">
                        There are currently no destinations or events in {activeCity}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="accommodations">
                  {activeCityData.destinations.filter(d => d.categories?.includes('accommodation')).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeCityData.destinations
                        .filter(d => d.categories?.includes('accommodation'))
                        .map((destination) => (
                          <AccommodationCard 
                            key={destination.id} 
                            accommodation={{
                              id: destination.id,
                              name: destination.name,
                              description: destination.description,
                              location: destination.location,
                              price_per_night: destination.price,
                              image_url: destination.image_url,
                              rating: 4.5,
                              review_count: 12,
                              additional_images: destination.additional_images || [],
                              amenities: destination.amenities || [],
                              room_types: null,
                              max_guests: 4,
                              is_featured: destination.is_featured,
                              latitude: destination.latitude,
                              longitude: destination.longitude,
                              created_at: destination.created_at,
                              updated_at: destination.updated_at
                            }}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BedDouble size={24} className="text-blue-500" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No places to stay</h3>
                      <p className="text-muted-foreground">
                        There are currently no accommodations listed in {activeCity}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="destinations">
                  {activeCityData.destinations.filter(d => !d.categories?.includes('accommodation')).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeCityData.destinations
                        .filter(d => !d.categories?.includes('accommodation'))
                        .map((destination) => (
                          <DestinationCard 
                            key={destination.id} 
                            destination={destination} 
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Map size={24} className="text-blue-500" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No attractions found</h3>
                      <p className="text-muted-foreground">
                        There are currently no attractions or activities listed in {activeCity}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="events">
                  {activeCityData.events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeCityData.events.map((event) => (
                        <EventCard 
                          key={event.id} 
                          event={{
                            id: event.id,
                            title: event.title,
                            description: event.description || '',
                            location: event.location || 'Location not specified',
                            start_date: event.start_date,
                            end_date: event.end_date,
                            image_url: event.image_url,
                            price: event.price
                          }} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon size={24} className="text-blue-500" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No events found</h3>
                      <p className="text-muted-foreground">
                        There are currently no events scheduled in {activeCity}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe size={24} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Select a city</h3>
            <p className="text-muted-foreground">
              Choose a city from the list to see available destinations and events
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityGroupView;
