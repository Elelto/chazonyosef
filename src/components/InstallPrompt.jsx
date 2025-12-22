import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(isIOSDevice);
    setIsInstalled(isInStandaloneMode);

    if (isInStandaloneMode) {
      console.log('✅ האפליקציה כבר מותקנת');
      return;
    }

    if (!isIOSDevice) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('📱 PWA התקנה זמינה');
    };

    const handleAppInstalled = () => {
      console.log('🎉 האפליקציה הותקנה בהצלחה!');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ המשתמש קיבל את ההתקנה');
    } else {
      console.log('❌ המשתמש דחה את ההתקנה');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (isInstalled) {
    return null;
  }

  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              התקנת האפליקציה
            </h3>
            <p className="text-gray-600">
              להתקנה על iPhone/iPad
            </p>
          </div>

          <div className="space-y-4 text-right">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-gray-700">
                  לחץ על כפתור <span className="font-bold">"שתף"</span> בתחתית המסך
                  <span className="inline-block mx-1 text-2xl">⬆️</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-gray-700">
                  גלול למטה ובחר <span className="font-bold">"הוסף למסך הבית"</span>
                  <span className="inline-block mx-1 text-2xl">➕</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-gray-700">
                  לחץ על <span className="font-bold">"הוסף"</span> בפינה הימנית העליונה
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            הבנתי
          </button>
        </div>
      </div>
    );
  }

  if (isIOS && !isInstalled) {
    return (
      <button
        onClick={() => setShowIOSInstructions(true)}
        className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 font-semibold hover:shadow-xl transition-all z-40 md:left-auto md:right-4 md:w-auto"
      >
        <Download className="w-5 h-5" />
        התקן אפליקציה
      </button>
    );
  }

  if (!showPrompt && !deferredPrompt) {
    return null;
  }

  return (
    <>
      {showPrompt && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 z-40 border border-gray-200 md:left-auto md:right-4 md:max-w-md">
          <button
            onClick={handleDismiss}
            className="absolute top-2 left-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 text-right">
              <h3 className="font-bold text-gray-900 mb-1">
                התקן את חזון יוסף
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                גישה מהירה, עבודה אופליין, וחוויית אפליקציה מלאה
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  התקן
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  אולי מאוחר יותר
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deferredPrompt && !showPrompt && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-40 md:left-auto md:right-4"
          title="התקן אפליקציה"
        >
          <Download className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default InstallPrompt;
