
import { supabase } from "@/integrations/supabase/client";

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  payment_gateway: string | null;
  payment_gateway_reference: string | null;
  payment_intent_id: string | null;
  payment_details: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export async function getPayment(id: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching payment with id ${id}:`, error);
    return null;
  }
  
  return data as Payment;
}

export async function getPaymentByBookingId(bookingId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', bookingId)
    .single();
  
  if (error) {
    console.error(`Error fetching payment for booking id ${bookingId}:`, error);
    return null;
  }
  
  return data as Payment;
}

// Fixed by explicitly typing the required fields
export async function createPayment(payment: {
  booking_id: string;
  amount: number;
  status: string;
  payment_method?: string | null;
  payment_gateway?: string | null;
  payment_gateway_reference?: string | null;
  payment_intent_id?: string | null;
  payment_details?: Record<string, any> | null;
}) {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating payment:', error);
    return null;
  }
  
  return data as Payment;
}

export async function updatePayment(id: string, updates: Partial<Payment>) {
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating payment with id ${id}:`, error);
    return null;
  }
  
  return data as Payment;
}

export async function markPaymentAsProcessing(paymentId: string, proofUrl: string) {
  return updatePayment(paymentId, {
    status: 'processing',
    payment_details: {
      proof_uploaded: true,
      proof_uploaded_at: new Date().toISOString(),
      proof_url: proofUrl
    }
  });
}

export async function markPaymentAsCompleted(paymentId: string) {
  return updatePayment(paymentId, {
    status: 'completed',
    updated_at: new Date().toISOString(),
    payment_details: {
      completed_at: new Date().toISOString()
    }
  });
}
