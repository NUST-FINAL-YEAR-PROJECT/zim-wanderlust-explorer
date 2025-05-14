
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WishlistButton } from '@/components/WishlistButton';
import { RatingDisplay } from '@/components/RatingDisplay';
import { getUserWishlist, WishlistItem } from '@/models/Wishlist';
import { getDestinationRating } from '@/models/Review';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, CalendarDays } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [ratings, setRatings] = useState<{[key: string]: {average: number, count: number}}>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserWishlist(user.id);
        setWishlistItems(data);
        
        // Fetch ratings for each destination
        const ratingPromises = data.map(item => 
          getDestinationRating(item.destination_id)
            .then(rating => ({ id: item.destination_id, rating }))
        );
        
        const ratingResults = await Promise.all(ratingPromises);
        const ratingMap = ratingResults.reduce((acc, { id, rating }) => {
          acc[id] = rating;
          return acc;
        }, {} as {[key: string]: {average: number, count: number}});
        
        setRatings(ratingMap);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Handle removal from wishlist
  const handleRemoveFromWishlist = (destinationId: string) => {
    setWishlistItems(prev => prev.filter(item => item.destination_id !== destinationId));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">Destinations you've saved for later</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/3 mb-4" />
                  <Skeleton className="h-3 w-full mb-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Explore destinations and save your favorites to your wishlist.
            </p>
            <Button onClick={() => navigate('/destinations')}>
              Explore Destinations
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.destinations.image_url || '/placeholder.svg'}
                    alt={item.destinations.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <WishlistButton
                      destinationId={item.destination_id}
                      variant="default"
                      className="bg-white text-primary hover:bg-white/90"
                      onRemove={() => handleRemoveFromWishlist(item.destination_id)}
                    />
                  </div>
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-semibold text-lg mb-1">{item.destinations.name}</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{item.destinations.location}</span>
                  </div>
                  {ratings[item.destination_id] && (
                    <div className="mb-3">
                      <RatingDisplay
                        rating={ratings[item.destination_id].average}
                        count={ratings[item.destination_id].count}
                        showCount={true}
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.destinations.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="font-bold text-lg text-primary">${item.destinations.price}</div>
                  <Button 
                    onClick={() => navigate(`/destination/${item.destination_id}`)}
                    size="sm"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WishlistPage;
