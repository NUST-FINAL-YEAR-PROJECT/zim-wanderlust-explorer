
import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import App from './App.tsx'
import './index.css'
import SplashScreen from './components/SplashScreen.tsx'
import { Toaster } from '@/components/ui/toaster'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const Root = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Error handling
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Application error:', event.error);
      setError('An unexpected error occurred. Please refresh the page and try again.');
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <App />
        </motion.div>
      </AnimatePresence>
      
      <Toaster />
      
      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Application Error</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
