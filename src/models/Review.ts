
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
    .select('*, profiles(first_name, last_name, avatar_url)')
    .eq('destination_id', destinationId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching reviews for destination id ${destinationId}:`, error);
    return [];
  }
  
  return data;
}

export async function getDestinationRating(destinationId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('destination_id', destinationId);
  
  if (error) {
    console.error(`Error fetching ratings for destination id ${destinationId}:`, error);
    return { average: 0, count: 0 };
  }
  
  if (data.length === 0) {
    return { average: 0, count: 0 };
  }
  
  const sum = data.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / data.length;
  
  return { 
    average: parseFloat(average.toFixed(1)), 
    count: data.length 
  };
}

export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, destinations(name, image_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching reviews for user id ${userId}:`, error);
    return [];
  }
  
  return data;
}

export async function getUserReviewForDestination(userId: string, destinationId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('destination_id', destinationId)
    .maybeSingle();
  
  if (error) {
    console.error(`Error fetching review for destination ${destinationId} by user ${userId}:`, error);
    return null;
  }
  
  return data as Review | null;
}

export async function createReview(review: {
  user_id: string;
  destination_id: string;
  rating: number;
  comment?: string | null;
  images?: string[] | null;
}) {
  // Check if user already reviewed this destination
  const existingReview = await getUserReviewForDestination(review.user_id, review.destination_id);
  
  if (existingReview) {
    toast({
      title: "Review exists",
      description: "You have already reviewed this destination. You can edit your review instead.",
      variant: "destructive",
    });
    return null;
  }
  
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating review:', error);
    toast({
      title: "Error",
      description: "Could not create review. Please try again.",
      variant: "destructive",
    });
    return null;
  }
  
  toast({
    title: "Success",
    description: "Your review has been submitted",
  });
  
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
    toast({
      title: "Error",
      description: "Could not update review. Please try again.",
      variant: "destructive",
    });
    return null;
  }
  
  toast({
    title: "Success",
    description: "Your review has been updated",
  });
  
  return data as Review;
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting review with id ${id}:`, error);
    toast({
      title: "Error",
      description: "Could not delete review. Please try again.",
      variant: "destructive",
    });
    return false;
  }
  
  toast({
    title: "Success",
    description: "Your review has been deleted",
  });
  
  return true;
}
