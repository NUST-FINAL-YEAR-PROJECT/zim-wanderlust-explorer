
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface EventSummaryProps {
  eventDetails: any;
}

const EventSummary = ({ eventDetails }: EventSummaryProps) => {
  return (
    <div className="bg-[#F1F0FB]/60 p-4 rounded-lg mb-6 border border-[#E2E8F0] shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-1/3 h-40 rounded-md overflow-hidden">
          <img 
            src={eventDetails?.image_url || '/placeholder.svg'} 
            alt={eventDetails?.title || 'Event'} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#6366F1] font-display">{eventDetails?.title || 'Event Details'}</h3>
          <div className="space-y-2 mt-2 font-body">
            <div className="flex items-center text-[#6366F1]/70">
              <Calendar size={16} className="mr-2" />
              <span>
                {eventDetails?.start_date 
                  ? format(new Date(eventDetails.start_date), 'MMMM d, yyyy') 
                  : 'Date not specified'}
                {eventDetails?.end_date && ` - ${format(new Date(eventDetails.end_date), 'MMMM d, yyyy')}`}
              </span>
            </div>
            {eventDetails?.location && (
              <div className="flex items-center text-[#6366F1]/70">
                <MapPin size={16} className="mr-2" />
                <span>{eventDetails.location}</span>
              </div>
            )}
            <div className="mt-2 text-sm text-[#6366F1]/80 line-clamp-3">
              {eventDetails?.description || 'No description available.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSummary;
