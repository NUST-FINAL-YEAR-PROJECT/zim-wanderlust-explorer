
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";

interface WelcomeSplashProps {
  duration?: number;
  onComplete?: () => void;
}

const WelcomeSplash = ({ duration = 2500, onComplete }: WelcomeSplashProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const { profile } = useAuth();

  const displayName = profile?.first_name || profile?.username || "Explorer";

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 100));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-800 dark:to-indigo-900"
        >
          <motion.div 
            className="text-center px-6 max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white drop-shadow-md mb-4">
                Welcome back, {displayName}!
              </h1>
              
              <p className="text-xl text-white/90">
                Get ready to continue your Zimbabwe adventure
              </p>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="relative mx-auto mb-10 flex justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                    scale: [0.8, 1, 0.8]
                  }} 
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <MapPin size={24} className="text-white" />
                </motion.div>
              </div>
              
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
                transition={{ 
                  delay: 0.5, 
                  duration: 0.8,
                  rotate: { repeat: 5, duration: 0.3, repeatDelay: 0.1 }
                }}
              >
                <div className="text-3xl">✨</div>
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="w-full max-w-md mx-auto">
              <Progress 
                value={progress} 
                className="h-2 bg-white/10 overflow-hidden rounded-full before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/60 before:to-white/90" 
              />
              <p className="text-white/60 text-sm mt-2">Preparing your experience...</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplash;
