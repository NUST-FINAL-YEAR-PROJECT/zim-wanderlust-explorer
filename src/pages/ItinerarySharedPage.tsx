
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { getItineraryByShareCode } from '@/models/Itinerary';
import { Itinerary, ItineraryDestination } from '@/models/Itinerary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';

export default function ItinerarySharedPage() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItinerary = async () => {
      if (!shareCode) return;
      
      setIsLoading(true);
      try {
        const data = await getItineraryByShareCode(shareCode);
        setItinerary(data);
      } catch (error) {
        console.error('Error loading shared itinerary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItinerary();
  }, [shareCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading itinerary...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Itinerary Not Found</h2>
            <p className="text-muted-foreground mb-6">This shared itinerary is no longer available or has been set to private.</p>
            <Link to="/">
              <Button>Go to Home Page</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalDays = itinerary.destinations.length > 0
    ? differenceInDays(
        parseISO(itinerary.destinations[itinerary.destinations.length - 1].endDate),
        parseISO(itinerary.destinations[0].startDate)
      ) + 1
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary/10 py-6">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-primary font-medium">← Back to Home</Link>
          <h1 className="text-3xl font-bold mt-4">{itinerary.title}</h1>
          {itinerary.description && (
            <p className="text-muted-foreground mt-2">{itinerary.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{totalDays} days</span>
            <span>•</span>
            <span>{itinerary.destinations.length} destinations</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Separator className="mb-8" />

        <div className="space-y-6">
          {itinerary.destinations.map((destination, index) => (
            <SharedDestinationCard 
              key={destination.id} 
              destination={destination} 
              index={index}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface SharedDestinationCardProps {
  destination: ItineraryDestination;
  index: number;
}

function SharedDestinationCard({ destination, index }: SharedDestinationCardProps) {
  const startDate = parseISO(destination.startDate);
  const endDate = parseISO(destination.endDate);
  const days = differenceInDays(endDate, startDate) + 1;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm font-medium">
                {index + 1}
              </span>
              {destination.name}
            </CardTitle>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Destination ID: {destination.destinationId}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{days} {days === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">From:</span>{' '}
              <span className="font-medium">{format(startDate, 'MMM d, yyyy')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">To:</span>{' '}
              <span className="font-medium">{format(endDate, 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          {destination.notes && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-1">Notes:</p>
              <p className="text-sm whitespace-pre-line">{destination.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
