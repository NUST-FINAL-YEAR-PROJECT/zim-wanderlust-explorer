
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./Profile";

export type UserRole = 'USER' | 'ADMIN';

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
  
  return data.role as UserRole;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'ADMIN';
}

export async function updateUserRole(userId: string, role: UserRole): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user role:', error);
    return null;
  }
  
  return data as Profile;
}

// Function to get all users with their roles
export async function getAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
  
  return data as Profile[];
}
