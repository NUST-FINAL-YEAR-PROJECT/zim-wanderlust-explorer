
import React, { useState } from 'react';
import { Destination } from '@/models/Destination';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

type DestinationGalleryProps = {
  destination: Destination;
  className?: string;
};

export const DestinationGallery: React.FC<DestinationGalleryProps> = ({ 
  destination,
  className = ''
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const images = [
    destination.image_url, 
    ...(destination.additional_images || [])
  ].filter(Boolean) as string[];

  if (!images.length) {
    return (
      <Card className={`bg-muted relative overflow-hidden h-[400px] ${className}`}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </Card>
    );
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  return (
    <>
      <Card className={`relative overflow-hidden ${className}`}>
        <img 
          src={images[currentImageIndex]} 
          alt={`${destination.name} - image ${currentImageIndex + 1}`}
          className="w-full h-[400px] object-cover"
        />
        
        {/* Image count indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
        
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
        
        {/* Fullscreen button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 rounded-full"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        
        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="absolute -bottom-[60px] left-0 right-0 flex justify-center gap-2 p-2">
            {images.map((image, idx) => (
              <div 
                key={idx} 
                className={`w-12 h-12 rounded cursor-pointer transition-all ${currentImageIndex === idx ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Fullscreen modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={toggleFullscreen}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white hover:bg-white/20" 
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
          >
            <Maximize2 className="h-6 w-6" />
          </Button>
          
          <img 
            src={images[currentImageIndex]} 
            alt={`${destination.name} - fullscreen`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {images.length > 1 && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
};
