
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getDestination } from "./Destination";

export interface Wishlist {
  id: string;
  user_id: string;
  destination_id: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  destination_id: string;
  created_at: string;
  destinations: {
    id: string;
    name: string;
    description: string;
    location: string;
    price: number;
    image_url: string;
  };
}

export async function getUserWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error fetching wishlist for user id ${userId}:`, error);
    return [];
  }
  
  // For each wishlist item, fetch the destination details
  const wishlistItemsWithDestinations = await Promise.all(
    data.map(async (item) => {
      const destination = await getDestination(item.destination_id);
      return {
        ...item,
        destinations: destination ? {
          id: destination.id,
          name: destination.name,
          description: destination.description || "",
          location: destination.location,
          price: destination.price,
          image_url: destination.image_url || ""
        } : null
      };
    })
  );
  
  // Filter out items with null destinations
  return wishlistItemsWithDestinations.filter(item => item.destinations) as WishlistItem[];
}

export async function addToWishlist(userId: string, destinationId: string) {
  // Check if already in wishlist
  const exists = await isInWishlist(userId, destinationId);
  if (exists) {
    toast({
      title: "Already in wishlist",
      description: "This destination is already in your wishlist",
    });
    return null;
  }
  
  const { data, error } = await supabase
    .from('wishlists')
    .insert([{ user_id: userId, destination_id: destinationId }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding to wishlist:', error);
    toast({
      title: "Error",
      description: "Could not add to wishlist. Please try again.",
      variant: "destructive",
    });
    return null;
  }
  
  toast({
    title: "Success",
    description: "Added to your wishlist",
  });
  
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
    toast({
      title: "Error",
      description: "Could not remove from wishlist. Please try again.",
      variant: "destructive",
    });
    return false;
  }
  
  toast({
    title: "Success",
    description: "Removed from your wishlist",
  });
  
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
