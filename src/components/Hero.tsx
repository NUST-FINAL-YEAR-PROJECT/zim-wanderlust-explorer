
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const Hero = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-[#004AAD] opacity-75"></div>
      </div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover the Beauty of Zimbabwe
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Explore breathtaking landscapes, vibrant culture, and unforgettable experiences
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
    </div>
  );
};

export default Hero;
