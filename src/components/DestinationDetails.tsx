
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Users, Clock, ArrowLeft, Star, Compass, Thermometer, FileText, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Destination } from '@/models/Destination';
import DestinationMap from './DestinationMap';
import DestinationGallery from './DestinationGallery';

interface DestinationDetailsProps {
  destination: Destination;
  onBookClick?: () => void;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({ destination, onBookClick }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  const formatListItems = (items: string[] | null) => {
    if (!items || items.length === 0) return <p className="text-gray-500">None specified</p>;
    return (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-4 flex items-center text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <DestinationGallery 
            mainImage={destination.image_url} 
            additionalImages={destination.additional_images}
            name={destination.name}
            className="mb-6"
          />

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{destination.name}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-muted-foreground">{destination.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {destination.difficulty_level && (
                <div className="flex items-center">
                  <Compass className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className="font-medium">{destination.difficulty_level}</p>
                  </div>
                </div>
              )}
              
              {destination.duration_recommended && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{destination.duration_recommended}</p>
                  </div>
                </div>
              )}
              
              {destination.best_time_to_visit && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Best Time</p>
                    <p className="font-medium">{destination.best_time_to_visit}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{destination.description}</p>
            </div>

            <Separator />

            {/* Location Map */}
            {(destination.latitude && destination.longitude) && (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-3">Location</h2>
                  <DestinationMap
                    latitude={destination.latitude}
                    longitude={destination.longitude}
                    name={destination.name}
                    className="mt-2"
                  />
                </div>
                <Separator />
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {destination.highlights && destination.highlights.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Highlights</h2>
                  {formatListItems(destination.highlights)}
                </div>
              )}
              
              {destination.activities && destination.activities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Activities</h2>
                  {formatListItems(destination.activities)}
                </div>
              )}
            </div>

            {destination.what_to_bring && destination.what_to_bring.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-3">What to Bring</h2>
                  {formatListItems(destination.what_to_bring)}
                </div>
              </>
            )}

            {destination.amenities && destination.amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {destination.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(destination.weather_info || destination.getting_there) && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {destination.weather_info && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Weather Information</h2>
                      <p className="text-muted-foreground">{destination.weather_info}</p>
                    </div>
                  )}
                  
                  {destination.getting_there && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Getting There</h2>
                      <p className="text-muted-foreground">{destination.getting_there}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold">${destination.price}</h2>
                <p className="text-muted-foreground text-sm">per person</p>
              </div>

              <Separator />

              <div className="space-y-4">
                {destination.categories && destination.categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-1">
                      {destination.categories.map((category, index) => (
                        <Badge key={index} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {destination.additional_costs && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Additional Costs</h3>
                    <div className="space-y-2">
                      {Array.isArray(destination.additional_costs) ? (
                        destination.additional_costs.map((cost, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{cost.name}</span>
                            <span className="font-medium">${cost.price}</span>
                          </div>
                        ))
                      ) : (
                        Object.entries(destination.additional_costs).map(([name, details]: [string, any], index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{name}</span>
                            <span className="font-medium">${details.price || details}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button className="w-full" onClick={onBookClick}>
                Book This Destination
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
