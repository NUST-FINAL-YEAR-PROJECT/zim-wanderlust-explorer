
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Calendar, Users } from 'lucide-react';

interface BookingSplashProps {
  duration?: number;
  bookingType: 'destination' | 'event' | 'accommodation' | 'itinerary';
  itemName: string;
  onComplete: () => void;
}

const BookingSplash = ({ 
  duration = 3000, 
  bookingType, 
  itemName, 
  onComplete 
}: BookingSplashProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const getIcon = () => {
    switch (bookingType) {
      case 'destination':
        return <MapPin className="h-16 w-16" />;
      case 'event':
        return <Calendar className="h-16 w-16" />;
      case 'accommodation':
        return <Users className="h-16 w-16" />;
      case 'itinerary':
        return <MapPin className="h-16 w-16" />;
      default:
        return <CheckCircle className="h-16 w-16" />;
    }
  };

  const getTitle = () => {
    switch (bookingType) {
      case 'destination':
        return 'Trip Booked!';
      case 'event':
        return 'Event Booked!';
      case 'accommodation':
        return 'Stay Booked!';
      case 'itinerary':
        return 'Itinerary Created!';
      default:
        return 'Booking Confirmed!';
    }
  };

  const getSubtitle = () => {
    switch (bookingType) {
      case 'destination':
        return `Your adventure to ${itemName} is confirmed`;
      case 'event':
        return `Your spot at ${itemName} is secured`;
      case 'accommodation':
        return `Your stay at ${itemName} is confirmed`;
      case 'itinerary':
        return `${itemName} has been created successfully`;
      default:
        return `${itemName} booking confirmed`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
              className="text-green-500 mb-6 flex justify-center"
            >
              {getIcon()}
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getTitle()}
              </h2>
              <p className="text-gray-600 mb-6">
                {getSubtitle()}
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", damping: 20, stiffness: 300 }}
              className="text-green-500"
            >
              <CheckCircle className="h-8 w-8 mx-auto" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingSplash;
