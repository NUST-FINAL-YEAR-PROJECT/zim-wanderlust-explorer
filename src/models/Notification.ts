
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: string;
  is_read: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching notifications for user id ${userId}:`, error);
    return [];
  }
  
  return data as Notification[];
}

export async function getUnreadNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching unread notifications for user id ${userId}:`, error);
    return [];
  }
  
  return data as Notification[];
}

export async function markNotificationAsRead(id: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error marking notification with id ${id} as read:`, error);
    return null;
  }
  
  return data as Notification;
}

export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) {
    console.error(`Error marking all notifications for user id ${userId} as read:`, error);
    return false;
  }
  
  return true;
}
