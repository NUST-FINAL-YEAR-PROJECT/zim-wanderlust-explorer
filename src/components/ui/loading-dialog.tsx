
import React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface LoadingDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  progress?: number;
  steps?: string[];
  currentStep?: number;
}

const LoadingDialog = ({
  isOpen,
  title,
  description,
  progress = 0,
  steps,
  currentStep = 0
}: LoadingDialogProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center"
          >
            <Loader2 className="w-6 h-6 text-white" />
          </motion.div>
          
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-base">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Steps */}
          {steps && (
            <div className="space-y-2">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.5 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.5,
                    x: index === currentStep ? [0, 5, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className={`text-sm flex items-center space-x-2 ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    index < currentStep ? 'bg-green-500' : 
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <span>{step}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
