
import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import App from './App.tsx'
import './index.css'
import SplashScreen from './components/SplashScreen.tsx'

const Root = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <App />
    </>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
