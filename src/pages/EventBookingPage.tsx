
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import EventBookingForm from '@/components/event-booking/EventBookingForm';
import { getEvent } from '@/models/Event';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const EventBookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const eventDetailsFromState = location.state?.eventDetails;
  const [eventDetails, setEventDetails] = useState(eventDetailsFromState);

  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id || ''),
    enabled: !!id && !eventDetailsFromState,
  });

  useEffect(() => {
    if (eventData && !eventDetailsFromState) {
      setEventDetails(eventData);
    }
  }, [eventData, eventDetailsFromState]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || (!eventDetails && !isLoading)) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/events')}>
              Back to Events
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Book Event</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/events')}
          >
            Back to Events
          </Button>
        </div>
        
        <EventBookingForm 
          eventId={id || ''} 
          eventDetails={eventDetails}
        />
      </div>
    </DashboardLayout>
  );
};

export default EventBookingPage;
