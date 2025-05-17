
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Images, Image } from 'lucide-react';
import { Destination } from '@/models/Destination';
import { useQuery } from '@tanstack/react-query';
import { getDestinationRating } from '@/models/Review';
import { RatingDisplay } from './RatingDisplay';
import { WishlistButton } from './WishlistButton';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface DestinationCardProps {
  destination: Destination;
  className?: string;
}

const DestinationCard = ({ destination, className = '' }: DestinationCardProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: rating = { average: 0, count: 0 }, isError } = useQuery({
    queryKey: ['destinationRating', destination.id],
    queryFn: () => getDestinationRating(destination.id),
    retry: false, // Don't retry if there's an error
    enabled: !!destination.id // Only run if destination.id exists
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
    };
    
    checkAuth();
  }, []);

  const handleViewDetails = () => {
    if (isAuthenticated) {
      navigate(`/destination/${destination.id}`);
    } else {
      navigate(`/browse?destination=${destination.id}`);
    }
  };

  // Check if destination has multiple images
  const hasMultipleImages = !!(destination.additional_images && destination.additional_images.length > 0);
  // Check if destination has coordinates
  const hasCoordinates = !!(destination.latitude && destination.longitude);

  return (
    <Card className={`overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image_url || '/placeholder.svg'}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        {isAuthenticated && (
          <div className="absolute top-2 right-2">
            <WishlistButton 
              destinationId={destination.id}
              variant="default"
              className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white"
            />
          </div>
        )}
        {/* Show icon if destination has multiple images */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="default" className="bg-white/90 text-primary border-none shadow-sm">
              <Images size={14} className="mr-1" />
              {destination.additional_images!.length + 1}
            </Badge>
          </div>
        )}
        {/* Show map pin icon if destination has coordinates */}
        {hasCoordinates && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-white/90 text-primary border-none shadow-sm">
              <MapPin size={14} className="mr-1" />
              Map
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl">{destination.name}</h3>
          <Badge variant="outline" className="font-medium text-primary border-primary/20 bg-primary/5">
            ${destination.price}
          </Badge>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm">{destination.location}</span>
        </div>
        
        {!isError && rating && (
          <div className="mb-3">
            <RatingDisplay
              rating={rating.average}
              count={rating.count}
              showCount={true}
            />
          </div>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
          {destination.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
