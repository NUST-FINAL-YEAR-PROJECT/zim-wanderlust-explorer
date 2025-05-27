
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Users, CreditCard, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    type: 'destination' | 'event';
    name: string;
    date: string;
    location: string;
    guests: number;
    totalPrice: number;
    bookingId?: string;
  };
  onViewBooking?: () => void;
  onPayNow?: () => void;
}

const BookingConfirmationDialog = ({
  isOpen,
  onClose,
  bookingDetails,
  onViewBooking,
  onPayNow
}: BookingConfirmationDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: isClosing ? 0.9 : 1, opacity: isClosing ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <DialogTitle className="text-2xl font-bold text-green-700 dark:text-green-300">
              Booking Confirmed!
            </DialogTitle>
            
            <DialogDescription className="text-base">
              Your booking has been successfully created. You'll receive a confirmation email shortly.
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  {bookingDetails.name}
                </h3>
                <Badge variant="outline" className="text-blue-700 border-blue-200">
                  {bookingDetails.type === 'event' ? 'Event' : 'Destination'}
                </Badge>
              </div>
              
              <Separator className="bg-blue-200 dark:bg-blue-800" />
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-blue-700 dark:text-blue-300">
                  <Calendar size={16} className="mr-2" />
                  <span>{bookingDetails.date}</span>
                </div>
                
                <div className="flex items-center text-blue-700 dark:text-blue-300">
                  <MapPin size={16} className="mr-2" />
                  <span>{bookingDetails.location}</span>
                </div>
                
                <div className="flex items-center text-blue-700 dark:text-blue-300">
                  <Users size={16} className="mr-2" />
                  <span>{bookingDetails.guests} {bookingDetails.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>
              
              <Separator className="bg-blue-200 dark:bg-blue-800" />
              
              <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-100">
                <span>Total Amount:</span>
                <span className="text-lg">${bookingDetails.totalPrice}</span>
              </div>
            </div>

            {bookingDetails.bookingId && (
              <div className="text-center text-sm text-muted-foreground">
                Booking ID: <span className="font-mono">{bookingDetails.bookingId}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onViewBooking}
                className="flex-1"
              >
                View Booking
              </Button>
              
              <Button
                onClick={onPayNow}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <CreditCard size={16} className="mr-2" />
                Pay Now
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={handleClose}
              className="w-full mt-2"
            >
              <X size={16} className="mr-2" />
              Close
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationDialog;
