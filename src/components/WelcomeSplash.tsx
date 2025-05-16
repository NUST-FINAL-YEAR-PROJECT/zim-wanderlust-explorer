
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900"
        >
          <motion.div 
            className="text-center px-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Welcome back, {displayName}!
              </h1>
              
              <p className="text-xl text-white/80 mb-8">
                Get ready to continue your Zimbabwe adventure
              </p>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <motion.div 
                initial={{ rotate: 0 }} 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                className="text-5xl"
              >
                ✨
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="w-full max-w-md mx-auto mb-6">
              <Progress value={progress} className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplash;
