import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';

const PWAStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
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
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  if (updateAvailable) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg z-50 md:left-auto md:right-4 md:max-w-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5" />
            <div className="text-right">
              <p className="font-semibold">עדכון זמין!</p>
              <p className="text-sm text-green-100">גרסה חדשה של האפליקציה מוכנה</p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors whitespace-nowrap"
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

  return null;
};

export default PWAStatus;
