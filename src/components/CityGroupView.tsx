
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import DestinationCard from './DestinationCard';
import EventCard from './EventCard';

interface Destination {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  [key: string]: any;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  [key: string]: any;
}

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

  // Find the currently active city data
  const activeCityData = data.find(item => item.city === activeCity) || { 
    city: '', 
    destinations: [], 
    events: [] 
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6", className)}>
      {/* City selection sidebar */}
      <Card className="md:col-span-1 bg-white dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 flex items-center text-blue-700 dark:text-blue-300">
            <MapPin size={18} className="mr-2" />
            Cities
          </h3>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2 pr-4">
              {data.map((cityData) => (
                <Button
                  key={cityData.city}
                  variant={activeCity === cityData.city ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    activeCity === cityData.city 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
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
          <motion.div
            key={activeCity}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                Explore {activeCity}
              </h2>
              <p className="text-blue-600 dark:text-blue-400">
                Discover places to stay and exciting events in {activeCity}
              </p>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="destinations">Places to Stay ({activeCityData.destinations.length})</TabsTrigger>
                <TabsTrigger value="events">Events ({activeCityData.events.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {activeCityData.destinations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300 flex items-center">
                      <MapPin size={18} className="mr-2" /> Places to Stay
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeCityData.destinations.map((destination) => (
                        <DestinationCard key={destination.id} destination={destination} />
                      ))}
                    </div>
                  </div>
                )}
                
                {activeCityData.events.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300 flex items-center">
                      <MapPin size={18} className="mr-2" /> Events
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeCityData.events.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                )}
                
                {activeCityData.destinations.length === 0 && activeCityData.events.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin size={24} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No listings found</h3>
                    <p className="text-muted-foreground">
                      There are currently no destinations or events in {activeCity}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="destinations">
                {activeCityData.destinations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCityData.destinations.map((destination) => (
                      <DestinationCard key={destination.id} destination={destination} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No places to stay</h3>
                    <p className="text-muted-foreground">
                      There are currently no accommodations listed in {activeCity}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="events">
                {activeCityData.events.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCityData.events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No events found</h3>
                    <p className="text-muted-foreground">
                      There are currently no events scheduled in {activeCity}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <div className="text-center py-12">
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
