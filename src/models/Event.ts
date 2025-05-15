
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  ticket_types: any[] | Record<string, any> | null;
  image_url: string | null;
  event_type: string | null;
  program_type: string | null;
  program_name: string | null;
  program_url: string | null;
  payment_url: string | null;
  created_at: string;
  updated_at: string;
}

// Define a type for creating or updating events that ensures required fields
export type EventInput = {
  title: string;
  description?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  price?: number | null;
  ticket_types?: any[] | Record<string, any> | null;
  image_url?: string | null;
  event_type?: string | null;
  program_type?: string | null;
  program_name?: string | null;
  program_url?: string | null;
  payment_url?: string | null;
};

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data as Event[];
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    return null;
  }
  
  return data as Event;
}

export async function getUpcomingEvents() {
  const now = new Date();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gt('start_date', now.toISOString())
    .order('start_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
  
  return data as Event[];
}

export async function searchEvents(query: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .or(`title.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`)
    .order('start_date', { ascending: true });
  
  if (error) {
    console.error('Error searching events:', error);
    return [];
  }
  
  return data as Event[];
}

// Add a new function to get only active (non-expired) events
export async function getActiveEvents() {
  const now = new Date();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .or(`end_date.gt.${now.toISOString()},and(end_date.is.null,start_date.gt.${now.toISOString()})`)
    .order('start_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching active events:', error);
    return [];
  }
  
  return data as Event[];
}

export async function addEvent(event: EventInput) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding event:', error);
    throw error;
  }
  
  return data as Event;
}

export async function updateEvent(id: string, updates: Partial<EventInput>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating event with id ${id}:`, error);
    throw error;
  }
  
  return data as Event;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting event with id ${id}:`, error);
    throw error;
  }
  
  return true;
}
