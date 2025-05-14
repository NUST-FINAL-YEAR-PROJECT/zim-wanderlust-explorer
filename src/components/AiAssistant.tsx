
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = "";
      
      if (input.toLowerCase().includes("victoria falls")) {
        response = "Victoria Falls is stunning year-round, but the best time to visit is from February to May when water flow is at its peak. Are you interested in adventure activities there like bungee jumping or white water rafting?";
      } else if (input.toLowerCase().includes("safari") || input.toLowerCase().includes("wildlife")) {
        response = "Zimbabwe offers incredible safari experiences! Hwange National Park and Mana Pools are top destinations. The dry season (May to October) is best for wildlife viewing. Would you like more specific information?";
      } else if (input.toLowerCase().includes("weather") || input.toLowerCase().includes("best time")) {
        response = "Zimbabwe has a pleasant climate year-round. The dry season (May-October) is best for wildlife viewing with mild days and cool nights. The green season (November-April) brings occasional rain and lush landscapes.";
      } else if (input.toLowerCase().includes("accommodation") || input.toLowerCase().includes("stay") || input.toLowerCase().includes("hotel")) {
        response = "Zimbabwe offers diverse accommodation ranging from luxury safari lodges to boutique hotels and eco-camps. Popular areas include Victoria Falls, Harare, and lodges within national parks. What's your budget and preferred style?";
      } else {
        response = "Thanks for your question about Zimbabwe! I'd be happy to help with information about destinations, activities, accommodation, or travel tips. Could you provide a bit more detail about what you're looking for?";
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg z-50
          ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-700 hover:bg-green-800'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 z-50
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      >
        <Card className="border-0 shadow-none">
          {/* Header */}
          <div className="bg-green-700 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold">Kombirai</h3>
                <p className="text-xs text-green-100">Your Zimbabwe Travel Assistant</p>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 max-w-[80%] ${msg.role === "user" ? "ml-auto" : ""}`}
              >
                <div 
                  className={`p-3 rounded-lg ${
                    msg.role === "user" 
                      ? "bg-green-700 text-white rounded-tr-none" 
                      : "bg-white border shadow-sm rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-1 p-3 rounded-lg bg-white border shadow-sm rounded-tl-none max-w-[80%] items-center">
                <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Zimbabwe travel..."
              className="flex-1 p-2 border rounded-l-md focus:outline-none"
            />
            <Button type="submit" className="rounded-l-none bg-green-700">
              Send
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AiAssistant;
