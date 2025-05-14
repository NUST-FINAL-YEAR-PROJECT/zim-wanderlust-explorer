
import { useState, useEffect, useRef } from "react";
import { Users, MapPin, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const statsData = [
  { icon: <Users size={28} />, label: "Travelers", value: 15000, suffix: "+" },
  { icon: <MapPin size={28} />, label: "Destinations", value: 120, suffix: "" },
  { icon: <Calendar size={28} />, label: "Events", value: 350, suffix: "" },
  { icon: <Star size={28} />, label: "5-Star Reviews", value: 4200, suffix: "+" },
];

const StatsCounter = () => {
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (!inView) return;
    
    const intervals = statsData.map((stat, index) => {
      return setInterval(() => {
        setCounts(prev => {
          const newCounts = [...prev];
          if (newCounts[index] < stat.value) {
            const increment = Math.max(1, Math.floor(stat.value / 50));
            newCounts[index] = Math.min(stat.value, newCounts[index] + increment);
          }
          return newCounts;
        });
      }, 30);
    });
    
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [inView]);
  
  return (
    <div ref={ref} className="py-20 bg-safari-dark bg-opacity-5 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-safari-light"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-savanna"></div>
        <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-forest-light"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-16 text-safari-dark">Experience Zimbabwe</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, index) => (
            <div key={index} className={cn(
              "text-center transform transition-all duration-500",
              inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
              // Add staggered delay based on index
              index === 0 ? "" : 
              index === 1 ? "transition-delay-100" : 
              index === 2 ? "transition-delay-200" : 
              "transition-delay-300"
            )}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-safari-light/30 text-safari-dark mb-6 shadow-inner">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-safari-dark mb-2 flex items-center justify-center">
                <span>{counts[index].toLocaleString()}</span>
                <span>{stat.suffix}</span>
              </div>
              <div className="text-safari/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
