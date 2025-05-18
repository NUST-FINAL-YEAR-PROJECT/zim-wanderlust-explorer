
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { getDestinations, updateDestination, deleteDestination, addDestination, Destination } from '@/models/Destination';

const DestinationsManagement = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    price: 0,
    image_url: '',
    activities: [] as string[],
    best_time_to_visit: '',
    duration_recommended: '',
    difficulty_level: 'moderate',
    categories: [] as string[],
    amenities: [] as string[],
    what_to_bring: [] as string[],
    highlights: [] as string[],
    additional_images: [] as string[],
    weather_info: '',
    getting_there: '',
    payment_url: '',
    latitude: null as number | null,
    longitude: null as number | null
  });

  // Available categories
  const categories = [
    'Wildlife',
    'Nature',
    'Adventure',
    'Cultural',
    'Historical',
    'Luxury',
    'Family-friendly',
    'UNESCO',
    'Safari',
    'Water',
    'City'
  ];
  
  // Difficulty levels
  const difficultyLevels = [
    'easy',
    'moderate',
    'challenging',
    'difficult',
    'extreme'
  ];

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (error) {
      console.error('Error loading destinations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load destinations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      price: 0,
      image_url: '',
      activities: [],
      best_time_to_visit: '',
      duration_recommended: '',
      difficulty_level: 'moderate',
      categories: [],
      amenities: [],
      what_to_bring: [],
      highlights: [],
      additional_images: [],
      weather_info: '',
      getting_there: '',
      payment_url: '',
      latitude: null,
      longitude: null
    });
    setEditId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (name === 'latitude' || name === 'longitude') {
      setFormData({ ...formData, [name]: parseFloat(value) || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const activities = value.split(',').map(item => item.trim());
    setFormData({ ...formData, activities });
  };

  const handleCategoryToggle = (category: string) => {
    let newCategories = [...formData.categories];
    if (newCategories.includes(category)) {
      newCategories = newCategories.filter(c => c !== category);
    } else {
      newCategories.push(category);
    }
    setFormData({ ...formData, categories: newCategories });
  };
  
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const images = value.split(',').map(url => url.trim());
    setFormData({ ...formData, additional_images: images });
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const amenities = value.split(',').map(item => item.trim());
    setFormData({ ...formData, amenities });
  };

  const handleWhatToBringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const items = value.split(',').map(item => item.trim());
    setFormData({ ...formData, what_to_bring: items });
  };

  const handleHighlightsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const highlights = value.split(',').map(item => item.trim());
    setFormData({ ...formData, highlights });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Include all necessary fields, including latitude and longitude
      const destinationData = {
        ...formData,
        price: formData.price || 0,
        latitude: formData.latitude,
        longitude: formData.longitude
      };

      if (editId) {
        await updateDestination(editId, destinationData);
        toast({ description: 'Destination updated successfully!' });
      } else {
        await addDestination(destinationData);
        toast({ description: 'Destination created successfully!' });
      }
      
      setOpen(false);
      resetForm();
      loadDestinations();
    } catch (error) {
      console.error('Error saving destination:', error);
      toast({
        title: 'Error',
        description: 'Failed to save destination. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (destination: Destination) => {
    setEditId(destination.id);
    setFormData({
      name: destination.name || '',
      location: destination.location || '',
      description: destination.description || '',
      price: destination.price || 0,
      image_url: destination.image_url || '',
      activities: destination.activities || [],
      best_time_to_visit: destination.best_time_to_visit || '',
      duration_recommended: destination.duration_recommended || '',
      difficulty_level: destination.difficulty_level || 'moderate',
      categories: destination.categories || [],
      amenities: destination.amenities || [],
      what_to_bring: destination.what_to_bring || [],
      highlights: destination.highlights || [],
      additional_images: destination.additional_images || [],
      weather_info: destination.weather_info || '',
      getting_there: destination.getting_there || '',
      payment_url: destination.payment_url || '',
      latitude: destination.latitude || null,
      longitude: destination.longitude || null
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await deleteDestination(id);
        toast({ description: 'Destination deleted successfully!' });
        loadDestinations();
      } catch (error) {
        console.error('Error deleting destination:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete destination. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Destinations Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editId ? 'Edit Destination' : 'Add New Destination'}
              </DialogTitle>
              <DialogDescription>
                {editId
                  ? 'Update the destination details below.'
                  : 'Fill in the details to create a new destination.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium">
                    Price ($)
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="difficulty_level" className="block text-sm font-medium">
                    Difficulty Level
                  </label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) =>
                      setFormData({ ...formData, difficulty_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="image_url" className="block text-sm font-medium">
                    Primary Image URL
                  </label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="best_time_to_visit" className="block text-sm font-medium">
                    Best Time to Visit
                  </label>
                  <Input
                    id="best_time_to_visit"
                    name="best_time_to_visit"
                    value={formData.best_time_to_visit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="latitude" className="block text-sm font-medium">
                    Latitude
                  </label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude ?? ''}
                    onChange={handleInputChange}
                    placeholder="e.g. -17.9244"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="longitude" className="block text-sm font-medium">
                    Longitude
                  </label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude ?? ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 25.8573"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="activities" className="block text-sm font-medium">
                  Activities (comma-separated)
                </label>
                <Input
                  id="activities"
                  name="activities"
                  value={formData.activities.join(', ')}
                  onChange={handleActivityChange}
                  placeholder="e.g. Hiking, Swimming, Sightseeing"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="additional_images" className="block text-sm font-medium">
                  Additional Images (comma-separated URLs)
                </label>
                <Input
                  id="additional_images"
                  name="additional_images"
                  value={formData.additional_images.join(', ')}
                  onChange={handleAdditionalImagesChange}
                  placeholder="e.g. https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amenities" className="block text-sm font-medium">
                  Amenities (comma-separated)
                </label>
                <Input
                  id="amenities"
                  name="amenities"
                  value={formData.amenities.join(', ')}
                  onChange={handleAmenitiesChange}
                  placeholder="e.g. Parking, WiFi, Restaurant"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="what_to_bring" className="block text-sm font-medium">
                  What to Bring (comma-separated)
                </label>
                <Input
                  id="what_to_bring"
                  name="what_to_bring"
                  value={formData.what_to_bring.join(', ')}
                  onChange={handleWhatToBringChange}
                  placeholder="e.g. Sunscreen, Hat, Water bottle"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="highlights" className="block text-sm font-medium">
                  Highlights (comma-separated)
                </label>
                <Input
                  id="highlights"
                  name="highlights"
                  value={formData.highlights.join(', ')}
                  onChange={handleHighlightsChange}
                  placeholder="e.g. Amazing views, Unique wildlife, Cultural experience"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Categories</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration_recommended" className="block text-sm font-medium">
                  Recommended Duration
                </label>
                <Input
                  id="duration_recommended"
                  name="duration_recommended"
                  value={formData.duration_recommended}
                  onChange={handleInputChange}
                  placeholder="e.g. 2-3 days"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="weather_info" className="block text-sm font-medium">
                  Weather Information
                </label>
                <Textarea
                  id="weather_info"
                  name="weather_info"
                  value={formData.weather_info || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Weather details and tips"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="getting_there" className="block text-sm font-medium">
                  Getting There
                </label>
                <Textarea
                  id="getting_there"
                  name="getting_there"
                  value={formData.getting_there || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Transportation and directions information"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="payment_url" className="block text-sm font-medium">
                  Payment URL
                </label>
                <Input
                  id="payment_url"
                  name="payment_url"
                  value={formData.payment_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://payment-gateway.com/xyz"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading destinations...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No destinations found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                destinations.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell className="font-medium">{destination.name}</TableCell>
                    <TableCell>{destination.location}</TableCell>
                    <TableCell>${destination.price}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {destination.categories?.slice(0, 3).map((category) => (
                          <span
                            key={category}
                            className="bg-indigo-100 text-indigo-800 text-xs rounded px-2 py-1"
                          >
                            {category}
                          </span>
                        ))}
                        {destination.categories && destination.categories.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{destination.categories.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(destination)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(destination.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DestinationsManagement;
