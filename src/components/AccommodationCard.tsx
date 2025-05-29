import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Accommodation } from '@/models/Accommodation';
import { Bed, MapPin, Users, Star, Wifi, Car, Coffee, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AccommodationBookingDialog from './AccommodationBookingDialog';

interface AccommodationCardProps {
  accommodation: Accommodation;
}

const AccommodationCard = ({ accommodation }: AccommodationCardProps) => {
  const navigate = useNavigate();
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const handleViewDetails = () => {
    navigate(`/accommodations/${accommodation.id}`);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBookingDialog(true);
  };

  const getRoomTypes = () => {
    if (!accommodation?.room_types) {
      return [
        { id: 'standard', name: 'Standard Room', multiplier: 1 },
        { id: 'deluxe', name: 'Deluxe Room', multiplier: 1.5 },
        { id: 'suite', name: 'Suite', multiplier: 2 }
      ];
    }

    let roomTypes = accommodation.room_types;
    
    // If room_types is a string, try to parse it as JSON
    if (typeof roomTypes === 'string') {
      try {
        roomTypes = JSON.parse(roomTypes);
      } catch (error) {
        console.error('Error parsing room_types:', error);
        return [
          { id: 'standard', name: 'Standard Room', multiplier: 1 },
          { id: 'deluxe', name: 'Deluxe Room', multiplier: 1.5 },
          { id: 'suite', name: 'Suite', multiplier: 2 }
        ];
      }
    }

    // If it's not an array, return default
    if (!Array.isArray(roomTypes)) {
      return [
        { id: 'standard', name: 'Standard Room', multiplier: 1 },
        { id: 'deluxe', name: 'Deluxe Room', multiplier: 1.5 },
        { id: 'suite', name: 'Suite', multiplier: 2 }
      ];
    }

    // Validate each room type object
    return roomTypes.map((room: any, index: number) => ({
      id: room?.id || room?.name?.toLowerCase() || `room-${index}`,
      name: room?.name || `Room Type ${index + 1}`,
      multiplier: room?.multiplier || 1
    }));
  };

  const roomTypes = getRoomTypes();

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      'wifi': Wifi,
      'parking': Car,
      'breakfast': Coffee,
      'restaurant': Utensils,
    };
    const IconComponent = iconMap[amenity.toLowerCase()] || Star;
    return <IconComponent size={16} />;
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={handleViewDetails}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {accommodation.image_url ? (
            <img 
              src={accommodation.image_url} 
              alt={accommodation.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <Bed className="h-12 w-12 text-amber-500" />
            </div>
          )}
          
          {accommodation.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                Featured
              </Badge>
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-sm font-semibold text-green-600">
              ${accommodation.price_per_night}/night
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
              {accommodation.name}
            </h3>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{accommodation.location}</span>
            </div>

            {(accommodation.rating || accommodation.max_guests) && (
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                {accommodation.rating && (
                  <div className="flex items-center">
                    <Star size={16} className="mr-1 fill-current text-yellow-500" />
                    <span>{accommodation.rating.toFixed(1)} ({accommodation.review_count || 0})</span>
                  </div>
                )}
                {accommodation.max_guests && (
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>Up to {accommodation.max_guests} guests</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {accommodation.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {accommodation.description}
            </p>
          )}

          {/* Room Types */}
          {roomTypes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Room Types:</p>
              <div className="flex flex-wrap gap-2">
                {roomTypes.slice(0, 2).map((room: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {room.name}
                  </Badge>
                ))}
                {roomTypes.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{roomTypes.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Amenities */}
          {accommodation.amenities && accommodation.amenities.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Amenities:</p>
              <div className="flex flex-wrap gap-2">
                {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    {getAmenityIcon(amenity)}
                    <span className="ml-1 capitalize">{amenity}</span>
                  </div>
                ))}
                {accommodation.amenities.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{accommodation.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Booking Dialog */}
      <AccommodationBookingDialog
        isOpen={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        accommodation={accommodation}
      />
    </>
  );
};

export default AccommodationCard;
