import React, { useState } from 'react';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Destination, DestinationInput } from '@/models/Destination';

const destinationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  difficulty_level: z.string().optional(),
  best_time_to_visit: z.string().optional(),
  duration_recommended: z.string().optional(),
  weather_info: z.string().optional(),
  getting_there: z.string().optional(),
  is_featured: z.boolean().default(false),
  payment_url: z.string().url().optional().or(z.literal('')),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

interface DestinationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DestinationInput) => Promise<void>;
  destination?: Destination | null;
  title: string;
  description: string;
}

const DestinationFormDialog: React.FC<DestinationFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  destination,
  title,
  description,
}) => {
  const [activities, setActivities] = React.useState<string[]>(destination?.activities || []);
  const [amenities, setAmenities] = React.useState<string[]>(destination?.amenities || []);
  const [highlights, setHighlights] = React.useState<string[]>(destination?.highlights || []);
  const [categories, setCategories] = React.useState<string[]>(destination?.categories || []);
  const [whatToBring, setWhatToBring] = React.useState<string[]>(destination?.what_to_bring || []);
  const [additionalImages, setAdditionalImages] = React.useState<string[]>(destination?.additional_images || []);
  const [newActivity, setNewActivity] = React.useState('');
  const [newAmenity, setNewAmenity] = React.useState('');
  const [newHighlight, setNewHighlight] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('');
  const [newWhatToBring, setNewWhatToBring] = React.useState('');
  const [newImage, setNewImage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof destinationSchema>>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      name: destination?.name || '',
      location: destination?.location || '',
      price: destination?.price || 0,
      description: destination?.description || '',
      image_url: destination?.image_url || '',
      difficulty_level: destination?.difficulty_level || '',
      best_time_to_visit: destination?.best_time_to_visit || '',
      duration_recommended: destination?.duration_recommended || '',
      weather_info: destination?.weather_info || '',
      getting_there: destination?.getting_there || '',
      is_featured: destination?.is_featured || false,
      payment_url: destination?.payment_url || '',
      latitude: destination?.latitude || undefined,
      longitude: destination?.longitude || undefined,
    },
  });

  const addItem = (item: string, setItems: React.Dispatch<React.SetStateAction<string[]>>, setNewItem: React.Dispatch<React.SetStateAction<string>>) => {
    if (item.trim()) {
      setItems(prev => [...prev, item.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number, setItems: React.Dispatch<React.SetStateAction<string[]>>) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: z.infer<typeof destinationSchema>) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present
      const destinationData: DestinationInput = {
        name: data.name,
        location: data.location,
        price: data.price,
        description: data.description,
        image_url: data.image_url,
        difficulty_level: data.difficulty_level,
        best_time_to_visit: data.best_time_to_visit,
        duration_recommended: data.duration_recommended,
        weather_info: data.weather_info,
        getting_there: data.getting_there,
        is_featured: data.is_featured,
        payment_url: data.payment_url,
        latitude: data.latitude,
        longitude: data.longitude,
        activities,
        amenities,
        highlights,
        categories,
        what_to_bring: whatToBring,
        additional_images: additionalImages,
      };
      
      await onSubmit(destinationData);
      onClose();
    } catch (error) {
      console.error('Error submitting destination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderArrayField = (
    label: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    newItem: string,
    setNewItem: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string
  ) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeItem(index, setItems)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem(newItem, setItems, setNewItem);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem(newItem, setItems, setNewItem)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </FormItem>
  );

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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Destination name" />
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
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City, Province" />
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
                    <Textarea {...field} rows={3} placeholder="Destination description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                        <SelectItem value="Extreme">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="best_time_to_visit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Best Time to Visit</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., May to September" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_recommended"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Recommended</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 2-3 days" />
                    </FormControl>
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
                  <FormLabel>Main Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/image.jpg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderArrayField(
              'Additional Images',
              additionalImages,
              setAdditionalImages,
              newImage,
              setNewImage,
              'Enter image URL'
            )}

            {renderArrayField(
              'Activities',
              activities,
              setActivities,
              newActivity,
              setNewActivity,
              'Add activity'
            )}

            {renderArrayField(
              'Amenities',
              amenities,
              setAmenities,
              newAmenity,
              setNewAmenity,
              'Add amenity'
            )}

            {renderArrayField(
              'Highlights',
              highlights,
              setHighlights,
              newHighlight,
              setNewHighlight,
              'Add highlight'
            )}

            {renderArrayField(
              'Categories',
              categories,
              setCategories,
              newCategory,
              setNewCategory,
              'Add category'
            )}

            {renderArrayField(
              'What to Bring',
              whatToBring,
              setWhatToBring,
              newWhatToBring,
              setNewWhatToBring,
              'Add item to bring'
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weather_info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Information</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="Weather details" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="getting_there"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Getting There</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="Transportation details" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g., -17.8252"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g., 31.0335"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Destination</FormLabel>
                    <FormDescription>
                      Mark this destination as featured on the homepage
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-orange-600 to-amber-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  `${destination ? 'Update' : 'Create'} Destination`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationFormDialog;
