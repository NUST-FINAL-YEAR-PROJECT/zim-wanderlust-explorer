
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";

interface EventProps {
  event: {
    id: number;
    name: string;
    location: string;
    date: string;
    image: string;
    description: string;
    price: number;
  };
}

const EventCard = ({ event }: EventProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-xl">{event.name}</h3>
          <span className="font-medium text-green-700">${event.price}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-2">
          <Calendar size={16} className="mr-1" />
          <span className="text-sm">{event.date}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{event.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Book Now</Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
