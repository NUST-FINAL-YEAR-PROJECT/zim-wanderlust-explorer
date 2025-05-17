
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Define schema for array fields with better UX
const stringArraySchema = z
  .string()
  .transform((val) => {
    if (!val.trim()) return [];
    return val.split(',').map((item) => item.trim()).filter(Boolean);
  });

export const formSchema = z.object({
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
  image_url: z.string().url({
    message: "Please enter a valid URL."
  }).optional().nullable(),
  activities: stringArraySchema.optional().nullable(),
  best_time_to_visit: z.string().optional().nullable(),
  duration_recommended: z.string().optional().nullable(),
  difficulty_level: z.string().optional().nullable(),
  amenities: stringArraySchema.optional().nullable(),
  what_to_bring: stringArraySchema.optional().nullable(),
  highlights: stringArraySchema.optional().nullable(),
  weather_info: z.string().optional().nullable(),
  getting_there: z.string().optional().nullable(),
  categories: stringArraySchema.optional().nullable(),
  additional_images: stringArraySchema.optional().nullable(),
  is_featured: z.boolean().default(false),
  payment_url: z.string().url().optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
});

export type DestinationFormValues = z.infer<typeof formSchema>;

interface DestinationFormProps {
  form: UseFormReturn<DestinationFormValues>;
}

const DestinationForm: React.FC<DestinationFormProps> = ({ form }) => {
  // Organize fields into categories for better form organization
  const formFieldCategories = [
    {
      title: "Basic Information",
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true, gridSpan: false },
        { name: 'location', label: 'Location', type: 'text', required: true, gridSpan: false },
        { name: 'description', label: 'Description', type: 'textarea', gridSpan: true },
        { name: 'price', label: 'Base Price', type: 'number', required: true, gridSpan: false },
        { name: 'image_url', label: 'Main Image URL', type: 'text', gridSpan: true },
      ]
    },
    {
      title: "Location Details",
      fields: [
        { name: 'latitude', label: 'Latitude', type: 'number', gridSpan: false, step: 'any' },
        { name: 'longitude', label: 'Longitude', type: 'number', gridSpan: false, step: 'any' }
      ]
    },
    {
      title: "Details",
      fields: [
        { name: 'difficulty_level', label: 'Difficulty Level', type: 'text', gridSpan: false },
        { name: 'duration_recommended', label: 'Recommended Duration', type: 'text', gridSpan: false },
        { name: 'best_time_to_visit', label: 'Best Time to Visit', type: 'text', gridSpan: false },
        { name: 'weather_info', label: 'Weather Information', type: 'text', gridSpan: false },
        { name: 'getting_there', label: 'Getting There', type: 'textarea', gridSpan: true },
      ]
    },
    {
      title: "Features",
      fields: [
        { name: 'activities', label: 'Activities (comma separated)', type: 'text', gridSpan: true },
        { name: 'amenities', label: 'Amenities (comma separated)', type: 'text', gridSpan: true },
        { name: 'what_to_bring', label: 'What to Bring (comma separated)', type: 'text', gridSpan: true },
        { name: 'highlights', label: 'Highlights (comma separated)', type: 'text', gridSpan: true },
      ]
    },
    {
      title: "Additional Information",
      fields: [
        { name: 'categories', label: 'Categories (comma separated)', type: 'text', gridSpan: true },
        { name: 'additional_images', label: 'Additional Images (comma separated URLs)', type: 'text', gridSpan: true },
        { name: 'payment_url', label: 'Payment URL', type: 'text', gridSpan: true },
        { name: 'is_featured', label: 'Featured Destination', type: 'switch', gridSpan: false },
      ]
    }
  ];

  const renderFormField = (field: any) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name as any}
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
              ) : field.type === 'switch' ? (
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={fieldProps.value as boolean}
                    onCheckedChange={fieldProps.onChange}
                    id={field.name}
                  />
                  <span className="text-sm text-gray-600">{fieldProps.value ? 'Yes' : 'No'}</span>
                </div>
              ) : (
                <Input 
                  placeholder={`Enter ${field.label.toLowerCase()}`} 
                  type={field.type}
                  step={field.step || (field.type === 'number' ? "0.01" : undefined)}
                  {...fieldProps} 
                />
              )}
            </FormControl>
            {field.name.includes('separated') && (
              <FormDescription className="text-xs">
                Separate multiple items with commas
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <>
      {formFieldCategories.map((category) => (
        <div key={category.title} className="border p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-4">{category.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.fields.map(renderFormField)}
          </div>
        </div>
      ))}
    </>
  );
};

export default DestinationForm;
