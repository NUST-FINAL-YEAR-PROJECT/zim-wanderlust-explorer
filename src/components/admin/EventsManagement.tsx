import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Event, getEvents, addEvent, updateEvent, deleteEvent, EventInput } from '@/models/Event';
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
import { Edit, Trash2, Plus, Save, Copy } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

// Define the ticket type structure
const ticketTypeSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  quantity: z.coerce.number().int().min(0, "Quantity must be a positive integer"),
  description: z.string().optional(),
});

type TicketType = z.infer<typeof ticketTypeSchema>;

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
  ticket_types: z.array(ticketTypeSchema).optional().nullable(),
});

type EventFormValues = z.infer<typeof formSchema>;

const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [addingTicket, setAddingTicket] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<TicketType | null>(null);
  const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(null);
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
      ticket_types: [],
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
      ticket_types: [],
    },
  });

  const ticketForm = useForm<TicketType>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      description: "",
    }
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent && isEditDialogOpen) {
      let currentTickets: TicketType[] = [];
      
      if (selectedEvent.ticket_types && Array.isArray(selectedEvent.ticket_types)) {
        currentTickets = selectedEvent.ticket_types;
      } else if (selectedEvent.ticket_types && typeof selectedEvent.ticket_types === 'object') {
        currentTickets = Object.entries(selectedEvent.ticket_types).map(([name, details]) => ({
          name,
          ...details,
        }));
      }
      
      setTicketTypes(currentTickets);
      
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
        ticket_types: currentTickets,
      });
    }
  }, [selectedEvent, isEditDialogOpen, editForm]);

  useEffect(() => {
    // Update the main form's ticket_types field when ticketTypes state changes
    if (isAddDialogOpen) {
      form.setValue('ticket_types', ticketTypes);
    } else if (isEditDialogOpen) {
      editForm.setValue('ticket_types', ticketTypes);
    }
  }, [ticketTypes, isAddDialogOpen, isEditDialogOpen, form, editForm]);

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
      // Create an event object that matches the required structure
      const newEvent: Omit<Event, 'id' | 'created_at' | 'updated_at'> = {
        title: data.title,
        description: data.description,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        price: data.price,
        ticket_types: data.ticket_types,
        image_url: data.image_url,
        event_type: data.event_type,
        program_type: data.program_type,
        program_name: data.program_name,
        program_url: data.program_url,
        payment_url: data.payment_url
      };
      
      await addEvent(newEvent);
      toast({
        title: 'Success',
        description: 'Event added successfully',
      });
      setIsAddDialogOpen(false);
      setTicketTypes([]);
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
      // Create an updates object that matches the required structure
      const updates: Partial<EventInput> = {
        title: data.title,
        description: data.description,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        price: data.price,
        ticket_types: data.ticket_types,
        image_url: data.image_url,
        event_type: data.event_type,
        program_type: data.program_type,
        program_name: data.program_name,
        program_url: data.program_url,
        payment_url: data.payment_url
      };
      
      await updateEvent(selectedEvent.id, updates);
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
      setIsEditDialogOpen(false);
      setTicketTypes([]);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
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

  const handleAddTicketType = () => {
    const result = ticketForm.handleSubmit((data) => {
      if (editingTicketIndex !== null) {
        // Update existing ticket
        const updatedTickets = [...ticketTypes];
        updatedTickets[editingTicketIndex] = data;
        setTicketTypes(updatedTickets);
        setEditingTicketIndex(null);
      } else {
        // Add new ticket
        setTicketTypes([...ticketTypes, data]);
      }
      
      ticketForm.reset({
        name: "",
        price: 0,
        quantity: 0,
        description: "",
      });
      
      setAddingTicket(false);
      setCurrentTicket(null);
    })();
  };

  const handleEditTicket = (ticket: TicketType, index: number) => {
    setCurrentTicket(ticket);
    setEditingTicketIndex(index);
    setAddingTicket(true);
    
    ticketForm.reset({
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      description: ticket.description || "",
    });
  };

  const handleRemoveTicket = (index: number) => {
    const newTicketTypes = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(newTicketTypes);
  };

  const formFields = [
    { name: 'title', label: 'Title', type: 'text', required: true, gridSpan: false },
    { name: 'location', label: 'Location', type: 'text', gridSpan: false },
    { name: 'description', label: 'Description', type: 'textarea', gridSpan: true },
    { name: 'price', label: 'Base Price', type: 'number', gridSpan: false },
    { name: 'start_date', label: 'Start Date', type: 'date', gridSpan: false },
    { name: 'end_date', label: 'End Date', type: 'date', gridSpan: false },
    { name: 'image_url', label: 'Image URL', type: 'text', gridSpan: true },
    { name: 'event_type', label: 'Event Type', type: 'text', gridSpan: false },
    { name: 'program_type', label: 'Program Type', type: 'text', gridSpan: false },
    { name: 'program_name', label: 'Program Name', type: 'text', gridSpan: false },
    { name: 'program_url', label: 'Program URL', type: 'text', gridSpan: false },
    { name: 'payment_url', label: 'Payment URL', type: 'text', gridSpan: true },
  ];

  const renderFormField = (field: any, formInstance: any) => {
    return (
      <FormField
        key={field.name}
        control={formInstance.control}
        name={field.name}
        render={({ field: fieldProps }) => (
          <FormItem className={field.gridSpan ? "col-span-2" : ""}>
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
    <div className="container mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Event Management</CardTitle>
            <CardDescription>Add, edit, and remove events</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No events found. Click "Add Event" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => (
                      <TableRow key={event.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                            {event.image_url ? (
                              <img 
                                src={event.image_url} 
                                alt={event.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">No image</span>
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
                          <div className="flex space-x-2 justify-end">
                            <Button 
                              variant="outline"
                              size="icon"
                              className="hover:bg-gray-100"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline"
                              size="icon"
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              onClick={() => handleDeleteEvent(event.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Enter the details for the new event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddEvent)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formFields.map(field => renderFormField(field, form))}
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Ticket Types</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => {
                        setAddingTicket(true);
                        setCurrentTicket(null);
                        setEditingTicketIndex(null);
                        ticketForm.reset();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Ticket
                    </Button>
                  </div>
                  
                  {addingTicket ? (
                    <div className="border rounded-md p-4 mb-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={ticketForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ticket Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. General Admission" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price *</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Available Quantity *</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Ticket description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setAddingTicket(false);
                            setCurrentTicket(null);
                            setEditingTicketIndex(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleAddTicketType}
                        >
                          {editingTicketIndex !== null ? 'Update Ticket' : 'Add Ticket'}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  
                  {ticketTypes.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-100">
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ticketTypes.map((ticket, index) => (
                            <TableRow key={index} className="bg-white">
                              <TableCell className="font-medium">{ticket.name}</TableCell>
                              <TableCell>${ticket.price.toFixed(2)}</TableCell>
                              <TableCell>{ticket.quantity}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2 justify-end">
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleEditTicket(ticket, index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleRemoveTicket(index)}
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
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-white rounded-md border">
                      No ticket types added. Click "Add Ticket" to create one.
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Event
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleSaveEvent)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formFields.map(field => renderFormField(field, editForm))}
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Ticket Types</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => {
                        setAddingTicket(true);
                        setCurrentTicket(null);
                        setEditingTicketIndex(null);
                        ticketForm.reset();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Ticket
                    </Button>
                  </div>
                  
                  {addingTicket ? (
                    <div className="border rounded-md p-4 mb-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={ticketForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ticket Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. General Admission" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price *</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity *</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Ticket description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setAddingTicket(false);
                            setCurrentTicket(null);
                            setEditingTicketIndex(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleAddTicketType}
                        >
                          {editingTicketIndex !== null ? 'Update Ticket' : 'Add Ticket'}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  
                  {ticketTypes.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-100">
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ticketTypes.map((ticket, index) => (
                            <TableRow key={index} className="bg-white">
                              <TableCell className="font-medium">{ticket.name}</TableCell>
                              <TableCell>${ticket.price.toFixed(2)}</TableCell>
                              <TableCell>{ticket.quantity}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2 justify-end">
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleEditTicket(ticket, index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleRemoveTicket(index)}
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
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-white rounded-md border">
                      No ticket types added. Click "Add Ticket" to create one.
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManagement;
