
import { supabase } from "@/integrations/supabase/client";

export interface Location {
  id: string;
  city: string;
  country: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string | null;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

// Function to get all cities from destinations and events
export async function getAllCitiesWithContent() {
  try {
    // Get all unique locations from destinations
    const { data: destinationLocations, error: destError } = await supabase
      .from('destinations')
      .select('location')
      .not('location', 'is', null);
    
    if (destError) throw destError;
    
    // Get all unique locations from events
    const { data: eventLocations, error: eventError } = await supabase
      .from('events')
      .select('location')
      .not('location', 'is', null);
    
    if (eventError) throw eventError;
    
    // Combine and get unique locations
    const allLocations = [
      ...destinationLocations.map(item => item.location),
      ...eventLocations.map(item => item.location)
    ];
    
    // Remove duplicates
    const uniqueCities = [...new Set(allLocations)].sort();
    
    return uniqueCities;
  } catch (error) {
    console.error('Error fetching cities with content:', error);
    return [];
  }
}

// Function to get all content for a specific city
export async function getCityContent(city: string) {
  try {
    // Get destinations in the city
    const { data: destinations, error: destError } = await supabase
      .from('destinations')
      .select('*')
      .eq('location', city);
    
    if (destError) throw destError;
    
    // Get events in the city
    const { data: events, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('location', city);
    
    if (eventError) throw eventError;
    
    return {
      city,
      destinations: destinations || [],
      events: events || []
    };
  } catch (error) {
    console.error(`Error fetching content for city ${city}:`, error);
    return {
      city,
      destinations: [],
      events: []
    };
  }
}
