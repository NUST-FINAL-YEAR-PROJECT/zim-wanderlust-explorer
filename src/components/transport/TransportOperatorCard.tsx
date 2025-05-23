
import { TransportOperator } from "@/models/TransportOperator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, Plane, Bus, MapPin, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { addToCartTransportOperator } from "@/models/TransportOperator";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TransportOperatorCardProps {
  operator: TransportOperator;
  onAddToCart?: () => void;
  showAddToCart?: boolean;
}

const TransportOperatorCard = ({ operator, onAddToCart, showAddToCart = true }: TransportOperatorCardProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }

    setIsAddingToCart(true);
    try {
      const dateString = date ? format(date, "yyyy-MM-dd") : null;
      const success = await addToCartTransportOperator(user.id, operator.id, 1, dateString);
      
      if (success) {
        toast.success("Added to cart", {
          description: `${operator.name} has been added to your cart`
        });
        if (onAddToCart) onAddToCart();
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart", {
        description: "Please try again later"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Icon based on transport type
  const getTypeIcon = () => {
    switch(operator.type) {
      case 'private': return <Car className="h-5 w-5 text-yellow-500" />;
      case 'public': return <Bus className="h-5 w-5 text-green-500" />;
      case 'air': return <Plane className="h-5 w-5 text-blue-500" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  // Badge color based on transport type
  const getTypeBadgeClass = () => {
    switch(operator.type) {
      case 'private': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'public': return "bg-green-100 text-green-800 border-green-200";
      case 'air': return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "";
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border-t-4 border-t-indigo-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-lg font-bold">
              {getTypeIcon()}
              <span className="ml-2">{operator.name}</span>
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge className={cn("font-normal", getTypeBadgeClass())}>
                {operator.type.charAt(0).toUpperCase() + operator.type.slice(1)} Transport
              </Badge>
              <span className="flex items-center ml-2 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" /> {operator.rating}
              </span>
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">{operator.price_range}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{operator.description}</p>
        
        <div className="space-y-1 text-sm">
          <p className="flex items-center">
            <span className="font-medium">Phone:</span>
            <span className="ml-2">{operator.contact_phone}</span>
          </p>
          <p className="flex items-center">
            <span className="font-medium">Email:</span>
            <span className="ml-2">{operator.contact_email}</span>
          </p>
          {operator.website && (
            <p className="flex items-center">
              <span className="font-medium">Website:</span>
              <a 
                href={operator.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2 text-blue-600 hover:underline"
              >
                {operator.website.replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}
        </div>
      </CardContent>

      {showAddToCart && (
        <CardFooter className="flex items-center justify-between pt-2 border-t">
          <div>
            {operator.is_verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Verified
              </Badge>
            )}
          </div>
          <Button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || !user}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TransportOperatorCard;
