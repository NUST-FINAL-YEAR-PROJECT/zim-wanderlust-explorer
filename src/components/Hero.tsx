
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover the Beauty of Zimbabwe
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Explore breathtaking landscapes, vibrant culture, and unforgettable experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
              Explore Destinations
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 px-8 py-6 text-lg">
              Upcoming Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
