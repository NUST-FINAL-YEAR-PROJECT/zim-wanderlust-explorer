
import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import App from './App.tsx'
import './index.css'
import SplashScreen from './components/SplashScreen.tsx'
import { Toaster } from '@/components/ui/toaster'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

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
        {!showSplash && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="min-h-screen bg-white"
          >
            <App />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Toaster />
      
      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-indigo-800">
              <div className="bg-indigo-100 p-2 rounded-full mr-2">
                <RefreshCw className="h-5 w-5 text-indigo-600" />
              </div>
              Application Error
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
              Refresh Page
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
