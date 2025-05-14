
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface EventSummaryProps {
  eventDetails: any;
}

const EventSummary = ({ eventDetails }: EventSummaryProps) => {
  return (
    <div className="bg-secondary p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-1/3 h-40 rounded-md overflow-hidden shadow-sm">
          <img 
            src={eventDetails?.image_url || '/placeholder.svg'} 
            alt={eventDetails?.title || 'Event'} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-display font-bold">{eventDetails?.title || 'Event Details'}</h3>
          <div className="space-y-2 mt-2">
            <div className="flex items-center text-muted-foreground">
              <Calendar size={16} className="mr-2 text-primary" />
              <span>
                {eventDetails?.start_date 
                  ? format(new Date(eventDetails.start_date), 'MMMM d, yyyy') 
                  : 'Date not specified'}
                {eventDetails?.end_date && ` - ${format(new Date(eventDetails.end_date), 'MMMM d, yyyy')}`}
              </span>
            </div>
            {eventDetails?.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin size={16} className="mr-2 text-primary" />
                <span>{eventDetails.location}</span>
              </div>
            )}
            <div className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {eventDetails?.description || 'No description available.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSummary;
