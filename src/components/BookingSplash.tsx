
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Calendar, Building, Route } from 'lucide-react';

interface BookingSplashProps {
  duration?: number;
  bookingType: 'event' | 'destination' | 'accommodation' | 'itinerary';
  itemName?: string;
  onComplete?: () => void;
}

const BookingSplash = ({ 
  duration = 3000, 
  bookingType, 
  itemName = 'item',
  onComplete 
}: BookingSplashProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 500); // Allow exit animation to complete
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const getIcon = () => {
    switch (bookingType) {
      case 'event':
        return Calendar;
      case 'destination':
        return MapPin;
      case 'accommodation':
        return Building;
      case 'itinerary':
        return Route;
      default:
        return CheckCircle;
    }
  };

  const Icon = getIcon();

  const getTitle = () => {
    switch (bookingType) {
      case 'event':
        return 'Event Booking Started!';
      case 'destination':
        return 'Destination Booking Started!';
      case 'accommodation':
        return 'Accommodation Booking Started!';
      case 'itinerary':
        return 'Itinerary Created!';
      default:
        return 'Booking Started!';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Icon className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            {getTitle()}
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Setting up your booking for {itemName}...
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: duration / 1000 - 0.5 }}
            className="h-1 bg-green-500 rounded-full mt-6"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingSplash;
