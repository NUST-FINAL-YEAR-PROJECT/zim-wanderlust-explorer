
import { supabase } from "@/integrations/supabase/client";

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
// Align this with what's in the database
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

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
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
  
  return data as Booking[];
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
  payment_status?: PaymentStatus | null;
  [key: string]: any;
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
  payment_status?: PaymentStatus | null;
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
