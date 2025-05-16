
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SplashScreenProps {
  duration?: number;
  onComplete?: () => void;
  children?: React.ReactNode;
}

const SplashScreen = ({ duration = 2000, onComplete, children }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900"
        >
          <div className="text-center">
            {children || (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h1 className="text-5xl md:text-7xl font-display font-bold text-white">
                    ExploreZim
                  </h1>
                  <p className="text-xl text-white/80 mt-4">Discover the Beauty of Zimbabwe</p>
                </motion.div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 300 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto"
                />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
