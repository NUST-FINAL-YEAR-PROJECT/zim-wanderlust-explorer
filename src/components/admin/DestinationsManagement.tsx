
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Destination, getDestinations, addDestination, updateDestination, deleteDestination } from '@/models/Destination';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Save } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  image_url: z.string().url().optional().nullable(),
  activities: z.string().optional().nullable().transform(val => val ? val.split(',').map(item => item.trim()) : null),
  best_time_to_visit: z.string().optional().nullable(),
  duration_recommended: z.string().optional().nullable(),
  difficulty_level: z.string().optional().nullable(),
  amenities: z.string().optional().nullable().transform(val => val ? val.split(',').map(item => item.trim()) : null),
  what_to_bring: z.string().optional().nullable().transform(val => val ? val.split(',').map(item => item.trim()) : null),
  highlights: z.string().optional().nullable().transform(val => val ? val.split(',').map(item => item.trim()) : null),
  weather_info: z.string().optional().nullable(),
  getting_there: z.string().optional().nullable(),
  categories: z.string().optional().nullable().transform(val => val ? val.split(',').map(item => item.trim()) : null),
  additional_images: z.string().optional().nullable().transform(val => val ? val.split(',').map(item => item.trim()) : null),
  additional_costs: z.string().optional().nullable().transform(val => {
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch (e) {
      return null;
    }
  }),
  is_featured: z.boolean().default(false),
  payment_url: z.string().url().optional().nullable(),
});

type DestinationFormValues = z.infer<typeof formSchema>;

const DestinationsManagement: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      price: 0,
      image_url: "",
      activities: "",
      best_time_to_visit: "",
      duration_recommended: "",
      difficulty_level: "",
      amenities: "",
      what_to_bring: "",
      highlights: "",
      weather_info: "",
      getting_there: "",
      categories: "",
      additional_images: "",
      additional_costs: "",
      is_featured: false,
      payment_url: "",
    },
  });

  const editForm = useForm<DestinationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      price: 0,
      image_url: "",
      activities: "",
      best_time_to_visit: "",
      duration_recommended: "",
      difficulty_level: "",
      amenities: "",
      what_to_bring: "",
      highlights: "",
      weather_info: "",
      getting_there: "",
      categories: "",
      additional_images: "",
      additional_costs: "",
      is_featured: false,
      payment_url: "",
    },
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selectedDestination && isEditDialogOpen) {
      editForm.reset({
        name: selectedDestination.name,
        location: selectedDestination.location,
        description: selectedDestination.description || "",
        price: selectedDestination.price,
        image_url: selectedDestination.image_url || "",
        activities: selectedDestination.activities ? selectedDestination.activities.join(', ') : "",
        best_time_to_visit: selectedDestination.best_time_to_visit || "",
        duration_recommended: selectedDestination.duration_recommended || "",
        difficulty_level: selectedDestination.difficulty_level || "",
        amenities: selectedDestination.amenities ? selectedDestination.amenities.join(', ') : "",
        what_to_bring: selectedDestination.what_to_bring ? selectedDestination.what_to_bring.join(', ') : "",
        highlights: selectedDestination.highlights ? selectedDestination.highlights.join(', ') : "",
        weather_info: selectedDestination.weather_info || "",
        getting_there: selectedDestination.getting_there || "",
        categories: selectedDestination.categories ? selectedDestination.categories.join(', ') : "",
        additional_images: selectedDestination.additional_images ? selectedDestination.additional_images.join(', ') : "",
        additional_costs: selectedDestination.additional_costs ? JSON.stringify(selectedDestination.additional_costs) : "",
        is_featured: selectedDestination.is_featured || false,
        payment_url: selectedDestination.payment_url || "",
      });
    }
  }, [selectedDestination, isEditDialogOpen, editForm]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch destinations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDestination = async (data: DestinationFormValues) => {
    try {
      await addDestination(data);
      toast({
        title: 'Success',
        description: 'Destination added successfully',
      });
      setIsAddDialogOpen(false);
      form.reset();
      fetchDestinations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add destination',
        variant: 'destructive',
      });
    }
  };

  const handleEditDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsEditDialogOpen(true);
  };

  const handleSaveDestination = async (data: DestinationFormValues) => {
    if (!selectedDestination) return;
    
    try {
      await updateDestination(selectedDestination.id, data);
      toast({
        title: 'Success',
        description: 'Destination updated successfully',
      });
      setIsEditDialogOpen(false);
      fetchDestinations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update destination',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDestination = async (destinationId: string) => {
    setIsDeleting(true);
    try {
      await deleteDestination(destinationId);
      toast({
        title: 'Success',
        description: 'Destination deleted successfully',
      });
      fetchDestinations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete destination',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'activities', label: 'Activities (comma separated)', type: 'text' },
    { name: 'best_time_to_visit', label: 'Best Time to Visit', type: 'text' },
    { name: 'duration_recommended', label: 'Recommended Duration', type: 'text' },
    { name: 'difficulty_level', label: 'Difficulty Level', type: 'text' },
    { name: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
    { name: 'what_to_bring', label: 'What to Bring (comma separated)', type: 'text' },
    { name: 'highlights', label: 'Highlights (comma separated)', type: 'text' },
    { name: 'weather_info', label: 'Weather Information', type: 'text' },
    { name: 'getting_there', label: 'Getting There', type: 'text' },
    { name: 'categories', label: 'Categories (comma separated)', type: 'text' },
    { name: 'additional_images', label: 'Additional Images (comma separated URLs)', type: 'text' },
    { name: 'additional_costs', label: 'Additional Costs (JSON format)', type: 'textarea' },
    { name: 'is_featured', label: 'Featured Destination', type: 'switch' },
    { name: 'payment_url', label: 'Payment URL', type: 'text' },
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
              ) : field.type === 'switch' ? (
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={fieldProps.value}
                    onCheckedChange={fieldProps.onChange}
                  />
                  <span>{fieldProps.value ? 'Yes' : 'No'}</span>
                </div>
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
          <CardTitle>Destination Management</CardTitle>
          <CardDescription>Add, edit, and remove destinations</CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Destination
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
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                        {destination.image_url ? (
                          <img 
                            src={destination.image_url} 
                            alt={destination.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">No image</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{destination.name}</TableCell>
                    <TableCell>{destination.location}</TableCell>
                    <TableCell>${destination.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {destination.is_featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditDestination(destination)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteDestination(destination.id)}
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

      {/* Add Destination Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Destination</DialogTitle>
            <DialogDescription>
              Enter the details for the new destination.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddDestination)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map(field => (
                  <div key={field.name} className={field.name === 'description' ? "col-span-1 md:col-span-2" : ""}>
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

      {/* Edit Destination Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>
              Update the destination details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleSaveDestination)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map(field => (
                  <div key={field.name} className={field.name === 'description' ? "col-span-1 md:col-span-2" : ""}>
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

export default DestinationsManagement;
