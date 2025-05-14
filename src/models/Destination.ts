
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
  additional_costs: Record<string, any> | null;
  is_featured: boolean | null;
  payment_url: string | null;
  created_at: string;
  updated_at: string;
}

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
