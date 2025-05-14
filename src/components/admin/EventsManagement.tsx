
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Event, getEvents, addEvent, updateEvent, deleteEvent } from '@/models/Event';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Plus, Save } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0).optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  event_type: z.string().optional().nullable(),
  program_type: z.string().optional().nullable(),
  program_name: z.string().optional().nullable(),
  program_url: z.string().url().optional().nullable(),
  payment_url: z.string().url().optional().nullable(),
  ticket_types: z.string().optional().nullable().transform(val => {
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch (e) {
      return null;
    }
  }),
});

type EventFormValues = z.infer<typeof formSchema>;

const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
      price: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      image_url: "",
      event_type: "",
      program_type: "",
      program_name: "",
      program_url: "",
      payment_url: "",
      ticket_types: "",
    },
  });

  const editForm = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
      price: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      image_url: "",
      event_type: "",
      program_type: "",
      program_name: "",
      program_url: "",
      payment_url: "",
      ticket_types: "",
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent && isEditDialogOpen) {
      editForm.reset({
        title: selectedEvent.title,
        location: selectedEvent.location || "",
        description: selectedEvent.description || "",
        price: selectedEvent.price || 0,
        start_date: selectedEvent.start_date ? selectedEvent.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
        end_date: selectedEvent.end_date ? selectedEvent.end_date.split('T')[0] : new Date().toISOString().split('T')[0],
        image_url: selectedEvent.image_url || "",
        event_type: selectedEvent.event_type || "",
        program_type: selectedEvent.program_type || "",
        program_name: selectedEvent.program_name || "",
        program_url: selectedEvent.program_url || "",
        payment_url: selectedEvent.payment_url || "",
        ticket_types: selectedEvent.ticket_types ? JSON.stringify(selectedEvent.ticket_types) : "",
      });
    }
  }, [selectedEvent, isEditDialogOpen, editForm]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (data: EventFormValues) => {
    try {
      await addEvent(data);
      toast({
        title: 'Success',
        description: 'Event added successfully',
      });
      setIsAddDialogOpen(false);
      form.reset();
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add event',
        variant: 'destructive',
      });
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleSaveEvent = async (data: EventFormValues) => {
    if (!selectedEvent) return;
    
    try {
      await updateEvent(selectedEvent.id, data);
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
      setIsEditDialogOpen(false);
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setIsDeleting(true);
    try {
      await deleteEvent(eventId);
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'start_date', label: 'Start Date', type: 'date' },
    { name: 'end_date', label: 'End Date', type: 'date' },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'event_type', label: 'Event Type', type: 'text' },
    { name: 'program_type', label: 'Program Type', type: 'text' },
    { name: 'program_name', label: 'Program Name', type: 'text' },
    { name: 'program_url', label: 'Program URL', type: 'text' },
    { name: 'payment_url', label: 'Payment URL', type: 'text' },
    { name: 'ticket_types', label: 'Ticket Types (JSON format)', type: 'textarea' },
  ];

  const renderFormField = (field: any, formInstance: any) => {
    return (
      <FormField
        key={field.name}
        control={formInstance.control}
        name={field.name}
        render={({ field: fieldProps }) => (
          <FormItem>
            <FormLabel>{field.label}{field.required && ' *'}</FormLabel>
            <FormControl>
              {field.type === 'textarea' ? (
                <Textarea 
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  {...fieldProps}
                  className={field.name === 'description' ? "min-h-[100px]" : ""}
                />
              ) : (
                <Input 
                  placeholder={`Enter ${field.label.toLowerCase()}`} 
                  type={field.type}
                  step={field.type === 'number' ? "0.01" : undefined}
                  {...fieldProps} 
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Event Management</CardTitle>
          <CardDescription>Add, edit, and remove events</CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                        {event.image_url ? (
                          <img 
                            src={event.image_url} 
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">No image</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.location || 'N/A'}</TableCell>
                    <TableCell>
                      {formatDate(event.start_date)}
                      {event.end_date ? ` - ${formatDate(event.end_date)}` : ''}
                    </TableCell>
                    <TableCell>{event.price ? `$${event.price.toFixed(2)}` : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Enter the details for the new event.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddEvent)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map(field => (
                  <div key={field.name} className={field.name === 'description' || field.name === 'ticket_types' ? "col-span-1 md:col-span-2" : ""}>
                    {renderFormField(field, form)}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleSaveEvent)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map(field => (
                  <div key={field.name} className={field.name === 'description' || field.name === 'ticket_types' ? "col-span-1 md:col-span-2" : ""}>
                    {renderFormField(field, editForm)}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EventsManagement;
