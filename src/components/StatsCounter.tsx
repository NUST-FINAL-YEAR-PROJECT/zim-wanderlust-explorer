
import { useState, useEffect, useRef } from "react";
import { Users, MapPin, Calendar, Star } from "lucide-react";

const statsData = [
  { icon: <Users size={24} />, label: "Travelers", value: 15000, suffix: "+" },
  { icon: <MapPin size={24} />, label: "Destinations", value: 120, suffix: "" },
  { icon: <Calendar size={24} />, label: "Events", value: 350, suffix: "" },
  { icon: <Star size={24} />, label: "5-Star Reviews", value: 4200, suffix: "+" },
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
    <div ref={ref} className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Experience Zimbabwe</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {counts[index].toLocaleString()}{stat.suffix}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
