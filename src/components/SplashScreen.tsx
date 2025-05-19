
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center px-6 max-w-lg"
          >
            {children || (
              <>
                <motion.div
                  className="mb-8"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut" 
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
                      className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shadow-indigo-900/30"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-700 flex items-center justify-center">
                        <MapPin size={32} className="text-white" />
                      </div>
                    </motion.div>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-bold text-white drop-shadow-md">
                    ExploreZim
                  </h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-xl text-white/90 mt-4"
                  >
                    Discover the Beauty of Zimbabwe
                  </motion.p>
                </motion.div>

                <motion.div 
                  className="w-full max-w-md mx-auto mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Progress 
                    value={progress} 
                    className={cn(
                      "h-2 rounded-full overflow-hidden bg-white/10",
                      "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/60 before:to-white/90"
                    )} 
                  />
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
