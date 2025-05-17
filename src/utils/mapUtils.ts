
/**
 * Formats coordinates to a human-readable string
 * @param latitude The latitude in decimal degrees
 * @param longitude The longitude in decimal degrees
 * @returns Formatted coordinate string
 */
export const formatCoordinates = (latitude: number | null, longitude: number | null): string => {
  if (latitude === null || longitude === null) {
    return 'Coordinates unavailable';
  }
  
  // Format latitude
  const latDirection = latitude >= 0 ? 'N' : 'S';
  const latDegrees = Math.abs(latitude);
  
  // Format longitude
  const lngDirection = longitude >= 0 ? 'E' : 'W';
  const lngDegrees = Math.abs(longitude);
  
  return `${latDegrees.toFixed(4)}° ${latDirection}, ${lngDegrees.toFixed(4)}° ${lngDirection}`;
};

/**
 * Generates a Google Maps URL from coordinates
 * @param latitude The latitude in decimal degrees
 * @param longitude The longitude in decimal degrees
 * @param name Optional name for the location
 * @returns Google Maps URL
 */
export const getGoogleMapsUrl = (
  latitude: number | null, 
  longitude: number | null, 
  name?: string
): string | null => {
  if (latitude === null || longitude === null) {
    return null;
  }
  
  const baseUrl = 'https://www.google.com/maps/search/?api=1&query=';
  if (name) {
    return `${baseUrl}${encodeURIComponent(name)}&query=${latitude},${longitude}`;
  }
  return `${baseUrl}${latitude},${longitude}`;
};

/**
 * Calculates the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  // Radius of the Earth in kilometers
  const R = 6371;
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

/**
 * Gets nearby destinations based on a reference point
 * @param refLatitude Reference latitude
 * @param refLongitude Reference longitude
 * @param destinations List of destinations to check
 * @param maxDistance Maximum distance in kilometers
 * @returns Array of nearby destinations with distance information
 */
export const getNearbyDestinations = (
  refLatitude: number,
  refLongitude: number,
  destinations: Array<{id: string; name: string; latitude: number | null; longitude: number | null;}>,
  maxDistance: number = 100
): Array<{destination: {id: string; name: string;}; distance: number}> => {
  return destinations
    .filter(dest => dest.latitude !== null && dest.longitude !== null)
    .map(dest => ({
      destination: {
        id: dest.id,
        name: dest.name
      },
      distance: calculateDistance(refLatitude, refLongitude, dest.latitude!, dest.longitude!)
    }))
    .filter(item => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};
