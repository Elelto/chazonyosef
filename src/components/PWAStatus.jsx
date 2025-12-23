import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, Download } from 'lucide-react';

const PWAStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [installDismissed, setInstallDismissed] = useState(false);

  // Debug wrapper for setUpdateAvailable
  const setUpdateAvailableWithLog = (value) => {
    console.log('🔔 setUpdateAvailable called:', value, 'Stack:', new Error().stack);
    setUpdateAvailable(value);
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Check if install prompt was dismissed
    const dismissed = localStorage.getItem('pwa-install-permanently-dismissed') === 'true';
    setInstallDismissed(dismissed);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg);

        console.log('ℹ️ Service Worker ready', {
          hasWaiting: !!reg.waiting,
          hasController: !!navigator.serviceWorker.controller
        });

        // Disable automatic update detection - it's too sensitive
        // Every code deployment triggers it, even without real changes
        // Users can manually refresh when they want the latest version
        
        // reg.addEventListener('updatefound', () => {
        //   // Disabled to prevent false positive update notifications
        // });
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = () => {
    console.log('🔄 Update button clicked', { 
      hasRegistration: !!registration, 
      hasWaiting: !!(registration?.waiting) 
    });
    
    if (registration && registration.waiting) {
      console.log('📤 Sending SKIP_WAITING message to service worker');
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Also try to update directly
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Set a timeout to reload if SW doesn't respond
      setTimeout(() => {
        console.log('⏰ Force reloading after timeout');
        window.location.reload();
      }, 1000);
    } else {
      console.error('❌ No registration or waiting worker found');
      // Try to reload anyway
      window.location.reload();
    }
  };

  const handleRestoreInstallPrompt = () => {
    localStorage.removeItem('pwa-install-permanently-dismissed');
    setInstallDismissed(false);
    window.location.reload();
  };

  console.log('🔍 PWAStatus render:', { 
    updateAvailable, 
    hasRegistration: !!registration,
    hasWaiting: !!(registration?.waiting),
    hasController: !!navigator.serviceWorker?.controller
  });

  if (updateAvailable) {
    console.log('🔔 Showing update notification');
    return (
      <div className="fixed top-20 left-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-lg z-[9999] md:left-auto md:right-4 md:max-w-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5" />
            <div className="text-right">
              <p className="font-semibold">עדכון זמין!</p>
              <p className="text-sm text-blue-100">גרסה חדשה של האפליקציה מוכנה</p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            עדכן עכשיו
          </button>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-3 rounded-xl shadow-lg z-50 md:left-auto md:right-4 md:max-w-md">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <WifiOff className="w-5 h-5" />
          <p className="font-semibold">אתה במצב אופליין</p>
        </div>
      </div>
    );
  }

  // Show restore install prompt button if dismissed and not in standalone mode
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
  if (installDismissed && !isInstalled) {
    return (
      <button
        onClick={handleRestoreInstallPrompt}
        className="fixed bottom-20 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-30 md:left-auto md:right-4"
        title="הצג שוב אפשרות התקנה"
      >
        <Download className="w-5 h-5" />
      </button>
    );
  }

  return null;
};

export default PWAStatus;
