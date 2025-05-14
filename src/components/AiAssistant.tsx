
import { useState, useEffect } from "react";
import { MessageCircle, X, Tent, Drum, Binoculars, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm Kombirai, your Zimbabwe travel assistant. How can I help plan your journey today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [assistantIcon, setAssistantIcon] = useState<React.ReactNode>(<MessageCircle size={24} />);
  const { toast } = useToast();
  
  // Cycle through icons for a dynamic effect
  useEffect(() => {
    if (!isOpen) return;
    
    const icons = [
      <Tent size={24} key="tent" />,
      <Drum size={24} key="drum" />,
      <Binoculars size={24} key="binoculars" />,
      <TentTree size={24} key="tentTree" />
    ];
    
    let iconIndex = 0;
    const interval = setInterval(() => {
      iconIndex = (iconIndex + 1) % icons.length;
      setAssistantIcon(icons[iconIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isOpen]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      // Get all messages except the initial welcome message to maintain conversation context
      const messageHistory = messages.length > 1 
        ? messages.slice(1).concat(userMessage) 
        : [userMessage];
      
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { messages: messageHistory },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Handle error returned with a 200 status code but contains error message
      if (data.error) {
        throw new Error(data.error);
      }

      // Add AI response
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Connection error",
        description: "Couldn't reach Kombirai at the moment. Please try again.",
        variant: "destructive",
      });
      
      // Add fallback response
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <>
      {/* Chat Button with soft animation */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-16 h-16 p-0 shadow-lg z-50 transition-all duration-300 transform hover:scale-105",
          isOpen 
            ? "bg-red-500 hover:bg-red-600 rotate-90" 
            : "bg-green-700 hover:bg-green-800"
        )}
      >
        <div className={cn(
          "absolute inset-0 rounded-full bg-green-600 animate-ping opacity-25",
          isOpen ? "hidden" : "block"
        )}></div>
        {isOpen ? <X size={28} /> : (
          <div className="flex flex-col items-center">
            <MessageCircle size={24} />
            <span className="text-[10px] mt-0.5">Kombirai</span>
          </div>
        )}
      </Button>
      
      {/* Chat Window with improved styling */}
      <div
        className={cn(
          "fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 z-50 border border-green-100",
          isOpen 
            ? "translate-y-0 opacity-100" 
            : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="border-0 shadow-none">
          {/* Header with Zimbabwe-inspired styling */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                {assistantIcon}
              </div>
              <div>
                <h3 className="font-bold text-xl">Kombirai</h3>
                <p className="text-xs text-green-100">Your Zimbabwe Travel Guide</p>
              </div>
            </div>
          </div>
          
          {/* Messages with improved styling */}
          <div className="h-80 overflow-y-auto p-4 bg-amber-50/30">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={cn(
                  "mb-4 max-w-[85%]", 
                  msg.role === "user" ? "ml-auto" : ""
                )}
              >
                <div 
                  className={cn(
                    "p-3 rounded-xl transition-all", 
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-green-700 to-green-600 text-white rounded-tr-none shadow-md" 
                      : "bg-white border shadow-sm rounded-tl-none"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 p-4 rounded-lg bg-white border shadow-sm rounded-tl-none max-w-[85%] items-center">
                <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
          </div>
          
          {/* Input with improved styling */}
          <form onSubmit={handleSendMessage} className="p-4 border-t flex bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Zimbabwe travel..."
              className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
            />
            <Button 
              type="submit" 
              className="rounded-l-none bg-green-700 hover:bg-green-800 px-4"
              disabled={isTyping}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AiAssistant;
