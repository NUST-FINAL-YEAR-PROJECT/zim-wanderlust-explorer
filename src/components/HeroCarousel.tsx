
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";

// Using images from the database (mapped from the available images in the project)
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
    url: "/gonarezhou.jpg",
    title: "Gonarezhou National Park",
    description: "Encounter wildlife in the 'Place of Elephants' with its striking Chilojo Cliffs"
  },
  {
    url: "/mana-pools.jpg",
    title: "Mana Pools",
    description: "Encounter wildlife in this UNESCO World Heritage Site along the Zambezi River"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowResults(true);
      // You would fetch actual results here
    } else {
      setShowResults(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };
  
  // Auto slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    
    return () => clearInterval(timer);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* Blue Background Base Layer */}
      <div className="absolute inset-0 bg-indigo-800"></div>
      
      {/* Image Carousel with Reduced Transparency */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {/* Semi-transparent overlay for the image */}
            <div 
              className="absolute inset-0 opacity-80" 
              style={{ backgroundImage: `url(${image.url})` }}
            ></div>
            
            {/* Blue gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-indigo-800/60 to-indigo-900/70"></div>
          </div>
        ))}
      </div>
      
      {/* Sign In Button */}
      <div className="absolute top-6 right-6 z-20">
        <Button 
          variant="secondary" 
          onClick={() => navigate("/auth")}
          className="bg-indigo-600/90 hover:bg-indigo-700 backdrop-blur-md border-indigo-500/20 text-white hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </div>
      
      {/* Navigation Arrows */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-indigo-600/70 hover:bg-indigo-700 border-indigo-500 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-indigo-600/70 hover:bg-indigo-700 border-indigo-500 text-white"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </Button>
      
      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-5xl animate-fade-in">
          <div className="mb-2 text-indigo-100 font-medium tracking-widest uppercase">Explore Zimbabwe</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 drop-shadow-lg">
            {heroImages[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            {heroImages[currentSlide].description}
          </p>
          
          {/* Search Bar with Results Panel */}
          <div className="w-full max-w-3xl mx-auto mb-10 relative">
            <div className="flex gap-2">
              <div className="relative flex-1 bg-white rounded-lg overflow-hidden shadow-md">
                <input
                  type="text"
                  placeholder="Where would you like to explore?"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 py-6 text-base w-full shadow-sm border-0 focus-visible:ring-indigo-500 rounded-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
              <Button 
                onClick={handleSearchSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-[52px] px-6 rounded-lg shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/40"
              >
                Search
              </Button>
            </div>
            
            {/* Search Results Panel */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">Quick Results</h3>
                  <div className="space-y-2">
                    <div 
                      className="p-2 hover:bg-indigo-50 rounded cursor-pointer flex items-center"
                      onClick={() => navigate('/browse?search=victoria+falls')}
                    >
                      <div className="w-10 h-10 rounded bg-indigo-100 mr-3 flex-shrink-0"></div>
                      <div className="flex-grow">
                        <p className="font-medium">Victoria Falls</p>
                        <p className="text-sm text-gray-500">Popular destination</p>
                      </div>
                    </div>
                    <div 
                      className="p-2 hover:bg-indigo-50 rounded cursor-pointer flex items-center"
                      onClick={() => navigate('/browse?search=hwange')}
                    >
                      <div className="w-10 h-10 rounded bg-indigo-100 mr-3 flex-shrink-0"></div>
                      <div className="flex-grow">
                        <p className="font-medium">Hwange National Park</p>
                        <p className="text-sm text-gray-500">Wildlife sanctuary</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={handleSearchSubmit} 
                        className="text-indigo-600"
                      >
                        See all results
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/40 transition-all duration-300"
              onClick={() => navigate("/browse?tab=destinations")}
            >
              Explore Destinations
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl transition-all duration-300"
              onClick={() => navigate("/browse?tab=events")}
            >
              Upcoming Events
            </Button>
          </div>
        </div>
      </div>
      
      {/* Indicator dots */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentSlide 
                ? "bg-indigo-400 scale-125 w-10 h-3" 
                : "bg-white/50 hover:bg-white/70"
            )}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
