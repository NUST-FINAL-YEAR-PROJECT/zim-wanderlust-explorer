
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
  is_locked: boolean | null;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching current profile:', error);
    return null;
  }
  
  return data as Profile;
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching profile with id ${id}:`, error);
    return null;
  }
  
  return data as Profile;
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating profile with id ${id}:`, error);
    throw error;
  }
  
  return data as Profile;
}
