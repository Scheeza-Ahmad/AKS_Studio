import React, { useState, useEffect } from 'react'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { MyCollection } from './pages/MyCollection'
import { AnimatePresence } from 'framer-motion'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { Loader2 } from 'lucide-react'

function App() {
  const [currentRoute, setCurrentRoute] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (currentRoute === 'login' || currentRoute === 'signup') {
          setCurrentRoute('dashboard');
        }
      } else {
        if (currentRoute === 'dashboard' || currentRoute === 'collection') {
          setCurrentRoute('login');
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [currentRoute]);

  const navigateTo = (route) => {
    setCurrentRoute(route);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-vintage-cream flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-vintage-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-vintage-cream text-vintage-charcoal font-sans selection:bg-vintage-gold selection:text-white">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-vintage-rose/5 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-vintage-sage/5 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {currentRoute === 'login' && <Login key="login" navigateTo={navigateTo} />}
          {currentRoute === 'signup' && <Signup key="signup" navigateTo={navigateTo} />}
          {currentRoute === 'dashboard' && <Dashboard key="dashboard" navigateTo={navigateTo} />}
          {currentRoute === 'collection' && <MyCollection key="collection" navigateTo={navigateTo} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
