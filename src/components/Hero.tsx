import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EnhancedSearchBar from "./EnhancedSearchBar";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch public images for slideshow
  useEffect(() => {
    const fetchPublicImages = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('public')
          .list('', { limit: 100 });

        if (error) {
          console.error('Error fetching images:', error);
          return;
        }

        if (data) {
          const imageUrls = data
            .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
            .map(file => {
              const { data: urlData } = supabase.storage
                .from('public')
                .getPublicUrl(file.name);
              return urlData.publicUrl;
            });
          
          setImages(imageUrls);
        }
      } catch (error) {
        console.error('Error fetching public images:', error);
      }
    };

    fetchPublicImages();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth status:", error);
          toast({
            title: "Authentication Error",
            description: "Failed to verify your login status.",
            variant: "destructive",
          });
        } else {
          setIsLoggedIn(!!data.session);
        }
      } catch (error) {
        console.error("Exception checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };

  const handleSignIn = () => {
    setIsLoading(true);
    try {
      navigate("/auth");
    } catch (error) {
      console.error("Navigation error:", error);
      setIsLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleExploreDestinations = () => {
    navigate("/browse?tab=destinations");
    console.log("User clicked Explore Destinations");
  };

  const handleUpcomingEvents = () => {
    navigate("/browse?tab=events");
    console.log("User clicked Upcoming Events");
  };

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8, 
        delay: 0.3, 
        ease: "easeOut" 
      }
    }
  };

  const searchBarVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        delay: 0.6 
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.9 
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="relative h-[800px] overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {images.length > 0 ? (
          images.map((imageUrl, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${imageUrl})` }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentImageIndex === index ? 1 : 0,
                scale: currentImageIndex === index ? 1 : 1.05
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>
      
      {/* Sign In/Account Button */}
      <motion.div 
        className="absolute top-6 right-6 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isLoading ? (
          <Button 
            variant="secondary" 
            disabled
            className="bg-indigo-600/90 backdrop-blur-md border-indigo-500/20 text-white"
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
              className="bg-indigo-600/90 hover:bg-indigo-700 backdrop-blur-md border-indigo-500/20 text-white hover:text-white transition-all duration-300 shadow-lg"
            >
              Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="bg-transparent backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white transition-all duration-300"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button 
            variant="secondary" 
            onClick={handleSignIn}
            className="bg-indigo-600/90 hover:bg-indigo-700 backdrop-blur-md border-indigo-500/20 text-white hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </motion.div>
      
      {/* Slideshow indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentImageIndex === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
      
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-5xl w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 drop-shadow-lg">
              Discover the Beauty of Zimbabwe
            </h1>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={subtitleVariants}
          >
            <p className="text-xl md:text-2xl text-white/90 mb-12 font-light max-w-3xl mx-auto">
              Explore breathtaking landscapes, vibrant culture, and unforgettable experiences
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={searchBarVariants}
            className="w-full mb-10"
          >
            <EnhancedSearchBar />
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button 
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all duration-300"
                onClick={() => navigate("/browse?tab=destinations")}
              >
                Explore Destinations
              </Button>
            </motion.div>
            
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/20 hover:text-white px-8 py-6 text-lg rounded-xl transition-all duration-300"
                onClick={() => navigate("/browse?tab=events")}
              >
                Upcoming Events
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
