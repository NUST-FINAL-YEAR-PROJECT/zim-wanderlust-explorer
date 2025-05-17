
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDestination } from '@/models/Destination';
import { getDestinationRating } from '@/models/Review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/DashboardLayout';
import { MapPin, Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WishlistButton } from '@/components/WishlistButton';
import { RatingDisplay } from '@/components/RatingDisplay';
import { ReviewSection } from '@/components/ReviewSection';
import { DestinationGallery } from '@/components/DestinationGallery';
import DestinationMap from '@/components/DestinationMap';

const DestinationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: destination, isLoading } = useQuery({
    queryKey: ['destination', id],
    queryFn: () => getDestination(id as string),
    enabled: !!id
  });

  const { data: rating = { average: 0, count: 0 }, isLoading: isRatingLoading } = useQuery({
    queryKey: ['destinationRating', id],
    queryFn: () => getDestinationRating(id as string),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] lg:col-span-2" />
            <div className="space-y-4 lg:col-span-1">
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!destination) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Destination Not Found</h2>
          <p className="text-muted-foreground mb-6">The destination you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/destinations')}>
            Back to Destinations
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{destination.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin size={16} className="mr-1" />
              <span>{destination.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WishlistButton 
              destinationId={destination.id} 
              variant="default" 
              className="relative z-10"
            />
            <span className="text-2xl font-bold text-primary">${destination.price}</span>
            <Button 
              onClick={() => navigate(`/booking/${destination.id}`)}
            >
              Book Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden relative mb-16">
              <DestinationGallery destination={destination} />
              
              <div className="p-6">
                {!isRatingLoading && (
                  <div className="mb-4">
                    <RatingDisplay 
                      rating={rating.average} 
                      count={rating.count}
                      showCount={true}
                      size="lg"
                    />
                  </div>
                )}
              </div>
              
              <Tabs defaultValue="overview" className="p-6 pt-0">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="map">Map</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">{destination.description}</p>
                  </div>
                  
                  {destination.highlights && destination.highlights.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Highlights</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {destination.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle size={18} className="text-primary mr-2 mt-1 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  {destination.getting_there && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Getting There</h2>
                      <p className="text-muted-foreground">{destination.getting_there}</p>
                    </div>
                  )}
                  
                  {destination.best_time_to_visit && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Best Time to Visit</h2>
                      <p className="text-muted-foreground">{destination.best_time_to_visit}</p>
                    </div>
                  )}
                  
                  {destination.weather_info && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Weather Information</h2>
                      <p className="text-muted-foreground">{destination.weather_info}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="amenities" className="space-y-4">
                  {destination.amenities && destination.amenities.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Available Amenities</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {destination.amenities.map((amenity, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle size={16} className="text-green-500 mr-2" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {destination.what_to_bring && destination.what_to_bring.length > 0 && (
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold mb-2">What to Bring</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {destination.what_to_bring.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle size={16} className="text-green-500 mr-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="map" className="space-y-4">
                  <DestinationMap destination={destination} />
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4">
                  <ReviewSection destinationId={destination.id} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {destination.duration_recommended && (
                  <div className="flex items-center">
                    <Clock size={18} className="mr-3 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">Recommended Duration</p>
                      <p className="text-muted-foreground">{destination.duration_recommended}</p>
                    </div>
                  </div>
                )}
                
                {destination.best_time_to_visit && (
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-3 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">Best Time to Visit</p>
                      <p className="text-muted-foreground">{destination.best_time_to_visit}</p>
                    </div>
                  </div>
                )}
                
                {destination.difficulty_level && (
                  <div className="flex items-center">
                    <Users size={18} className="mr-3 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">Difficulty Level</p>
                      <p className="text-muted-foreground">{destination.difficulty_level}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/booking/${destination.id}`)}
                  >
                    Book This Destination
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {destination.activities && destination.activities.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {destination.activities.map((activity, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle size={16} className="text-primary mr-2" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DestinationDetails;
