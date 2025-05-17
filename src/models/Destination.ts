
import { supabase } from "@/integrations/supabase/client";

export interface Destination {
  id: string;
  name: string;
  description: string | null;
  location: string;
  price: number;
  image_url: string | null;
  activities: string[] | null;
  best_time_to_visit: string | null;
  duration_recommended: string | null;
  difficulty_level: string | null;
  amenities: string[] | null;
  what_to_bring: string[] | null;
  highlights: string[] | null;
  weather_info: string | null;
  getting_there: string | null;
  categories: string[] | null;
  additional_images: string[] | null;
  additional_costs: Record<string, any> | any[] | null;
  is_featured: boolean | null;
  payment_url: string | null;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
}

// Define a type for creating or updating destinations that ensures required fields
export type DestinationInput = {
  name: string;
  location: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  activities?: string[] | null;
  best_time_to_visit?: string | null;
  duration_recommended?: string | null;
  difficulty_level?: string | null;
  amenities?: string[] | null;
  what_to_bring?: string[] | null;
  highlights?: string[] | null;
  weather_info?: string | null;
  getting_there?: string | null;
  categories?: string[] | null;
  additional_images?: string[] | null;
  additional_costs?: Record<string, any> | any[] | null;
  is_featured?: boolean | null;
  payment_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export async function getDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*');
  
  if (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
  
  return data as Destination[];
}

export async function getDestination(id: string) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching destination with id ${id}:`, error);
    return null;
  }
  
  return data as Destination;
}

export async function getFeaturedDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_featured', true);
  
  if (error) {
    console.error('Error fetching featured destinations:', error);
    return [];
  }
  
  return data as Destination[];
}

export async function searchDestinations(query: string) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .or(`name.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`);
  
  if (error) {
    console.error('Error searching destinations:', error);
    return [];
  }
  
  return data as Destination[];
}

export async function addDestination(destination: DestinationInput) {
  // Ensure all array fields are properly set to empty arrays if they're null or undefined
  const sanitizedDestination = {
    ...destination,
    activities: destination.activities || [],
    amenities: destination.amenities || [],
    what_to_bring: destination.what_to_bring || [],
    highlights: destination.highlights || [],
    categories: destination.categories || [],
    additional_images: destination.additional_images || [],
  };

  const { data, error } = await supabase
    .from('destinations')
    .insert(sanitizedDestination)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding destination:', error);
    throw error;
  }
  
  return data as Destination;
}

export async function updateDestination(id: string, updates: Partial<DestinationInput>) {
  // Ensure we don't send null values for array fields
  const sanitizedUpdates = { ...updates };
  
  // Only set array fields if they exist in the updates
  if ('activities' in updates) sanitizedUpdates.activities = updates.activities || [];
  if ('amenities' in updates) sanitizedUpdates.amenities = updates.amenities || [];
  if ('what_to_bring' in updates) sanitizedUpdates.what_to_bring = updates.what_to_bring || [];
  if ('highlights' in updates) sanitizedUpdates.highlights = updates.highlights || [];
  if ('categories' in updates) sanitizedUpdates.categories = updates.categories || [];
  if ('additional_images' in updates) sanitizedUpdates.additional_images = updates.additional_images || [];

  const { data, error } = await supabase
    .from('destinations')
    .update(sanitizedUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating destination with id ${id}:`, error);
    throw error;
  }
  
  return data as Destination;
}

export async function deleteDestination(id: string) {
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting destination with id ${id}:`, error);
    throw error;
  }
  
  return true;
}
