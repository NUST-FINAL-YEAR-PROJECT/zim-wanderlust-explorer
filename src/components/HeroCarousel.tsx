
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import HeroSearchBar from "./HeroSearchBar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Updated hero images with the new uploaded images
const heroImages = [
  {
    url: "/victoria-falls.jpg",
    title: "Victoria Falls",
    description: "Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World"
  }, 
  {
    url: "/lovable-uploads/6bfb6348-89bd-42b4-b8ea-b77d0d3bb6c8.png",
    title: "Canopy Walks",
    description: "Adventure across suspended bridges through Zimbabwe's lush forests"
  }, 
  {
    url: "/lovable-uploads/1ade5812-07e4-42d2-910d-e4aeb007e0db.png",
    title: "Wildlife Safari",
    description: "Encounter magnificent cheetahs and other wildlife in their natural habitat"
  }, 
  {
    url: "/lovable-uploads/6d4e39d4-1981-4237-afb7-a1a7afe47fb3.png",
    title: "Great Zimbabwe",
    description: "Visit the ancient stone city that gave Zimbabwe its name"
  }, 
  {
    url: "/lovable-uploads/4d89aba9-e022-4e41-95ec-7b887bfbd453.png",
    title: "Elephant Encounters",
    description: "Get up close with gentle giants on guided safari tours"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check auth status
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setIsLoggedIn(!!data.session);
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide(prev => prev === heroImages.length - 1 ? 0 : prev + 1);
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => prev === 0 ? heroImages.length - 1 : prev - 1);
  };
  
  const handleSignIn = () => {
    navigate("/auth");
  };
  
  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDashboard = () => {
    navigate("/dashboard");
  };
  
  const handleExploreDestination = (title: string) => {
    navigate(`/browse?search=${encodeURIComponent(title)}&tab=destinations`);
  };

  // Auto slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const slideVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* Blue Background Base Layer */}
      <div className="absolute inset-0 bg-indigo-800"></div>
      
      {/* Image Carousel with Enhanced Animations */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <motion.div 
            key={index}
            initial="hidden"
            animate={index === currentSlide ? "visible" : "hidden"}
            variants={slideVariants}
            className={cn("absolute inset-0 bg-cover bg-center bg-no-repeat", 
              index === currentSlide ? "z-10" : "z-0")}
          >
            {/* Background image with zoom effect */}
            <motion.div 
              className="absolute inset-0" 
              style={{ backgroundImage: `url(${image.url})` }}
              initial={{ scale: 1 }}
              animate={index === currentSlide ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 7 }}
            ></motion.div>
            
            {/* Blue gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-indigo-800/60 to-indigo-900/70"></div>
          </motion.div>
        ))}
      </div>
      
      {/* Fixed position Sign In Button with higher z-index */}
      <motion.div 
        className="fixed top-6 right-6 z-[100]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {loading ? (
          <Button 
            variant="secondary" 
            disabled
            className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="mr-2"
            >
              ◯
            </motion.div>
            Loading...
          </Button>
        ) : isLoggedIn ? (
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleDashboard}
              className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg"
            >
              <User className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white transition-all duration-300"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button 
            variant="secondary" 
            onClick={handleSignIn}
            className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </motion.div>
      
      {/* Navigation Arrows with hover effects */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-indigo-600/70 hover:bg-indigo-700 border-indigo-500 text-white" 
          onClick={prevSlide}
        >
          <ChevronLeft size={24} />
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-indigo-600/70 hover:bg-indigo-700 border-indigo-500 text-white" 
          onClick={nextSlide}
        >
          <ChevronRight size={24} />
        </Button>
      </motion.div>
      
      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
        <motion.div 
          className="max-w-5xl" 
          initial="hidden" 
          animate="visible" 
          variants={textVariants}
        >
          <motion.div 
            className="mb-2 text-indigo-100 font-medium tracking-widest uppercase" 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Discover Zimbabwe
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 drop-shadow-lg" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {heroImages[currentSlide].title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {heroImages[currentSlide].description}
          </motion.p>
          
          {/* Enhanced Search Bar */}
          <motion.div 
            className="w-full max-w-3xl mx-auto mb-10" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <HeroSearchBar />
          </motion.div>
          
          {/* Call to Action */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-white hover:bg-gray-100 text-indigo-700 font-medium px-6 py-6 rounded-xl shadow-lg text-lg"
                onClick={() => handleExploreDestination(heroImages[currentSlide].title)}
              >
                Explore This Destination
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/20 px-6 py-6 rounded-xl text-lg"
                onClick={() => navigate('/browse')}
              >
                View All Destinations
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Indicator dots - Enhanced with animations */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
        {heroImages.map((_, index) => (
          <motion.button 
            key={index} 
            className={cn("w-3 h-3 rounded-full transition-all", 
              index === currentSlide 
                ? "bg-indigo-400 scale-125 w-10 h-3" 
                : "bg-white/50 hover:bg-white/70"
            )} 
            onClick={() => setCurrentSlide(index)} 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
