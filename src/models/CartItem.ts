
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string;
  user_id: string;
  destination_id: string | null;
  event_id: string | null;
  quantity: number;
  preferred_date: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUserCart(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      destinations(*),
      events(*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error fetching cart for user id ${userId}:`, error);
    return [];
  }
  
  return data;
}

// Fixed by explicitly typing the required fields
export async function addToCart(cartItem: {
  user_id: string;
  quantity?: number;
  destination_id?: string | null;
  event_id?: string | null;
  preferred_date?: string | null;
}) {
  const { data, error } = await supabase
    .from('cart_items')
    .insert(cartItem)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
  
  return data as CartItem;
}

export async function updateCartItem(id: string, updates: Partial<CartItem>) {
  const { data, error } = await supabase
    .from('cart_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating cart item with id ${id}:`, error);
    return null;
  }
  
  return data as CartItem;
}

export async function removeFromCart(id: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error removing cart item with id ${id}:`, error);
    return false;
  }
  
  return true;
}

export async function clearCart(userId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error clearing cart for user id ${userId}:`, error);
    return false;
  }
  
  return true;
}
