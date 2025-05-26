import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Search } from 'lucide-react';
import { getEvents, searchEvents, Event } from '@/models/Event';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, isAfter, isBefore, isPast } from 'date-fns';

const Events = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  // Get unique locations for filter
  const locations = Array.from(new Set(events.map(e => e.location).filter(Boolean))).sort();

  // Format date for display
  const formatEventDate = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return 'Date not specified';
    
    try {
      const start = format(parseISO(startDate), 'MMM d, yyyy');
      
      if (endDate) {
        const end = format(parseISO(endDate), 'MMM d, yyyy');
        return `${start} - ${end}`;
      }
      
      return start;
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Check if an event is expired
  const isEventExpired = (event: Event) => {
    if (!event.end_date && !event.start_date) return false;
    
    try {
      // If we have an end date, use that to determine expiry
      if (event.end_date) {
        const endDate = parseISO(event.end_date);
        return isPast(endDate);
      }
      
      // Otherwise use the start date
      if (event.start_date) {
        const startDate = parseISO(event.start_date);
        return isPast(startDate);
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  // Filter events based on search and filters
  useEffect(() => {
    if (!isLoading && events) {
      const filtered = events.filter(event => {
        const matchesSearch = !searchQuery || 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesLocation = locationFilter === 'all' || 
          (event.location && event.location === locationFilter);
        
        let matchesTime = true;
        const now = new Date();
        const expired = isEventExpired(event);
        
        if (timeFilter !== 'all') {
          if (timeFilter === 'upcoming') {
            matchesTime = !expired;
          } else if (timeFilter === 'past') {
            matchesTime = expired;
          }
        }
        
        return matchesSearch && matchesLocation && matchesTime;
      });
      
      setFilteredEvents(filtered);
    }
  }, [isLoading, events, searchQuery, locationFilter, timeFilter]);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already applied via the useEffect
  };

  // Add a function to handle booking
  const handleBookEvent = (event: Event) => {
    // Don't allow booking for expired events
    if (isEventExpired(event)) {
      return;
    }
    
    navigate(`/booking/event/${event.id}`, { 
      state: { eventDetails: event }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Browse Events</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
            >
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              List
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map(location => location && (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-1 block">Time</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit"
              className="mt-4 md:mt-0"
            >
              Apply Filters
            </Button>
          </form>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={view === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredEvents.map((event) => {
                  const isExpired = isEventExpired(event);
                  
                  return (
                    <Card 
                      key={event.id}
                      className={view === 'list' ? "overflow-hidden" : "overflow-hidden h-full flex flex-col"}
                    >
                      {view === 'grid' ? (
                        <>
                          <div className="h-48 overflow-hidden relative">
                            <img
                              src={event.image_url || '/placeholder.svg'}
                              alt={event.title}
                              className={`w-full h-full object-cover ${isExpired ? 'opacity-70 grayscale' : ''}`}
                            />
                            {isExpired && (
                              <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 m-2 rounded-md font-medium text-sm">
                                Expired
                              </div>
                            )}
                          </div>
                          <CardContent className="p-5 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-xl">{event.title}</h3>
                              {event.price !== null && (
                                <span className="font-medium text-green-700">${event.price}</span>
                              )}
                            </div>
                            {event.start_date && (
                              <div className="flex items-center text-muted-foreground mb-2">
                                <Calendar size={16} className="mr-1" />
                                <span className="text-sm">
                                  {formatEventDate(event.start_date, event.end_date)}
                                </span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center text-muted-foreground mb-4">
                                <MapPin size={16} className="mr-1" />
                                <span className="text-sm">{event.location}</span>
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                              {event.description}
                            </p>
                            <div className="mt-4">
                              {isExpired ? (
                                <Button 
                                  className="w-full bg-gray-400 cursor-not-allowed text-white"
                                  disabled
                                >
                                  Event Expired
                                </Button>
                              ) : (
                                <Button 
                                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                                  onClick={() => handleBookEvent(event)}
                                >
                                  Book Now
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </>
                      ) : (
                        <div className="flex">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <img
                              src={event.image_url || '/placeholder.svg'}
                              alt={event.title}
                              className={`w-full h-full object-cover ${isExpired ? 'opacity-70 grayscale' : ''}`}
                            />
                            {isExpired && (
                              <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-0.5 m-1 rounded-sm text-xs font-medium">
                                Expired
                              </div>
                            )}
                          </div>
                          <CardContent className="flex-grow p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg">{event.title}</h3>
                                {event.start_date && (
                                  <div className="flex items-center text-muted-foreground mb-1">
                                    <Calendar size={14} className="mr-1" />
                                    <span className="text-sm">
                                      {formatEventDate(event.start_date, event.end_date)}
                                    </span>
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center text-muted-foreground mb-2">
                                    <MapPin size={14} className="mr-1" />
                                    <span className="text-sm">{event.location}</span>
                                  </div>
                                )}
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {event.description}
                                </p>
                              </div>
                              <div className="text-right">
                                {event.price !== null && (
                                  <span className="font-medium text-green-700 block mb-2">${event.price}</span>
                                )}
                                {isExpired ? (
                                  <Button 
                                    size="sm" 
                                    className="bg-gray-400 cursor-not-allowed text-white"
                                    disabled
                                  >
                                    Expired
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                    onClick={() => handleBookEvent(event)}
                                  >
                                    Book
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Events;
