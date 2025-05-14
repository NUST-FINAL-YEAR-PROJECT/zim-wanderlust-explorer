
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

const heroImages = [
  {
    url: "/victoria-falls.jpg",
    title: "Victoria Falls",
    description: "Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World"
  },
  {
    url: "/hwange.jpg",
    title: "Hwange National Park",
    description: "Explore Zimbabwe's largest wildlife sanctuary with incredible safari experiences"
  },
  {
    url: "/great-zimbabwe.jpg", 
    title: "Great Zimbabwe",
    description: "Visit the ancient stone city that gave Zimbabwe its name"
  },
  {
    url: "/nyanga.jpg",
    title: "Nyanga National Park",
    description: "Discover scenic mountains, waterfalls and Zimbabwe's highest peak"
  },
  {
    url: "/mana-pools.jpg",
    title: "Mana Pools",
    description: "Encounter wildlife in this UNESCO World Heritage Site along the Zambezi River"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };
  
  const handleSearch = (query: string) => {
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };
  
  // Auto slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Image Carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            style={{ backgroundImage: `url(${image.url})` }}
          >
            <div className="absolute inset-0 bg-[#004AAD] opacity-70"></div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-[#004AAD]/30 hover:bg-[#004AAD]/50 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-[#004AAD]/30 hover:bg-[#004AAD]/50 text-white"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </Button>
      
      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-5xl animate-fade-in">
          <div className="mb-2 text-[#B3D1FF] font-medium tracking-widest">EXPLORE ZIMBABWE</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-md">
            {heroImages[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
            {heroImages[currentSlide].description}
          </p>
          
          <div className="w-full max-w-2xl mx-auto mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white hover:bg-[#E6F0FF] text-[#004AAD] px-8 py-6 text-lg"
              onClick={() => navigate("/browse?tab=destinations")}
            >
              Explore Destinations
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
              onClick={() => navigate("/browse?tab=events")}
            >
              Upcoming Events
            </Button>
          </div>
        </div>
      </div>
      
      {/* Indicator dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
            )}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
