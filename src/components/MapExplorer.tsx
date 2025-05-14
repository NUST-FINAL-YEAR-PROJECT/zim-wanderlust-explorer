
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const hotspots = [
  { 
    id: 1, 
    name: "Victoria Falls", 
    position: { top: "38%", left: "10%" },
    description: "One of the Seven Natural Wonders of the World",
    link: "/browse?search=Victoria%20Falls"
  },
  { 
    id: 2, 
    name: "Hwange National Park", 
    position: { top: "62%", left: "18%" },
    description: "Zimbabwe's largest national park with abundant wildlife",
    link: "/browse?search=Hwange"
  },
  { 
    id: 3, 
    name: "Great Zimbabwe", 
    position: { top: "72%", left: "67%" },
    description: "Ancient stone city ruins dating back to the 11th century",
    link: "/browse?search=Great%20Zimbabwe"
  },
  { 
    id: 4, 
    name: "Mana Pools", 
    position: { top: "25%", left: "60%" },
    description: "UNESCO World Heritage site known for wildlife viewing",
    link: "/browse?search=Mana%20Pools"
  },
  { 
    id: 5, 
    name: "Matobo Hills", 
    position: { top: "65%", left: "40%" },
    description: "Ancient rock formations with historic cave paintings",
    link: "/browse?search=Matobo"
  },
  { 
    id: 6, 
    name: "Lake Kariba", 
    position: { top: "35%", left: "35%" },
    description: "One of the world's largest man-made lakes",
    link: "/browse?search=Kariba"
  }
];

const MapExplorer = () => {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const navigate = useNavigate();
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Explore Zimbabwe</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover popular destinations across our beautiful country
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="aspect-[4/3] bg-amber-50 rounded-lg overflow-hidden shadow-lg border border-amber-100">
            <div className="relative w-full h-full">
              {/* Map Background */}
              <img 
                src="/map-bg.jpg" 
                alt="Map of Zimbabwe" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Zimbabwe_relief_location_map.jpg/1200px-Zimbabwe_relief_location_map.jpg";
                }}
              />
              
              {/* Hotspots */}
              {hotspots.map((hotspot) => (
                <div 
                  key={hotspot.id}
                  className="absolute"
                  style={{ 
                    top: hotspot.position.top, 
                    left: hotspot.position.left,
                    transform: "translate(-50%, -50%)" 
                  }}
                >
                  <button
                    className={`group relative flex items-center justify-center w-6 h-6 rounded-full 
                      ${activeHotspot === hotspot.id ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                    onMouseEnter={() => setActiveHotspot(hotspot.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    onClick={() => navigate(hotspot.link)}
                  >
                    <MapPin size={14} />
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    
                    {/* Tooltip */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white p-2 rounded shadow-lg z-10 transition-opacity duration-200
                      ${activeHotspot === hotspot.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      <div className="text-sm font-bold">{hotspot.name}</div>
                      <div className="text-xs text-muted-foreground">{hotspot.description}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Hover over pins to discover destinations. Click to explore more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
