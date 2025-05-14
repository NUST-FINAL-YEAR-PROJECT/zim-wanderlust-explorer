import { supabase } from "@/integrations/supabase/client";

// Aligning this with the database schema
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
// Updating this type to match what's in the database - changed 'paid' to 'completed'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  user_id: string | null;
  destination_id: string | null;
  event_id: string | null;
  booking_date: string;
  number_of_people: number;
  total_price: number;
  preferred_date: string | null;
  booking_details: Record<string, any> | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: BookingStatus | null;
  payment_status: PaymentStatus | null;
  payment_id: string | null;
  payment_proof_url: string | null;
  payment_proof_uploaded_at: string | null;
  confirmation_date: string | null;
  cancellation_date: string | null;
  cancellation_reason: string | null;
  completion_date: string | null;
  selected_ticket_type: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export async function getUserBookings(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, destinations(*), events(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
  
  return data as (Booking & { destinations: any; events: any })[];
}

export async function getBooking(id: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    return null;
  }
  
  return data as Booking;
}

// Fixed by correctly typing the booking parameter with required fields
// and removing the [key: string]: any to avoid type issues
export async function createBooking(booking: {
  booking_date: string;
  number_of_people: number;
  total_price: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  user_id?: string | null;
  destination_id?: string | null;
  event_id?: string | null;
  preferred_date?: string | null;
  booking_details?: Record<string, any> | null;
  status?: BookingStatus | null;
  payment_status?: "pending" | "processing" | "completed" | "failed" | "refunded" | null;
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }
  
  return data as Booking;
}

export async function updateBooking(id: string, updates: {
  booking_date?: string;
  number_of_people?: number;
  total_price?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  user_id?: string | null;
  destination_id?: string | null;
  event_id?: string | null;
  preferred_date?: string | null;
  booking_details?: Record<string, any> | null;
  status?: BookingStatus | null;
  payment_status?: "pending" | "processing" | "completed" | "failed" | "refunded" | null;
  payment_id?: string | null;
  payment_proof_url?: string | null;
  payment_proof_uploaded_at?: string | null;
  confirmation_date?: string | null;
  cancellation_date?: string | null;
  cancellation_reason?: string | null;
  completion_date?: string | null;
  selected_ticket_type?: Record<string, any> | null;
}) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating booking with id ${id}:`, error);
    return null;
  }
  
  return data as Booking;
}

// Add new function to cancel a booking
export async function cancelBooking(id: string, reason: string) {
  return updateBooking(id, {
    status: 'cancelled',
    cancellation_date: new Date().toISOString(),
    cancellation_reason: reason
  });
}

// Add function to check for duplicate unpaid bookings
export async function checkForDuplicateBooking(userId: string, destinationId: string | null, eventId: string | null) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .eq('payment_status', 'pending')
    .or(`destination_id.eq.${destinationId},event_id.eq.${eventId}`);
  
  if (error) {
    console.error('Error checking for duplicate bookings:', error);
    return null;
  }
  
  return data && data.length > 0;
}
