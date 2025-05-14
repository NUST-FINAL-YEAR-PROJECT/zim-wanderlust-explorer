
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  user_id: string;
  destination_id: string;
  rating: number;
  comment: string | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

export async function getDestinationReviews(destinationId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('destination_id', destinationId);
  
  if (error) {
    console.error(`Error fetching reviews for destination id ${destinationId}:`, error);
    return [];
  }
  
  return data as Review[];
}

export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error fetching reviews for user id ${userId}:`, error);
    return [];
  }
  
  return data as Review[];
}

// Fixed by explicitly typing the required fields
export async function createReview(review: {
  user_id: string;
  destination_id: string;
  rating: number;
  comment?: string | null;
  images?: string[] | null;
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating review:', error);
    return null;
  }
  
  return data as Review;
}

export async function updateReview(id: string, updates: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating review with id ${id}:`, error);
    return null;
  }
  
  return data as Review;
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting review with id ${id}:`, error);
    return false;
  }
  
  return true;
}
