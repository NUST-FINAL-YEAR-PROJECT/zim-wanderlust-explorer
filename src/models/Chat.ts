
import { supabase } from "@/integrations/supabase/client";

export interface ChatConversation {
  id: string;
  title: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string | null;
  role: string;
  content: string;
  created_at: string;
}

export async function getUserConversations(userId: string) {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching conversations for user id ${userId}:`, error);
    return [];
  }
  
  return data as ChatConversation[];
}

export async function getConversation(id: string) {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching conversation with id ${id}:`, error);
    return null;
  }
  
  return data as ChatConversation;
}

export async function createConversation(userId: string, title?: string) {
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert([{
      user_id: userId,
      title: title || 'New Conversation'
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
  
  return data as ChatConversation;
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error(`Error fetching messages for conversation id ${conversationId}:`, error);
    return [];
  }
  
  return data as ChatMessage[];
}

export async function sendMessage(conversationId: string, role: string, content: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      conversation_id: conversationId,
      role,
      content
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  
  return data as ChatMessage;
}
