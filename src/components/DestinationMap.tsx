
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';

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
    if (!hasValidCoordinates || !mapContainer.current) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
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

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, name, hasValidCoordinates]);

  if (!hasValidCoordinates) {
    return (
      <Card className={`p-4 text-center bg-muted/30 ${className}`}>
        <p className="text-muted-foreground">Map location unavailable</p>
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
