
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
            transition={{ duration: 0.7, delay: 0.3 }}
            className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-indigo-900"
          >
            <App />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Toaster />
      
      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent className="border-0 shadow-xl rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-indigo-800 dark:text-indigo-200">
              <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full mr-2">
                <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              Application Error
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white dark:from-indigo-700 dark:to-indigo-900 dark:hover:from-indigo-600 dark:hover:to-indigo-800"
            >
              Refresh Page
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
