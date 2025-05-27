
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Receipt, X } from 'lucide-react';
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

interface BookingSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    type: 'accommodation' | 'event';
    name: string;
    bookingId: string;
    totalAmount: number;
    currency?: string;
  };
  onProceedToPayment: () => void;
  onViewBooking?: () => void;
}

const BookingSuccessDialog = ({
  isOpen,
  onClose,
  bookingDetails,
  onProceedToPayment,
  onViewBooking
}: BookingSuccessDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleProceedToPayment = () => {
    setIsClosing(true);
    setTimeout(() => {
      onProceedToPayment();
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
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <DialogTitle className="text-2xl font-bold text-green-700 dark:text-green-300">
              Booking Created Successfully!
            </DialogTitle>
            
            <DialogDescription className="text-base">
              Your booking has been created and is ready for payment.
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg space-y-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  {bookingDetails.name}
                </h3>
                <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                  {bookingDetails.type === 'event' ? 'Event' : 'Accommodation'}
                </Badge>
              </div>
              
              <Separator className="bg-green-200 dark:bg-green-800" />
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-green-700 dark:text-green-300">
                    <Receipt size={16} className="mr-2" />
                    Booking ID:
                  </span>
                  <span className="font-mono text-xs bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                    {bookingDetails.bookingId.slice(0, 8)}...
                  </span>
                </div>
              </div>
              
              <Separator className="bg-green-200 dark:bg-green-800" />
              
              <div className="flex items-center justify-between font-semibold text-green-900 dark:text-green-100">
                <span>Total Amount:</span>
                <span className="text-lg">
                  {bookingDetails.currency || '$'}{bookingDetails.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                <strong>Next Step:</strong> Complete your payment to confirm your booking
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={handleProceedToPayment}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3"
                size="lg"
              >
                <CreditCard size={18} className="mr-2" />
                Proceed to Payment
              </Button>
              
              <div className="flex gap-2">
                {onViewBooking && (
                  <Button
                    variant="outline"
                    onClick={onViewBooking}
                    className="flex-1"
                  >
                    <Receipt size={16} className="mr-2" />
                    View Booking
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1"
                >
                  <X size={16} className="mr-2" />
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSuccessDialog;
