
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface SplashScreenProps {
  duration?: number;
  onComplete?: () => void;
  children?: React.ReactNode;
}

const SplashScreen = ({ duration = 2000, onComplete, children }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 100));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    // Exit animation and callback
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
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.3 } 
    }
  };

  const subtitleVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5, delay: 0.5 } 
    }
  };

  const progressVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.7 } 
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800"
        >
          <motion.div
            className="text-center px-6 max-w-lg"
          >
            {children || (
              <>
                <motion.div
                  className="mb-8"
                  variants={logoVariants}
                  initial="initial"
                  animate="animate"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }
                  }}
                >
                  <div className="flex items-center justify-center mb-6">
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
                      className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shadow-blue-900/30"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                        <MapPin size={32} className="text-white" />
                      </div>
                    </motion.div>
                  </div>
                  <motion.h1 
                    variants={titleVariants}
                    initial="initial"
                    animate="animate"
                    className="text-5xl md:text-7xl font-display font-bold text-white drop-shadow-md"
                  >
                    ExploreZim
                  </motion.h1>
                  <motion.p 
                    variants={subtitleVariants}
                    initial="initial"
                    animate="animate"
                    className="text-xl text-white/90 mt-4"
                  >
                    Discover the Beauty of Zimbabwe
                  </motion.p>
                </motion.div>

                <motion.div 
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  className="w-full max-w-md mx-auto mb-6"
                >
                  <div className="relative h-2 rounded-full overflow-hidden bg-white/10">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-sm mt-2">Loading experience...</p>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
