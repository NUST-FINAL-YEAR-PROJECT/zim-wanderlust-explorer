
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/models/Wishlist';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface WishlistButtonProps {
  destinationId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onRemove?: () => void;
}

export function WishlistButton({ 
  destinationId, 
  variant = 'outline', 
  size = 'icon', 
  className = '',
  onRemove
}: WishlistButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) return;
      
      try {
        const result = await isInWishlist(user.id, destinationId);
        setIsWishlisted(result);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    
    checkWishlistStatus();
  }, [user, destinationId]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to add items to your wishlist");
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isWishlisted) {
        const success = await removeFromWishlist(user.id, destinationId);
        if (success) {
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
          if (onRemove) {
            onRemove();
          }
        }
      } else {
        const added = await addToWishlist(user.id, destinationId);
        if (added) {
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        size={size}
        disabled={isLoading}
        onClick={handleToggleWishlist}
        className={`${className} ${isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'} bg-white/90 hover:bg-white shadow-sm transition-all duration-200`}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          className={`h-5 w-5 transition-all duration-200 ${
            isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-current'
          } ${isLoading ? 'animate-pulse' : ''}`} 
        />
      </Button>
    </motion.div>
  );
}
