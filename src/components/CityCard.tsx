
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Eye, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import DestinationCard from './DestinationCard';
import EventCard from './EventCard';
import { Destination } from '@/models/Destination';
import { Event } from '@/models/Event';

interface CityCardProps {
  city: string;
  destinations: Destination[];
  events: Event[];
  className?: string;
}

const CityCard = ({ city, destinations, events, className = '' }: CityCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const totalItems = destinations.length + events.length;
  const featuredDestination = destinations[0];
  const featuredEvent = events[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img
            src={featuredDestination?.image_url || featuredEvent?.image_url || '/placeholder.svg'}
            alt={city}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold">{city}</h3>
            <p className="text-white/90 text-sm">{totalItems} items available</p>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-blue-700">
              <MapPin size={14} className="mr-1" />
              {destinations.length} Places
            </Badge>
          </div>
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 text-orange-700">
              <Calendar size={14} className="mr-1" />
              {events.length} Events
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200">Explore {city}</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Heart size={16} className="mr-1" />
              Save
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {featuredDestination && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Featured Destination</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{featuredDestination.name}</p>
              <p className="text-xs text-blue-500 dark:text-blue-500">${featuredDestination.price}/night</p>
            </div>
          )}
          
          {featuredEvent && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Upcoming Event</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">{featuredEvent.title}</p>
              <p className="text-xs text-orange-500 dark:text-orange-500">
                {featuredEvent.start_date && new Date(featuredEvent.start_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Eye size={16} className="mr-2" />
                Explore {city}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl text-blue-800 dark:text-blue-200">
                  Discover {city}
                </DialogTitle>
                <DialogDescription>
                  Explore all destinations and events available in {city}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All ({totalItems})</TabsTrigger>
                  <TabsTrigger value="destinations">Places ({destinations.length})</TabsTrigger>
                  <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[60vh] mt-4">
                  <TabsContent value="all" className="space-y-6">
                    {destinations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">
                          Places to Stay
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {destinations.map((destination) => (
                            <DestinationCard key={destination.id} destination={destination} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {events.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-orange-700 dark:text-orange-300">
                          Events
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="destinations">
                    {destinations.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {destinations.map((destination) => (
                          <DestinationCard key={destination.id} destination={destination} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No destinations found in {city}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="events">
                    {events.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No events found in {city}</p>
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CityCard;
