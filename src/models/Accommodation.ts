
import { supabase } from "@/integrations/supabase/client";

export interface RoomType {
  type: string;
  price: number;
  capacity: number;
}

export interface Accommodation {
  id: string;
  name: string;
  description: string | null;
  location: string;
  price_per_night: number;
  image_url: string | null;
  additional_images: string[] | null;
  amenities: string[] | null;
  room_types: RoomType[] | null;
  max_guests: number | null;
  rating: number | null;
  review_count: number | null;
  is_featured: boolean | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export const getAccommodations = async (): Promise<Accommodation[]> => {
  const { data, error } = await supabase
    .from("accommodations")
    .select("*")
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching accommodations:", error);
    throw error;
  }

  // Parse room_types from JSON to RoomType[]
  return data.map(item => ({
    ...item,
    room_types: item.room_types ? (Array.isArray(item.room_types) ? item.room_types : JSON.parse(item.room_types as unknown as string)) : null
  }));
};

export const getFeaturedAccommodations = async (): Promise<Accommodation[]> => {
  const { data, error } = await supabase
    .from("accommodations")
    .select("*")
    .eq("is_featured", true)
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching featured accommodations:", error);
    throw error;
  }

  // Parse room_types from JSON to RoomType[]
  return data.map(item => ({
    ...item,
    room_types: item.room_types ? (Array.isArray(item.room_types) ? item.room_types : JSON.parse(item.room_types as unknown as string)) : null
  }));
};

export const getAccommodationById = async (id: string): Promise<Accommodation | null> => {
  const { data, error } = await supabase
    .from("accommodations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching accommodation:", error);
    throw error;
  }

  if (!data) return null;

  // Parse room_types from JSON to RoomType[]
  return {
    ...data,
    room_types: data.room_types ? (Array.isArray(data.room_types) ? data.room_types : JSON.parse(data.room_types as unknown as string)) : null
  };
};

export const getAccommodationsByLocation = async (location: string): Promise<Accommodation[]> => {
  const { data, error } = await supabase
    .from("accommodations")
    .select("*")
    .ilike("location", `%${location}%`)
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching accommodations by location:", error);
    throw error;
  }

  // Parse room_types from JSON to RoomType[]
  return data.map(item => ({
    ...item,
    room_types: item.room_types ? (Array.isArray(item.room_types) ? item.room_types : JSON.parse(item.room_types as unknown as string)) : null
  }));
};
