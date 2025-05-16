
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface WelcomeSplashProps {
  duration?: number;
  onComplete?: () => void;
}

const WelcomeSplash = ({ duration = 2500, onComplete }: WelcomeSplashProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { profile } = useAuth();

  const displayName = profile?.first_name || profile?.username || "Explorer";

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
          <div className="text-center px-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Welcome back, {displayName}!
              </h1>
              
              <p className="text-xl text-white/80 mb-8">
                Get ready to continue your Zimbabwe adventure
              </p>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <motion.div 
                  initial={{ rotate: 0 }} 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                  className="text-5xl"
                >
                  ✨
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%", maxWidth: 400 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplash;
