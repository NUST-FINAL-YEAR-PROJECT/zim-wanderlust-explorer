
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Bed, MapPin, Star, Users } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

const AccommodationsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState<any>(null);
  const queryClient = useQueryClient();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price_per_night: 0,
    max_guests: 2,
    image_url: '',
    amenities: [] as string[],
    is_featured: false,
    rating: 0,
    review_count: 0,
  });

  const { data: accommodations = [], isLoading } = useQuery({
    queryKey: ['admin-accommodations', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('accommodations')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      price_per_night: 0,
      max_guests: 2,
      image_url: '',
      amenities: [],
      is_featured: false,
      rating: 0,
      review_count: 0,
    });
  };

  const handleCreate = async () => {
    try {
      const { error } = await supabase
        .from('accommodations')
        .insert([formData]);

      if (error) throw error;

      toast.success('Accommodation created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
    } catch (error) {
      console.error('Error creating accommodation:', error);
      toast.error('Failed to create accommodation');
    }
  };

  const handleEdit = (accommodation: any) => {
    setSelectedAccommodation(accommodation);
    setFormData({
      name: accommodation.name,
      description: accommodation.description || '',
      location: accommodation.location,
      price_per_night: accommodation.price_per_night,
      max_guests: accommodation.max_guests || 2,
      image_url: accommodation.image_url || '',
      amenities: accommodation.amenities || [],
      is_featured: accommodation.is_featured || false,
      rating: accommodation.rating || 0,
      review_count: accommodation.review_count || 0,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedAccommodation) return;

    try {
      const { error } = await supabase
        .from('accommodations')
        .update(formData)
        .eq('id', selectedAccommodation.id);

      if (error) throw error;

      toast.success('Accommodation updated successfully!');
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedAccommodation(null);
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
    } catch (error) {
      console.error('Error updating accommodation:', error);
      toast.error('Failed to update accommodation');
    }
  };

  const handleDelete = async (accommodationId: string) => {
    if (!confirm('Are you sure you want to delete this accommodation?')) return;

    try {
      const { error } = await supabase
        .from('accommodations')
        .delete()
        .eq('id', accommodationId);

      if (error) throw error;

      toast.success('Accommodation deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      toast.error('Failed to delete accommodation');
    }
  };

  const handleAmenitiesChange = (amenities: string) => {
    const amenitiesArray = amenities.split(',').map(a => a.trim()).filter(a => a);
    setFormData(prev => ({ ...prev, amenities: amenitiesArray }));
  };

  const renderForm = () => (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Accommodation name"
          />
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, Country"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Accommodation description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price per Night *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price_per_night}
            onChange={(e) => setFormData(prev => ({ ...prev, price_per_night: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label htmlFor="maxGuests">Max Guests</Label>
          <Input
            id="maxGuests"
            type="number"
            min="1"
            value={formData.max_guests}
            onChange={(e) => setFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) || 1 }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.image_url}
          onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Input
          id="amenities"
          value={formData.amenities.join(', ')}
          onChange={(e) => handleAmenitiesChange(e.target.value)}
          placeholder="WiFi, Parking, Pool, etc."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label htmlFor="reviewCount">Review Count</Label>
          <Input
            id="reviewCount"
            type="number"
            min="0"
            value={formData.review_count}
            onChange={(e) => setFormData(prev => ({ ...prev, review_count: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Accommodations Management
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Accommodation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Accommodation</DialogTitle>
                </DialogHeader>
                {renderForm()}
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Create Accommodation</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search accommodations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading accommodations...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Max Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accommodations.map((accommodation) => (
                  <TableRow key={accommodation.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {accommodation.image_url ? (
                          <img 
                            src={accommodation.image_url} 
                            alt={accommodation.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-amber-100 rounded flex items-center justify-center">
                            <Bed className="h-5 w-5 text-amber-600" />
                          </div>
                        )}
                        <span className="font-medium">{accommodation.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {accommodation.location}
                      </div>
                    </TableCell>
                    <TableCell>${accommodation.price_per_night}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                        {accommodation.rating?.toFixed(1) || 'N/A'}
                        {accommodation.review_count && (
                          <span className="text-gray-500 ml-1">({accommodation.review_count})</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        {accommodation.max_guests || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={accommodation.is_featured ? 'default' : 'secondary'}>
                        {accommodation.is_featured ? 'Featured' : 'Regular'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(accommodation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(accommodation.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Accommodation</DialogTitle>
          </DialogHeader>
          {renderForm()}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Accommodation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AccommodationsManagement;
