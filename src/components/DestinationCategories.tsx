
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Map, 
  Mountain, 
  Tent, 
  Building, 
  Beach, 
  TreePine, 
  Camera, 
  Compass 
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "national-parks", name: "National Parks", icon: TreePine },
  { id: "cities", name: "Cities", icon: Building },
  { id: "wildlife", name: "Wildlife", icon: Map },
  { id: "mountains", name: "Mountains", icon: Mountain },
  { id: "camping", name: "Camping", icon: Tent },
  { id: "lakes", name: "Lakes", icon: Beach },
  { id: "photography", name: "Photography", icon: Camera },
  { id: "adventure", name: "Adventure", icon: Compass },
];

const DestinationCategories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    navigate(`/browse?category=${categoryId}`);
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-medium mb-6">Browse by category</h2>
      <div className="flex overflow-x-auto pb-4 gap-8 scrollbar-hide -mx-4 px-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div 
              key={category.id}
              className={cn(
                "flex flex-col items-center cursor-pointer min-w-[80px]",
                activeCategory === category.id ? "opacity-100" : "opacity-70 hover:opacity-100"
              )}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className={cn(
                "w-16 h-16 rounded-lg flex items-center justify-center mb-2 transition-all duration-200",
                activeCategory === category.id 
                  ? "bg-rose-100 text-rose-600" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}>
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DestinationCategories;
