
import React, { useEffect, useRef } from 'react';
import { Destination } from '@/models/Destination';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

// Define the window.google property
declare global {
  interface Window {
    google: any;
  }
}

type DestinationMapProps = {
  destination: Destination;
  className?: string;
  height?: string;
};

const DestinationMap: React.FC<DestinationMapProps> = ({ 
  destination, 
  className = '',
  height = "400px"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const hasCoordinates = destination.latitude && destination.longitude;
  
  useEffect(() => {
    // Check if the Google Maps API is loaded and if we have coordinates
    if (
      window.google && 
      window.google.maps && 
      mapRef.current &&
      hasCoordinates
    ) {
      // Create a map centered on the destination
      const map = new window.google.maps.Map(mapRef.current, {
        center: { 
          lat: destination.latitude as number, 
          lng: destination.longitude as number 
        },
        zoom: 13,
        mapTypeId: "roadmap",
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      // Add a marker for the destination
      new window.google.maps.Marker({
        position: { 
          lat: destination.latitude as number, 
          lng: destination.longitude as number 
        },
        map,
        title: destination.name,
        animation: window.google.maps.Animation.DROP,
      });
    }
  }, [destination, hasCoordinates]);

  // Generate Google Maps URL for the location
  const getGoogleMapsUrl = () => {
    if (hasCoordinates) {
      return `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`;
    }
    return `https://www.google.com/maps?q=${encodeURIComponent(destination.location)}`;
  };

  if (!hasCoordinates) {
    return (
      <Card className={`p-6 flex flex-col items-center justify-center ${className}`} style={{ height }}>
        <p className="text-muted-foreground text-center mb-4">
          No map coordinates available for this destination.
        </p>
        <a 
          href={getGoogleMapsUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-primary hover:underline"
        >
          <span>View on Google Maps</span>
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-4 flex justify-between items-center bg-muted/50">
        <h3 className="font-medium">Location</h3>
        <a 
          href={getGoogleMapsUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-primary text-sm hover:underline"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
      <div 
        ref={mapRef} 
        className="w-full" 
        style={{ height: height }}
      >
        {/* The map will be loaded here */}
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    </Card>
  );
};

export default DestinationMap;
