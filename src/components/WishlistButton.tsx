
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/models/Wishlist';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to your wishlist",
      });
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isWishlisted) {
        const success = await removeFromWishlist(user.id, destinationId);
        if (success) {
          setIsWishlisted(false);
          if (onRemove) {
            onRemove();
          }
        }
      } else {
        const added = await addToWishlist(user.id, destinationId);
        if (added) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading}
      onClick={handleToggleWishlist}
      className={`${className} ${isWishlisted ? 'text-primary hover:text-primary' : ''} bg-white hover:bg-white/90 shadow-sm`}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-primary stroke-primary' : 'stroke-primary'}`} />
    </Button>
  );
}
