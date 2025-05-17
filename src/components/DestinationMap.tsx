
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { AlertCircle } from 'lucide-react';

// Replace with your Mapbox token from the Supabase Edge Function Secrets
// or a temporary input field if the project is not connected to Supabase
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia3VkemFpemh1d2FraSIsImEiOiJjbHJqeXd6cjUwdzdtMnFvZXdpZnQ4ZThkIn0.vwHYGt1xS6U5jrOcnJ38WQ';

interface DestinationMapProps {
  latitude: number | null;
  longitude: number | null;
  name: string;
  className?: string;
}

const DestinationMap: React.FC<DestinationMapProps> = ({ latitude, longitude, name, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const hasValidCoordinates = !!latitude && !!longitude;

  useEffect(() => {
    // Log for debugging
    console.log(`Map rendering with coordinates: ${latitude}, ${longitude}`);
    
    if (!hasValidCoordinates || !mapContainer.current) {
      console.log("Missing coordinates or map container");
      return;
    }

    // Check if Mapbox token is available
    if (!MAPBOX_TOKEN) {
      console.error("Mapbox token is not set");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [longitude, latitude],
        zoom: 12,
        interactive: true,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add marker for the destination
      new mapboxgl.Marker({ color: '#3949ab' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(name))
        .addTo(map.current);

      map.current.on('load', () => {
        console.log("Map loaded successfully");
      });

      map.current.on('error', (e) => {
        console.error("Map error:", e);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        console.log("Map removed");
      }
    };
  }, [latitude, longitude, name, hasValidCoordinates]);

  if (!hasValidCoordinates) {
    return (
      <Card className={`p-4 text-center bg-muted/30 ${className}`}>
        <div className="flex flex-col items-center justify-center p-4">
          <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
          <p className="text-muted-foreground">Map location unavailable</p>
          <p className="text-xs text-muted-foreground mt-1">Coordinates not provided for this destination</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full rounded-md overflow-hidden aspect-[4/3] shadow-md"
      />
    </div>
  );
};

export default DestinationMap;
