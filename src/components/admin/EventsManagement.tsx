
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Event, getEvents, addEvent, updateEvent, deleteEvent, EventInput } from '@/models/Event';
import { Plus, Edit, Trash2, Calendar, MapPin, DollarSign, Clock, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import EventFormDialog from './EventFormDialog';

const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load events.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (data: EventInput) => {
    try {
      await addEvent(data);
      toast({
        title: 'Success',
        description: 'Event created successfully.',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create event.',
      });
    }
  };

  const handleEditEvent = async (data: EventInput) => {
    if (!selectedEvent) return;
    
    try {
      await updateEvent(selectedEvent.id, data);
      toast({
        title: 'Success',
        description: 'Event updated successfully.',
      });
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update event.',
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(id);
      toast({
        title: 'Success',
        description: 'Event deleted successfully.',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete event.',
      });
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.event_type === filterType;
    return matchesSearch && matchesType;
  });

  const eventTypes = ['all', 'festival', 'conference', 'workshop', 'concert', 'cultural', 'sports', 'exhibition', 'trade-show'];

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = event.start_date ? new Date(event.start_date) : null;
    const endDate = event.end_date ? new Date(event.end_date) : null;

    if (!startDate) return { status: 'draft', color: 'bg-gray-500' };
    if (now < startDate) return { status: 'upcoming', color: 'bg-blue-500' };
    if (endDate && now > endDate) return { status: 'completed', color: 'bg-green-500' };
    return { status: 'ongoing', color: 'bg-orange-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                Events Management
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Manage events, festivals, and activities
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="mt-2 text-slate-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-2 text-slate-600">No events found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    <TableHead className="font-semibold">Event</TableHead>
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => {
                    const eventStatus = getEventStatus(event);
                    return (
                      <motion.tr
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {event.image_url && (
                              <img
                                src={event.image_url}
                                alt={event.title}
                                className="h-12 w-12 rounded-lg object-cover shadow-md"
                              />
                            )}
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {event.title}
                              </div>
                              {event.event_type && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {event.event_type}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {event.start_date && (
                              <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(new Date(event.start_date), 'MMM dd, yyyy')}
                              </div>
                            )}
                            {event.start_date && (
                              <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(new Date(event.start_date), 'HH:mm')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-slate-600 dark:text-slate-300">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location || 'TBD'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-orange-600 font-semibold">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {event.price || 'Free'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${eventStatus.color} text-white`}>
                            {eventStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialogs */}
      <EventFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateEvent}
        title="Create New Event"
        description="Fill in the details to create a new event."
      />

      <EventFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleEditEvent}
        event={selectedEvent}
        title="Edit Event"
        description="Update the event information."
      />
    </div>
  );
};

export default EventsManagement;
