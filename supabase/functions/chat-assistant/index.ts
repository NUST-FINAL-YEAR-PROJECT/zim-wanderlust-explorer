
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required');
    }

    const { messages } = await req.json();

    // Format messages for Gemini API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Add system instruction as the first message
    const systemMessage = {
      role: "model",
      parts: [{ 
        text: `You are Kombirai, a helpful AI travel assistant specializing in Zimbabwe tourism. 
        Provide accurate, concise, and helpful information about Zimbabwe's attractions, accommodations, 
        travel tips, events, wildlife, and culture. Use a friendly, professional tone. 
        If you don't know something specific about Zimbabwe, acknowledge it and provide general travel advice.
        Include local terminology when appropriate to enhance authenticity.`
      }]
    };

    // Prepare full message history including system message
    const fullMessages = [systemMessage, ...formattedMessages];

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: fullMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok || data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(data.error?.message || 'Failed to get response from Gemini API');
    }

    // Extract the assistant's response text
    const assistantMessage = data.candidates[0]?.content?.parts[0]?.text;

    if (!assistantMessage) {
      throw new Error('No valid response from Gemini API');
    }

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "I'm sorry, I'm currently experiencing connectivity issues. Please try again later." 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
