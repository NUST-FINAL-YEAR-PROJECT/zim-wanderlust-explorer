
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DestinationGalleryProps {
  mainImage: string | null;
  additionalImages: string[] | null;
  name: string;
  className?: string;
}

const DestinationGallery: React.FC<DestinationGalleryProps> = ({
  mainImage,
  additionalImages = [],
  name,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Combine main image with additional images for the gallery
  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...(additionalImages || [])
  ].filter(Boolean);

  if (!allImages.length) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground rounded-lg",
        "aspect-[16/9] overflow-hidden",
        className
      )}>
        <div className="text-center p-4">
          <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn("relative group", className)}>
      <div className="overflow-hidden rounded-lg bg-muted aspect-[16/9] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <img
              src={allImages[selectedIndex]}
              alt={`${name} - Image ${selectedIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls - only show if there are multiple images */}
      {allImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            onClick={handlePrevious}
          >
            <ChevronLeft />
            <span className="sr-only">Previous image</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            onClick={handleNext}
          >
            <ChevronRight />
            <span className="sr-only">Next image</span>
          </Button>
          
          {/* Image counter */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </>
      )}
      
      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "h-16 w-24 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all",
                selectedIndex === idx ? "border-primary" : "border-transparent"
              )}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationGallery;
