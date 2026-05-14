'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/app/app-layout';
import AuthScreen from '@/components/auth/auth-screen';
import SplashScreen from '@/components/common/splash-screen';
import type { AppView } from '@/types/app';

const App = () => {
  const [appState, setAppState] = useState<'splash' | 'auth' | 'app'>('splash');
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = 'var(--background)';
    const timer = setTimeout(() => setAppState('auth'), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-background min-h-screen min-w-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {appState === 'splash' && (
          <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <SplashScreen />
          </motion.div>
        )}
        {appState === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <AuthScreen
              onAuth={() => {
                setAppState('app');
                setCurrentView('dashboard');
              }}
            />
          </motion.div>
        )}
        {appState === 'app' && (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <AppLayout
              currentView={currentView}
              onNavigate={setCurrentView}
              onLogout={() => {
                setAppState('auth');
                setCurrentView('dashboard');
              }}
              showTransactionModal={showTransactionModal}
              onToggleTransactionModal={setShowTransactionModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
