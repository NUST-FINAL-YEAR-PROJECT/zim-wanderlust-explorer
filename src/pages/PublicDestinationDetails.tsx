
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Info, Check, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Destination, getDestination } from '@/models/Destination';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/Footer';
import { RatingDisplay } from '@/components/RatingDisplay';
import { getDestinationRating } from '@/models/Review';

const PublicDestinationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState({ average: 0, count: 0 });

  useEffect(() => {
    async function fetchDestination() {
      if (!id) return;
      
      setLoading(true);
      try {
        const destinationData = await getDestination(id);
        if (destinationData) {
          setDestination(destinationData);
          
          try {
            const ratingData = await getDestinationRating(id);
            if (ratingData) {
              setRating(ratingData);
            }
          } catch (error) {
            console.error("Error fetching rating:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDestination();
  }, [id]);

  const handleBookNow = () => {
    navigate('/auth', { state: { returnTo: `/destination/${id}` } });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-96 bg-gray-200 animate-pulse"></div>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-grow">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-8" />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[1,2,3,4,5,6].map(i => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              
              <Skeleton className="h-64 mb-6" />
            </div>
            
            <div className="w-full md:w-80">
              <Skeleton className="h-64 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
          <p className="text-muted-foreground mb-8">The destination you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/browse')}>Browse Destinations</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-96 relative overflow-hidden">
        <img 
          src={destination.image_url || '/placeholder.svg'} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="container max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span>{destination.location}</span>
              </div>
              {rating.count > 0 && (
                <RatingDisplay rating={rating.average} count={rating.count} showCount={true} className="text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About this destination</h2>
                  <p className="text-muted-foreground">{destination.description}</p>
                </div>
                
                {destination.highlights && destination.highlights.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {destination.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                          <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {destination.amenities && destination.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {destination.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-start">
                          <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-5">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Info size={18} className="mr-2 text-green-600" /> Weather Information
                    </h3>
                    <p className="text-muted-foreground">{destination.weather_info || "No weather information available."}</p>
                  </Card>
                  
                  <Card className="p-5">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Calendar size={18} className="mr-2 text-green-600" /> Best Time to Visit
                    </h3>
                    <p className="text-muted-foreground">{destination.best_time_to_visit || "No information available."}</p>
                  </Card>
                  
                  <Card className="p-5">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Clock size={18} className="mr-2 text-green-600" /> Recommended Duration
                    </h3>
                    <p className="text-muted-foreground">{destination.duration_recommended || "No duration information available."}</p>
                  </Card>
                  
                  <Card className="p-5">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <MapPin size={18} className="mr-2 text-green-600" /> Getting There
                    </h3>
                    <p className="text-muted-foreground">{destination.getting_there || "No travel information available."}</p>
                  </Card>
                </div>
                
                {destination.what_to_bring && destination.what_to_bring.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">What to Bring</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {destination.what_to_bring.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-6">
                {destination.activities && destination.activities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {destination.activities.map((activity, index) => (
                      <Card key={index} className="p-5">
                        <h3 className="text-lg font-medium mb-2">{activity}</h3>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No activities listed for this destination.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full md:w-80 md:flex-shrink-0">
            <Card className="p-6 sticky top-8">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold">Price</span>
                  <span className="text-2xl font-bold text-green-700">${destination.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Per person, taxes may apply</p>
                
                {destination.categories && destination.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.categories.map((category, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Button 
                  className="w-full bg-green-700 hover:bg-green-800 text-white"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
                
                <div className="mt-4 text-center">
                  <div className="text-sm text-muted-foreground">
                    Sign up or log in to book this destination
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">More Information</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Users size={16} className="mr-2 text-muted-foreground" />
                    <span>Difficulty: {destination.difficulty_level || 'N/A'}</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full text-green-700 border-green-700"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In for More <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicDestinationDetails;
