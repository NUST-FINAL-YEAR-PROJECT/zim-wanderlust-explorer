
import { supabase } from "@/integrations/supabase/client";

export interface TransportOperator {
  id: string;
  name: string;
  type: 'private' | 'public' | 'air';
  description: string;
  price_range: string;
  image_url: string | null;
  contact_phone: string;
  contact_email: string;
  website: string | null;
  rating: number;
  is_featured: boolean;
  is_verified: boolean;
}

// Mock data - for demo purposes
const mockTransportOperators: TransportOperator[] = [
  {
    id: '1',
    name: 'Zimbabwe Express',
    type: 'public',
    description: 'Reliable and affordable public transport connecting all major cities in Zimbabwe.',
    price_range: '$-$$',
    image_url: '/placeholder.svg',
    contact_phone: '+263 123 456789',
    contact_email: 'info@zimexpress.co.zw',
    website: 'https://zimexpress.co.zw',
    rating: 4.2,
    is_featured: true,
    is_verified: true
  },
  {
    id: '2',
    name: 'VIP Safari Tours',
    type: 'private',
    description: 'Luxury private transport for discerning travelers with experienced guides.',
    price_range: '$$$-$$$$',
    image_url: '/placeholder.svg',
    contact_phone: '+263 987 654321',
    contact_email: 'bookings@vipsafari.zw',
    website: 'https://vipsafari.zw',
    rating: 4.9,
    is_featured: true,
    is_verified: true
  },
  {
    id: '3',
    name: 'Zimbabwe Airways',
    type: 'air',
    description: 'Domestic flights connecting major tourist destinations throughout Zimbabwe.',
    price_range: '$$$-$$$$',
    image_url: '/placeholder.svg',
    contact_phone: '+263 777 888999',
    contact_email: 'reservations@zimairways.com',
    website: 'https://zimairways.com',
    rating: 4.5,
    is_featured: true,
    is_verified: true
  },
  {
    id: '4',
    name: 'Explorer Bus Services',
    type: 'public',
    description: 'Budget-friendly shuttle service for tourists exploring Zimbabwe.',
    price_range: '$',
    image_url: '/placeholder.svg',
    contact_phone: '+263 444 555666',
    contact_email: 'info@explorerbus.zw',
    website: null,
    rating: 3.8,
    is_featured: false,
    is_verified: true
  },
  {
    id: '5',
    name: 'Luxury Chauffeur Zimbabwe',
    type: 'private',
    description: 'Premium private car service with professional drivers and luxury vehicles.',
    price_range: '$$$$',
    image_url: '/placeholder.svg',
    contact_phone: '+263 111 222333',
    contact_email: 'bookings@luxurychauffeur.zw',
    website: 'https://luxurychauffeur.zw',
    rating: 5.0,
    is_featured: true,
    is_verified: true
  },
  {
    id: '6',
    name: 'Bush Hopper Air',
    type: 'air',
    description: 'Small plane charter service for remote destinations and safari locations.',
    price_range: '$$$$',
    image_url: '/placeholder.svg',
    contact_phone: '+263 666 777888',
    contact_email: 'fly@bushhopper.zw',
    website: 'https://bushhopper.zw',
    rating: 4.7,
    is_featured: false,
    is_verified: true
  },
  {
    id: '7',
    name: 'City Link Shuttle',
    type: 'public',
    description: 'Scheduled shuttle service between hotels and major attractions.',
    price_range: '$$',
    image_url: '/placeholder.svg',
    contact_phone: '+263 222 333444',
    contact_email: 'reservations@citylink.co.zw',
    website: 'https://citylink.co.zw',
    rating: 4.1,
    is_featured: false,
    is_verified: true
  }
];

export const getTransportOperators = async (): Promise<TransportOperator[]> => {
  try {
    // In a real app, we would fetch from the database
    // For now, using mock data
    return Promise.resolve(mockTransportOperators);
  } catch (error) {
    console.error("Error fetching transport operators:", error);
    return [];
  }
};

export const getTransportOperatorById = async (id: string): Promise<TransportOperator | null> => {
  try {
    // In a real app, we would fetch from the database
    // For now, using mock data
    const operator = mockTransportOperators.find(op => op.id === id);
    return Promise.resolve(operator || null);
  } catch (error) {
    console.error(`Error fetching transport operator with id ${id}:`, error);
    return null;
  }
};

export const getTransportOperatorsByType = async (type: 'private' | 'public' | 'air'): Promise<TransportOperator[]> => {
  try {
    // In a real app, we would fetch from the database
    // For now, using mock data
    const operators = mockTransportOperators.filter(op => op.type === type);
    return Promise.resolve(operators);
  } catch (error) {
    console.error(`Error fetching ${type} transport operators:`, error);
    return [];
  }
};

export const getRecommendedTransportForDestination = async (destinationId: string): Promise<TransportOperator[]> => {
  try {
    // In a real app, we would fetch based on destination proximity or relationships
    // For now, return a subset of mock data
    const recommendedCount = Math.floor(Math.random() * 3) + 2; // 2-4 recommendations
    const shuffled = [...mockTransportOperators].sort(() => 0.5 - Math.random());
    return Promise.resolve(shuffled.slice(0, recommendedCount));
  } catch (error) {
    console.error(`Error fetching recommended transport for destination ${destinationId}:`, error);
    return [];
  }
};

export const addToCartTransportOperator = async (userId: string, operatorId: string, quantity: number = 1, travelDate: string | null = null) => {
  try {
    // In a real app, we would add to cart in the database
    // For now, just log it
    console.log(`Added transport operator ${operatorId} to cart for user ${userId}, quantity: ${quantity}, date: ${travelDate}`);
    return true;
  } catch (error) {
    console.error(`Error adding transport operator ${operatorId} to cart:`, error);
    return false;
  }
};
