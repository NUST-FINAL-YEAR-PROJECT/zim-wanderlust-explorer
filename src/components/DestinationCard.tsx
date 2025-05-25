
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
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
    retry: false,
    enabled: !!destination.id
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleViewDetails = () => {
    try {
      if (isAuthenticated) {
        navigate(`/destination/${destination.id}`);
      } else {
        navigate(`/browse/${destination.id}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      navigate('/destinations');
    }
  };

  // Function to get the best image to display
  const getDisplayImage = () => {
    if (destination.image_url) return destination.image_url;
    if (destination.additional_images && destination.additional_images.length > 0) {
      return destination.additional_images[0];
    }
    return '/placeholder.svg';
  };

  // Truncate description safely
  const truncateDescription = (text: string | null, maxLength: number = 120) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card className={`overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={getDisplayImage()}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
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
        {destination.is_featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-xl leading-tight line-clamp-2 flex-1">
            {destination.name}
          </h3>
          <Badge variant="outline" className="font-medium text-primary border-primary/20 bg-primary/5 whitespace-nowrap">
            ${destination.price}
          </Badge>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{destination.location}</span>
        </div>
        
        {!isError && rating && rating.count > 0 && (
          <div>
            <RatingDisplay
              rating={rating.average}
              count={rating.count}
              showCount={true}
              size="sm"
            />
          </div>
        )}

        {/* Additional destination info */}
        <div className="space-y-2">
          {destination.duration_recommended && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>{destination.duration_recommended}</span>
            </div>
          )}
          
          {destination.difficulty_level && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users size={14} className="mr-1" />
              <span>{destination.difficulty_level}</span>
            </div>
          )}
          
          {destination.best_time_to_visit && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar size={14} className="mr-1" />
              <span>{destination.best_time_to_visit}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncateDescription(destination.description)}
        </p>

        {/* Categories */}
        {destination.categories && destination.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {destination.categories.slice(0, 3).map((category, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {destination.categories.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{destination.categories.length - 3} more
              </Badge>
            )}
          </div>
        )}
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
