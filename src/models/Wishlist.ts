
import { supabase } from "@/integrations/supabase/client";

export interface Wishlist {
  id: string;
  user_id: string;
  destination_id: string;
  created_at: string;
}

export async function getUserWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*, destinations(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error fetching wishlist for user id ${userId}:`, error);
    return [];
  }
  
  return data;
}

export async function addToWishlist(userId: string, destinationId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .insert([{ user_id: userId, destination_id: destinationId }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding to wishlist:', error);
    return null;
  }
  
  return data as Wishlist;
}

export async function removeFromWishlist(userId: string, destinationId: string) {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('destination_id', destinationId);
  
  if (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
  
  return true;
}

export async function isInWishlist(userId: string, destinationId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', userId)
    .eq('destination_id', destinationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
  
  return !!data;
}
