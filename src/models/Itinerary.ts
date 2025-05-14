
import { supabase } from "@/integrations/supabase/client";

export interface ItineraryDestination {
  id: string;
  destinationId: string;
  name: string;
  startDate: string;
  endDate: string;
  notes?: string;
  order: number;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  description?: string;
  destinations: ItineraryDestination[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  shareCode?: string;
}

export async function createItinerary(userId: string, title: string, description?: string): Promise<Itinerary | null> {
  const { data, error } = await supabase
    .from('itineraries')
    .insert({
      user_id: userId,
      title,
      description,
      is_public: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating itinerary:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    destinations: [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isPublic: data.is_public,
    shareCode: data.share_code,
  };
}

export async function getUserItineraries(userId: string): Promise<Itinerary[]> {
  const { data, error } = await supabase
    .from('itineraries')
    .select(`
      id,
      user_id,
      title,
      description,
      created_at,
      updated_at,
      is_public,
      share_code,
      itinerary_destinations (
        id,
        destination_id,
        name,
        start_date,
        end_date,
        notes,
        order
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching itineraries:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    userId: item.user_id,
    title: item.title,
    description: item.description,
    destinations: (item.itinerary_destinations || []).map((dest: any) => ({
      id: dest.id,
      destinationId: dest.destination_id,
      name: dest.name,
      startDate: dest.start_date,
      endDate: dest.end_date,
      notes: dest.notes,
      order: dest.order,
    })).sort((a: any, b: any) => a.order - b.order),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    isPublic: item.is_public,
    shareCode: item.share_code,
  }));
}

export async function getItinerary(id: string): Promise<Itinerary | null> {
  const { data, error } = await supabase
    .from('itineraries')
    .select(`
      id,
      user_id,
      title,
      description,
      created_at,
      updated_at,
      is_public,
      share_code,
      itinerary_destinations (
        id,
        destination_id,
        name,
        start_date,
        end_date,
        notes,
        order
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching itinerary with id ${id}:`, error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    destinations: (data.itinerary_destinations || []).map((dest: any) => ({
      id: dest.id,
      destinationId: dest.destination_id,
      name: dest.name,
      startDate: dest.start_date,
      endDate: dest.end_date,
      notes: dest.notes,
      order: dest.order,
    })).sort((a: any, b: any) => a.order - b.order),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isPublic: data.is_public,
    shareCode: data.share_code,
  };
}

export async function addDestinationToItinerary(
  itineraryId: string,
  destinationId: string,
  name: string,
  startDate: string,
  endDate: string,
  notes?: string
): Promise<boolean> {
  // Get the current highest order value
  const { data: existingDestinations, error: fetchError } = await supabase
    .from('itinerary_destinations')
    .select('order')
    .eq('itinerary_id', itineraryId)
    .order('order', { ascending: false })
    .limit(1);

  const nextOrder = existingDestinations?.length > 0 ? existingDestinations[0].order + 1 : 0;

  const { error } = await supabase
    .from('itinerary_destinations')
    .insert({
      itinerary_id: itineraryId,
      destination_id: destinationId,
      name,
      start_date: startDate,
      end_date: endDate,
      notes,
      order: nextOrder,
    });

  if (error) {
    console.error('Error adding destination to itinerary:', error);
    return false;
  }

  return true;
}

export async function updateItineraryDestination(
  id: string,
  startDate: string,
  endDate: string,
  notes?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('itinerary_destinations')
    .update({
      start_date: startDate,
      end_date: endDate,
      notes,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating itinerary destination:', error);
    return false;
  }

  return true;
}

export async function removeDestinationFromItinerary(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('itinerary_destinations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error removing destination from itinerary:', error);
    return false;
  }

  return true;
}

export async function updateItinerary(
  id: string,
  title: string,
  description?: string,
  isPublic?: boolean
): Promise<boolean> {
  const updates: any = {
    title,
    description,
  };

  if (isPublic !== undefined) {
    updates.is_public = isPublic;
    
    // Generate a random share code if making public and no code exists
    if (isPublic) {
      const { data } = await supabase
        .from('itineraries')
        .select('share_code')
        .eq('id', id)
        .single();
        
      if (!data?.share_code) {
        updates.share_code = Math.random().toString(36).substring(2, 10);
      }
    }
  }

  const { error } = await supabase
    .from('itineraries')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating itinerary:', error);
    return false;
  }

  return true;
}

export async function deleteItinerary(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('itineraries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting itinerary:', error);
    return false;
  }

  return true;
}

export async function getItineraryByShareCode(shareCode: string): Promise<Itinerary | null> {
  const { data, error } = await supabase
    .from('itineraries')
    .select(`
      id,
      user_id,
      title,
      description,
      created_at,
      updated_at,
      is_public,
      share_code,
      itinerary_destinations (
        id,
        destination_id,
        name,
        start_date,
        end_date,
        notes,
        order
      )
    `)
    .eq('share_code', shareCode)
    .eq('is_public', true)
    .single();

  if (error) {
    console.error(`Error fetching shared itinerary:`, error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    destinations: (data.itinerary_destinations || []).map((dest: any) => ({
      id: dest.id,
      destinationId: dest.destination_id,
      name: dest.name,
      startDate: dest.start_date,
      endDate: dest.end_date,
      notes: dest.notes,
      order: dest.order,
    })).sort((a: any, b: any) => a.order - b.order),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isPublic: data.is_public,
    shareCode: data.share_code,
  };
}
