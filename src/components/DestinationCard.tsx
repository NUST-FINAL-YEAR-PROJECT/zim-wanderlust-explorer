
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface DestinationProps {
  destination: {
    id: number;
    name: string;
    location: string;
    image: string;
    description: string;
    price: number;
  };
}

const DestinationCard = ({ destination }: DestinationProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-xl">{destination.name}</h3>
          <span className="font-medium text-green-700">${destination.price}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{destination.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{destination.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
