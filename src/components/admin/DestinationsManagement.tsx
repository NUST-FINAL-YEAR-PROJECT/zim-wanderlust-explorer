
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
import { Destination, getDestinations, addDestination, updateDestination, deleteDestination, DestinationInput } from '@/models/Destination';
import { Plus, Edit, Trash2, MapPin, DollarSign, Star, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import DestinationFormDialog from './DestinationFormDialog';

const DestinationsManagement: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load destinations.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDestination = async (data: DestinationInput) => {
    try {
      await addDestination(data);
      toast({
        title: 'Success',
        description: 'Destination created successfully.',
      });
      fetchDestinations();
    } catch (error) {
      console.error('Error creating destination:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create destination.',
      });
    }
  };

  const handleEditDestination = async (data: DestinationInput) => {
    if (!selectedDestination) return;
    
    try {
      await updateDestination(selectedDestination.id, data);
      toast({
        title: 'Success',
        description: 'Destination updated successfully.',
      });
      setSelectedDestination(null);
      fetchDestinations();
    } catch (error) {
      console.error('Error updating destination:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update destination.',
      });
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    
    try {
      await deleteDestination(id);
      toast({
        title: 'Success',
        description: 'Destination deleted successfully.',
      });
      fetchDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete destination.',
      });
    }
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || 
                           destination.categories?.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'nature', 'adventure', 'cultural', 'wildlife', 'historical'];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-100">
                Destinations Management
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Manage travel destinations and their information
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Destination
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
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destinations Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-slate-600">Loading destinations...</p>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="py-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-2 text-slate-600">No destinations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    <TableHead className="font-semibold">Destination</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Categories</TableHead>
                    <TableHead className="font-semibold">Featured</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDestinations.map((destination) => (
                    <motion.tr
                      key={destination.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {destination.image_url && (
                            <img
                              src={destination.image_url}
                              alt={destination.name}
                              className="h-12 w-12 rounded-lg object-cover shadow-md"
                            />
                          )}
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {destination.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                              {destination.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                          <MapPin className="h-4 w-4 mr-1" />
                          {destination.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-green-600 font-semibold">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {destination.price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {destination.categories?.slice(0, 2).map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                          {destination.categories && destination.categories.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{destination.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {destination.is_featured && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedDestination(destination);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteDestination(destination.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialogs */}
      <DestinationFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateDestination}
        title="Create New Destination"
        description="Fill in the details to create a new destination."
      />

      <DestinationFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedDestination(null);
        }}
        onSubmit={handleEditDestination}
        destination={selectedDestination}
        title="Edit Destination"
        description="Update the destination information."
      />
    </div>
  );
};

export default DestinationsManagement;
