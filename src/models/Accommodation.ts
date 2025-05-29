
import { supabase } from "@/integrations/supabase/client";

export interface Accommodation {
  id: string;
  name: string;
  description?: string;
  location: string;
  price_per_night: number;
  image_url?: string;
  additional_images?: string[];
  amenities?: string[];
  room_types?: any;
  max_guests?: number;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export async function getAccommodations() {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching accommodations:', error);
    return [];
  }
  
  return data as Accommodation[];
}

export async function getAccommodation(id: string) {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching accommodation with id ${id}:`, error);
    return null;
  }
  
  return data as Accommodation;
}

export async function getFeaturedAccommodations() {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('is_featured', true)
    .order('name')
    .limit(6);
  
  if (error) {
    console.error('Error fetching featured accommodations:', error);
    return [];
  }
  
  return data as Accommodation[];
}

export async function searchAccommodations(query: string, location?: string) {
  let queryBuilder = supabase
    .from('accommodations')
    .select('*');

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  if (location) {
    queryBuilder = queryBuilder.ilike('location', `%${location}%`);
  }

  const { data, error } = await queryBuilder.order('name');
  
  if (error) {
    console.error('Error searching accommodations:', error);
    return [];
  }
  
  return data as Accommodation[];
}
