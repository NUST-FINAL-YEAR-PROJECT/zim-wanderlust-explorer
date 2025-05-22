
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, MapPin, Users, Star, Wifi, Dumbbell, Utensils } from "lucide-react";
import { Accommodation } from "@/models/Accommodation";
import { cn } from "@/lib/utils";

interface AccommodationCardProps {
  accommodation: Accommodation;
  className?: string;
  featured?: boolean;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  className,
  featured = false,
}) => {
  const { id, name, location, price_per_night, image_url, amenities, rating, max_guests } = accommodation;

  const displayAmenities = amenities?.slice(0, 3) || [];

  const amenityIcons: Record<string, React.ReactNode> = {
    "Wi-Fi": <Wifi className="h-4 w-4" />,
    "Pool": <div className="h-4 w-4">🏊</div>,
    "Gym": <Dumbbell className="h-4 w-4" />,
    "Restaurant": <Utensils className="h-4 w-4" />,
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-lg",
      featured ? "border-blue-400 dark:border-blue-600" : "",
      className
    )}>
      <Link to={`/accommodation/${id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image_url || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          {featured && (
            <Badge className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600">
              Featured
            </Badge>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <h3 className="font-display text-xl font-semibold text-blue-900 dark:text-blue-100">
              {name}
            </h3>
            <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-200">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{rating?.toFixed(1) || "New"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {displayAmenities.map((amenity) => (
              <Badge
                key={amenity}
                variant="outline"
                className="flex items-center gap-1 text-xs font-normal"
              >
                {amenityIcons[amenity] || <div className="h-3 w-3">✓</div>}
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t p-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Up to {max_guests || 2} guests
            </span>
          </div>
          <div className="font-display text-lg font-semibold text-blue-600 dark:text-blue-300">
            ${price_per_night}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              /night
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccommodationCard;
