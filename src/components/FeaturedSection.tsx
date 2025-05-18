
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Feature = {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  icon: JSX.Element;
};

const features: Feature[] = [
  {
    id: 1,
    title: "Adventure Destinations",
    description: "Discover thrilling destinations perfect for adventure seekers",
    image: "/lovable-uploads/6bfb6348-89bd-42b4-b8ea-b77d0d3bb6c8.png",
    link: "/browse?categories=Adventure",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Wildlife Experiences",
    description: "Get up close with magnificent wildlife in their natural habitats",
    image: "/lovable-uploads/1ade5812-07e4-42d2-910d-e4aeb007e0db.png",
    link: "/browse?categories=Wildlife",
    icon: <Star className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Cultural Events",
    description: "Experience traditional ceremonies and cultural festivals",
    image: "/lovable-uploads/6d4e39d4-1981-4237-afb7-a1a7afe47fb3.png",
    link: "/browse?categories=Cultural",
    icon: <Calendar className="h-5 w-5" />,
  }
];

const FeaturedSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-3 text-indigo-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Experiences
          </motion.h2>
          <motion.p 
            className="text-lg text-indigo-700/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover handpicked experiences that showcase the best of Zimbabwe
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              onMouseEnter={() => setHoveredId(feature.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(feature.link)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${feature.image})` }}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: hoveredId === feature.id ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="bg-indigo-600/90 backdrop-blur-sm p-2 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </div>
                
                <motion.div 
                  className="absolute bottom-6 right-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: hoveredId === feature.id ? 1 : 0,
                    x: hoveredId === feature.id ? 0 : 20
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    size="sm" 
                    className="bg-white text-indigo-700 hover:bg-white/90 rounded-full"
                  >
                    <span>Explore</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
