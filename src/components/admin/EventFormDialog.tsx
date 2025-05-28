
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Event, EventInput } from '@/models/Event';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  event_type: z.string().optional(),
  program_type: z.string().optional(),
  program_name: z.string().optional(),
  program_url: z.string().url().optional().or(z.literal('')),
  payment_url: z.string().url().optional().or(z.literal('')),
});

interface EventFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventInput) => Promise<void>;
  event?: Event | null;
  title: string;
  description: string;
}

const EventFormDialog: React.FC<EventFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  event,
  title,
  description,
}) => {
  const [ticketTypes, setTicketTypes] = React.useState<Array<{name: string, price: number, description?: string}>>(
    Array.isArray(event?.ticket_types) ? event.ticket_types : []
  );
  const [newTicketName, setNewTicketName] = React.useState('');
  const [newTicketPrice, setNewTicketPrice] = React.useState(0);
  const [newTicketDescription, setNewTicketDescription] = React.useState('');

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      location: event?.location || '',
      start_date: event?.start_date ? event.start_date.slice(0, 16) : '',
      end_date: event?.end_date ? event.end_date.slice(0, 16) : '',
      price: event?.price || 0,
      image_url: event?.image_url || '',
      event_type: event?.event_type || '',
      program_type: event?.program_type || '',
      program_name: event?.program_name || '',
      program_url: event?.program_url || '',
      payment_url: event?.payment_url || '',
    },
  });

  const addTicketType = () => {
    if (newTicketName.trim()) {
      setTicketTypes(prev => [...prev, {
        name: newTicketName.trim(),
        price: newTicketPrice,
        description: newTicketDescription.trim() || undefined
      }]);
      setNewTicketName('');
      setNewTicketPrice(0);
      setNewTicketDescription('');
    }
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: z.infer<typeof eventSchema>) => {
    // Ensure required fields are present
    const eventData: EventInput = {
      title: data.title,
      description: data.description,
      location: data.location,
      start_date: data.start_date,
      end_date: data.end_date,
      price: data.price,
      image_url: data.image_url,
      event_type: data.event_type,
      program_type: data.program_type,
      program_name: data.program_name,
      program_url: data.program_url,
      payment_url: data.payment_url,
      ticket_types: ticketTypes.length > 0 ? ticketTypes : null,
    };
    
    await onSubmit(eventData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Event title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Event location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Event description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="concert">Concert</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="exhibition">Exhibition</SelectItem>
                        <SelectItem value="trade-show">Trade Show</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/image.jpg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Ticket Types</FormLabel>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {ticketTypes.map((ticket, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2 p-2">
                      <div className="text-xs">
                        <div className="font-medium">{ticket.name}</div>
                        <div className="text-muted-foreground">${ticket.price}</div>
                        {ticket.description && (
                          <div className="text-muted-foreground">{ticket.description}</div>
                        )}
                      </div>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTicketType(index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    value={newTicketName}
                    onChange={(e) => setNewTicketName(e.target.value)}
                    placeholder="Ticket name"
                  />
                  <Input
                    type="number"
                    value={newTicketPrice}
                    onChange={(e) => setNewTicketPrice(Number(e.target.value))}
                    placeholder="Price"
                  />
                  <Input
                    value={newTicketDescription}
                    onChange={(e) => setNewTicketDescription(e.target.value)}
                    placeholder="Description (optional)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTicketType}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="program_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Conference, Workshop" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="program_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Official program name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="program_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://program.example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://payment.example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-orange-600 to-amber-600">
                {event ? 'Update' : 'Create'} Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormDialog;
