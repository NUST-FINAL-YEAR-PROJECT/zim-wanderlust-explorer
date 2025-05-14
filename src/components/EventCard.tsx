
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isValid } from 'date-fns';

interface EventProps {
  event: {
    id: string | number;
    name?: string;
    title?: string;
    location: string;
    date?: string;
    start_date?: string;
    end_date?: string;
    image?: string;
    image_url?: string;
    description: string;
    price?: number;
  };
}

const EventCard = ({ event }: EventProps) => {
  const navigate = useNavigate();
  
  // Format date for display
  const formatEventDate = () => {
    if (event.date) return event.date;
    
    if (event.start_date) {
      try {
        const startDate = parseISO(event.start_date);
        if (!isValid(startDate)) return "Date not specified";
        
        const formattedStart = format(startDate, "MMM d, yyyy");
        
        if (event.end_date) {
          const endDate = parseISO(event.end_date);
          if (isValid(endDate)) {
            return `${formattedStart} - ${format(endDate, "MMM d, yyyy")}`;
          }
        }
        
        return formattedStart;
      } catch (error) {
        return "Invalid date";
      }
    }
    
    return "Date not specified";
  };
  
  // Check if user is authenticated
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  };
  
  const handleBookNow = async () => {
    const isAuthenticated = await checkAuth();
    
    if (isAuthenticated) {
      navigate(`/booking/event/${event.id}`, { 
        state: { eventDetails: event }
      });
    } else {
      // Redirect to auth with return path
      navigate(`/auth?returnTo=/booking/event/${event.id}`);
    }
  };
  
  // Use title if available, otherwise name (for compatibility)
  const eventName = event.title || event.name || "Unnamed Event";
  const imageUrl = event.image_url || event.image || "/placeholder.svg";
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={eventName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-xl">{eventName}</h3>
          <span className="font-medium text-green-700">${event.price}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-2">
          <Calendar size={16} className="mr-1" />
          <span className="text-sm">{formatEventDate()}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{event.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
