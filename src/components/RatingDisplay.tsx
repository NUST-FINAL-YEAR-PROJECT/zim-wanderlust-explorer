
import { Star, StarHalf } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RatingDisplay({ 
  rating, 
  count = 0, 
  showCount = false, 
  className = "",
  size = "md" 
}: RatingDisplayProps) {
  // Calculate full and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Set star size based on the size prop
  const starSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${starSize} fill-amber-500 text-amber-500`} />
        ))}
        
        {/* Half star if needed */}
        {hasHalfStar && <StarHalf className={`${starSize} fill-amber-500 text-amber-500`} />}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
        ))}
      </div>
      
      {showCount && count > 0 && (
        <span className={`ml-1 text-muted-foreground ${textSize}`}>({count})</span>
      )}
    </div>
  );
}
