
import { motion } from "framer-motion";
import { CheckCircle, MapPin, Calendar, Home, Route } from "lucide-react";
import { useEffect } from "react";

interface BookingSplashProps {
  bookingType: 'destination' | 'event' | 'accommodation' | 'itinerary';
  itemName: string;
  onComplete: () => void;
  duration?: number;
}

const BookingSplash = ({ bookingType, itemName, onComplete, duration = 2500 }: BookingSplashProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  const getIcon = () => {
    switch (bookingType) {
      case 'destination':
        return <MapPin className="h-16 w-16 text-white" />;
      case 'event':
        return <Calendar className="h-16 w-16 text-white" />;
      case 'accommodation':
        return <Home className="h-16 w-16 text-white" />;
      case 'itinerary':
        return <Route className="h-16 w-16 text-white" />;
      default:
        return <CheckCircle className="h-16 w-16 text-white" />;
    }
  };

  const getMessage = () => {
    switch (bookingType) {
      case 'destination':
        return `Your trip to ${itemName} has been booked!`;
      case 'event':
        return `Your spot at ${itemName} has been reserved!`;
      case 'accommodation':
        return `Your stay at ${itemName} has been confirmed!`;
      case 'itinerary':
        return `Your itinerary "${itemName}" has been created!`;
      default:
        return `Your booking for ${itemName} is confirmed!`;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          {getIcon()}
        </motion.div>
        
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {bookingType === 'itinerary' ? 'Itinerary Created!' : 'Booking Confirmed!'}
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-white/90"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {getMessage()}
        </motion.p>
        
        <motion.div
          className="mt-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <CheckCircle className="h-5 w-5" />
            <span>
              {bookingType === 'itinerary' ? 'Redirecting to your itinerary...' : 'Redirecting you to payment...'}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookingSplash;
