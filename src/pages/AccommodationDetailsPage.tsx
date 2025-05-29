
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import AccommodationBookingDialog from '@/components/AccommodationBookingDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getAccommodation } from '@/models/Accommodation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Star, Calendar, Wifi, Car, Coffee, Utensils } from 'lucide-react';
import { toast } from 'sonner';

const AccommodationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const { data: accommodation, isLoading, error } = useQuery({
    queryKey: ['accommodation', id],
    queryFn: () => getAccommodation(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load accommodation details');
    }
  }, [error]);

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please log in to book accommodation');
      navigate('/auth');
      return;
    }
    setShowBookingDialog(true);
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      'wifi': Wifi,
      'parking': Car,
      'breakfast': Coffee,
      'restaurant': Utensils,
    };
    const IconComponent = iconMap[amenity.toLowerCase()] || Star;
    return <IconComponent size={16} />;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!accommodation) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Accommodation not found
          </h1>
          <Button onClick={() => navigate('/accommodations')}>
            Back to Accommodations
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-6"
      >
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/accommodations')}
            className="mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Accommodations
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          {accommodation.image_url ? (
            <img 
              src={accommodation.image_url} 
              alt={accommodation.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <Calendar className="h-20 w-20 text-amber-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{accommodation.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2" />
                  <span>{accommodation.location}</span>
                </div>
                {accommodation.rating && (
                  <div className="flex items-center">
                    <Star size={20} className="mr-2 fill-current text-yellow-400" />
                    <span>{accommodation.rating.toFixed(1)} ({accommodation.review_count || 0} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this accommodation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {accommodation.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {accommodation.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Images */}
            {accommodation.additional_images && accommodation.additional_images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {accommodation.additional_images.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${accommodation.name} - ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book Your Stay</span>
                  {accommodation.is_featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    ${accommodation.price_per_night}
                  </div>
                  <div className="text-muted-foreground">per night</div>
                </div>

                {accommodation.max_guests && (
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Users size={16} className="mr-2" />
                    <span>Up to {accommodation.max_guests} guests</span>
                  </div>
                )}

                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  size="lg"
                >
                  Book Now
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  You won't be charged until your booking is confirmed
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Dialog */}
        <AccommodationBookingDialog
          isOpen={showBookingDialog}
          onClose={() => setShowBookingDialog(false)}
          accommodation={accommodation}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AccommodationDetailsPage;
