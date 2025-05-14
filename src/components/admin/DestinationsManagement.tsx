
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Destination, getDestinations } from '@/models/Destination';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Plus } from 'lucide-react';
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
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a number."
  })
});

const DestinationsManagement: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      price: ""
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      price: ""
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
        price: selectedDestination.price.toString()
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

  const handleAddDestination = (data: z.infer<typeof formSchema>) => {
    // This is a placeholder for the actual add function
    toast({
      title: 'Info',
      description: 'Add destination functionality is not implemented yet',
    });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsEditDialogOpen(true);
  };

  const handleSaveDestination = (data: z.infer<typeof formSchema>) => {
    // This is a placeholder for the actual update function
    toast({
      title: 'Info',
      description: 'Update destination functionality is not implemented yet',
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteDestination = (destinationId: string) => {
    // This is a placeholder for the actual delete function
    toast({
      title: 'Info',
      description: 'Delete destination functionality is not implemented yet',
    });
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Destination</DialogTitle>
            <DialogDescription>
              Enter the details for the new destination.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddDestination)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter destination name" {...field} />
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
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description" 
                        {...field} 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter price" 
                        type="number"
                        step="0.01" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Destination Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>
              Update the destination details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleSaveDestination)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter destination name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description" 
                        {...field} 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter price" 
                        type="number" 
                        step="0.01"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DestinationsManagement;
