import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
import { Form } from '@/components/ui/form';
import { Edit, Trash2, Plus, Save, X, Map } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';
import DestinationForm, { formSchema, DestinationFormValues } from './DestinationForm';
import { z } from 'zod';

// Define schema for additional costs
const additionalCostSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().optional(),
});

type AdditionalCost = z.infer<typeof additionalCostSchema>;

const DestinationsManagement: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);
  const [addingCost, setAddingCost] = useState(false);
  const [editingCostIndex, setEditingCostIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      price: 0,
      image_url: "",
      activities: [],
      best_time_to_visit: "",
      duration_recommended: "",
      difficulty_level: "",
      amenities: [],
      what_to_bring: [],
      highlights: [],
      weather_info: "",
      getting_there: "",
      categories: [],
      additional_images: [],
      is_featured: false,
      payment_url: "",
      latitude: null,
      longitude: null,
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
      activities: [],
      best_time_to_visit: "",
      duration_recommended: "",
      difficulty_level: "",
      amenities: [],
      what_to_bring: [],
      highlights: [],
      weather_info: "",
      getting_there: "",
      categories: [],
      additional_images: [],
      is_featured: false,
      payment_url: "",
      latitude: null,
      longitude: null,
    },
  });

  const costForm = useForm({
    resolver: zodResolver(additionalCostSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    }
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selectedDestination && isEditDialogOpen) {
      // Handle additional costs parsing
      let costsArray: AdditionalCost[] = [];
      if (selectedDestination.additional_costs) {
        if (Array.isArray(selectedDestination.additional_costs)) {
          costsArray = selectedDestination.additional_costs;
        } else {
          costsArray = Object.entries(selectedDestination.additional_costs).map(([name, details]) => ({
            name,
            ...details,
          }));
        }
      }
      
      setAdditionalCosts(costsArray);
      
      editForm.reset({
        name: selectedDestination.name,
        location: selectedDestination.location,
        description: selectedDestination.description || "",
        price: selectedDestination.price,
        image_url: selectedDestination.image_url || "",
        activities: selectedDestination.activities || [],
        best_time_to_visit: selectedDestination.best_time_to_visit || "",
        duration_recommended: selectedDestination.duration_recommended || "",
        difficulty_level: selectedDestination.difficulty_level || "",
        amenities: selectedDestination.amenities || [],
        what_to_bring: selectedDestination.what_to_bring || [],
        highlights: selectedDestination.highlights || [],
        weather_info: selectedDestination.weather_info || "",
        getting_there: selectedDestination.getting_there || "",
        categories: selectedDestination.categories || [],
        additional_images: selectedDestination.additional_images || [],
        is_featured: selectedDestination.is_featured || false,
        payment_url: selectedDestination.payment_url || "",
        latitude: selectedDestination.latitude || null,
        longitude: selectedDestination.longitude || null,
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
      // Create a destination object that matches the required structure
      const newDestination = {
        ...data,
        additional_costs: additionalCosts.length > 0 ? additionalCosts : null,
      };
      
      await addDestination(newDestination);
      toast({
        title: 'Success',
        description: 'Destination added successfully',
      });
      setIsAddDialogOpen(false);
      setAdditionalCosts([]);
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
      // Create an updates object that matches the required structure
      const updates = {
        ...data,
        additional_costs: additionalCosts.length > 0 ? additionalCosts : null,
      };
      
      await updateDestination(selectedDestination.id, updates);
      toast({
        title: 'Success',
        description: 'Destination updated successfully',
      });
      setIsEditDialogOpen(false);
      setAdditionalCosts([]);
      fetchDestinations();
    } catch (error) {
      console.error('Error updating destination:', error);
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

  const handleAddCost = () => {
    costForm.handleSubmit((data) => {
      if (editingCostIndex !== null) {
        // Update existing cost
        const updatedCosts = [...additionalCosts];
        updatedCosts[editingCostIndex] = data;
        setAdditionalCosts(updatedCosts);
        setEditingCostIndex(null);
      } else {
        // Add new cost
        setAdditionalCosts([...additionalCosts, data]);
      }
      
      costForm.reset({
        name: "",
        price: 0,
        description: "",
      });
      
      setAddingCost(false);
    })();
  };

  const handleEditCost = (cost: AdditionalCost, index: number) => {
    setEditingCostIndex(index);
    setAddingCost(true);
    
    costForm.reset({
      name: cost.name,
      price: cost.price,
      description: cost.description || "",
    });
  };

  const handleRemoveCost = (index: number) => {
    const newCosts = additionalCosts.filter((_, i) => i !== index);
    setAdditionalCosts(newCosts);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Destination Management</CardTitle>
            <CardDescription>Add, edit, and remove destinations</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Destination
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
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No destinations found. Click "Add Destination" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    destinations.map((destination) => (
                      <TableRow key={destination.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                            {destination.image_url ? (
                              <img 
                                src={destination.image_url} 
                                alt={destination.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">No image</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {destination.name}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {destination.additional_images && destination.additional_images.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {destination.additional_images.length + 1} Images
                              </Badge>
                            )}
                            {destination.latitude && destination.longitude && (
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <Map className="h-3 w-3" />
                                Map
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{destination.location}</TableCell>
                        <TableCell>${destination.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {destination.is_featured ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              Featured
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600 bg-transparent">
                              Standard
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 justify-end">
                            <Button 
                              variant="outline"
                              size="icon"
                              className="hover:bg-gray-100"
                              onClick={() => handleEditDestination(destination)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline"
                              size="icon"
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              onClick={() => handleDeleteDestination(destination.id)}
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

      {/* Add Destination Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Destination</DialogTitle>
            <DialogDescription>
              Enter the details for the new destination.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddDestination)} className="space-y-6">
                <DestinationForm form={form} />
                
                <div className="border p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Additional Costs</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => {
                        setAddingCost(true);
                        setEditingCostIndex(null);
                        costForm.reset();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Cost
                    </Button>
                  </div>
                  
                  {/* Additional Costs Management */}
                  <div className="border rounded-md p-4 mb-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={costForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Guide fee" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={costForm.control}
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
                        control={costForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Describe this additional cost" {...field} />
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
                          setAddingCost(false);
                          setEditingCostIndex(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleAddCost}
                      >
                        {editingCostIndex !== null ? 'Update Cost' : 'Add Cost'}
                      </Button>
                    </div>
                  </div>
                  
                  {additionalCosts.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-100">
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {additionalCosts.map((cost, index) => (
                            <TableRow key={index} className="bg-white">
                              <TableCell className="font-medium">{cost.name}</TableCell>
                              <TableCell>${cost.price.toFixed(2)}</TableCell>
                              <TableCell>{cost.description || '-'}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2 justify-end">
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleEditCost(cost, index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleRemoveCost(index)}
                                  >
                                    <X className="h-4 w-4" />
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
                      No additional costs added. Click "Add Cost" to create one.
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Destination
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Destination Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>
              Update the destination details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleSaveDestination)} className="space-y-6">
                <DestinationForm form={editForm} />
                
                <div className="border p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Additional Costs</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => {
                        setAddingCost(true);
                        setEditingCostIndex(null);
                        costForm.reset();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Cost
                    </Button>
                  </div>
                  
                  {/* Additional Costs Management */}
                  <div className="border rounded-md p-4 mb-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={costForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Guide fee" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={costForm.control}
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
                        control={costForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Describe this additional cost" {...field} />
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
                          setAddingCost(false);
                          setEditingCostIndex(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleAddCost}
                      >
                        {editingCostIndex !== null ? 'Update Cost' : 'Add Cost'}
                      </Button>
                    </div>
                  </div>
                  
                  {additionalCosts.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-100">
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {additionalCosts.map((cost, index) => (
                            <TableRow key={index} className="bg-white">
                              <TableCell className="font-medium">{cost.name}</TableCell>
                              <TableCell>${cost.price.toFixed(2)}</TableCell>
                              <TableCell>{cost.description || '-'}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2 justify-end">
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleEditCost(cost, index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleRemoveCost(index)}
                                  >
                                    <X className="h-4 w-4" />
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
                      No additional costs added. Click "Add Cost" to create one.
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

export default DestinationsManagement;
