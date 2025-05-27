
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users } from "lucide-react";

interface BookingSplashProps {
  duration?: number;
  onComplete?: () => void;
  bookingType?: 'destination' | 'event';
  itemName?: string;
}

const BookingSplash = ({ 
  duration = 2500, 
  onComplete, 
  bookingType = 'destination',
  itemName = 'your selection'
}: BookingSplashProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Preparing booking form',
    'Loading availability',
    'Setting up payment',
    'Almost ready!'
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 100));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    // Step animation
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, duration / steps.length);

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [duration, onComplete, steps.length]);

  const Icon = bookingType === 'event' ? Calendar : MapPin;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-800"
        >
          <motion.div 
            className="text-center px-6 max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div className="mb-8">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [0.8, 1.1, 0.8]
                }} 
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg"
              >
                <Icon size={32} className="text-white" />
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                Booking {itemName}
              </h1>
              
              <motion.p 
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-white/90"
              >
                {steps[currentStep]}
              </motion.p>
            </motion.div>
            
            <div className="w-full max-w-sm mx-auto mb-6">
              <Progress 
                value={progress} 
                className="h-2 bg-white/20 overflow-hidden rounded-full" 
              />
              <p className="text-white/70 text-sm mt-2">
                {Math.round(progress)}% complete
              </p>
            </div>

            <motion.div
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center justify-center text-white/80"
            >
              <Users size={16} className="mr-2" />
              <span className="text-sm">Securing your booking...</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingSplash;
