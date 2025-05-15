import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isValid, isPast } from 'date-fns';
import { cn } from "@/lib/utils";

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
  className?: string;
}

const EventCard = ({ event, className }: EventProps) => {
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
  
  // Check if event is expired
  const isEventExpired = () => {
    if (!event.start_date && !event.end_date) return false;
    
    try {
      // If we have an end date, use that to determine expiry
      if (event.end_date) {
        const endDate = parseISO(event.end_date);
        if (isValid(endDate)) {
          return isPast(endDate);
        }
      }
      
      // Otherwise use the start date
      if (event.start_date) {
        const startDate = parseISO(event.start_date);
        if (isValid(startDate)) {
          return isPast(startDate);
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };
  
  // Check if user is authenticated
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  };
  
  const handleBookNow = async () => {
    // If event expired, don't allow booking
    if (isEventExpired()) {
      return;
    }
    
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
  const expired = isEventExpired();
  
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col", className)}>
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={eventName}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500 hover:scale-105",
            expired ? "opacity-70 grayscale" : ""
          )}
        />
        {expired && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 m-2 rounded-md font-medium text-sm">
            Expired
          </div>
        )}
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-xl">{eventName}</h3>
          {event.price !== undefined && (
            <span className="font-medium text-green-700">${event.price}</span>
          )}
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
        {expired ? (
          <Button 
            className="w-full bg-gray-400 cursor-not-allowed text-white"
            disabled
          >
            Event Expired
          </Button>
        ) : (
          <Button 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
