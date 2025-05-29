
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Bed, Wifi, Car, Coffee, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingSplash from './BookingSplash';

interface AccommodationCardProps {
  accommodation: {
    id: string;
    name: string;
    description?: string;
    location: string;
    price_per_night: number;
    image_url?: string;
    rating?: number;
    review_count?: number;
    max_guests?: number;
    amenities?: string[];
    room_types?: any[];
    is_featured?: boolean;
  };
}

const AccommodationCard = ({ accommodation }: AccommodationCardProps) => {
  const navigate = useNavigate();
  const [showBookingSplash, setShowBookingSplash] = useState(false);

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Breakfast': Coffee,
    'Pool': Waves,
    'AC': Star,
  };

  const handleBookNow = () => {
    setShowBookingSplash(true);
  };

  const handleBookingComplete = () => {
    setShowBookingSplash(false);
    navigate(`/accommodation-booking/${accommodation.id}`);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-800 overflow-hidden">
              {accommodation.image_url ? (
                <img 
                  src={accommodation.image_url} 
                  alt={accommodation.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Bed className="h-12 w-12 text-amber-400" />
                </div>
              )}
            </div>
            
            {accommodation.is_featured && (
              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                Featured
              </Badge>
            )}
            
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">
                {accommodation.rating ? accommodation.rating.toFixed(1) : 'New'}
              </span>
            </div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {accommodation.name}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <MapPin size={14} className="mr-1" />
                  <span>{accommodation.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  ${accommodation.price_per_night}
                </div>
                <div className="text-sm text-gray-500">per night</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {accommodation.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {accommodation.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              {accommodation.max_guests && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users size={14} className="mr-1" />
                  <span>Up to {accommodation.max_guests} guests</span>
                </div>
              )}
              {accommodation.review_count && (
                <div className="text-gray-500">
                  {accommodation.review_count} reviews
                </div>
              )}
            </div>

            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {accommodation.amenities.slice(0, 4).map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || Star;
                  return (
                    <div key={index} className="flex items-center bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2 py-1 rounded-full">
                      <IconComponent size={12} className="mr-1" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
                {accommodation.amenities.length > 4 && (
                  <div className="flex items-center text-gray-500 text-xs px-2 py-1">
                    +{accommodation.amenities.length - 4} more
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => navigate(`/accommodation/${accommodation.id}`)}
              >
                View Details
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {showBookingSplash && (
        <BookingSplash
          onComplete={handleBookingComplete}
          bookingType="accommodation"
          itemName={accommodation.name}
        />
      )}
    </>
  );
};

export default AccommodationCard;
