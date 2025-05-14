
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HomepageSearchBar from "./HomepageSearchBar";
import { LogIn } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative h-[700px] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>
      
      {/* Sign In Button */}
      <div className="absolute top-6 right-6 z-20">
        <Button 
          variant="outline" 
          onClick={() => navigate("/auth")}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-4xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 drop-shadow-lg">
            Discover the Beauty of Zimbabwe
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-3xl mx-auto">
            Explore breathtaking landscapes, vibrant culture, and unforgettable experiences
          </p>
          
          <div className="w-full max-w-3xl mx-auto mb-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <HomepageSearchBar />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all duration-300"
              onClick={() => navigate("/browse?tab=destinations")}
            >
              Explore Destinations
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/20 hover:text-white px-8 py-6 text-lg rounded-xl transition-all duration-300"
              onClick={() => navigate("/browse?tab=events")}
            >
              Upcoming Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
