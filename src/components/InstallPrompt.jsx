import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isStandaloneIOS = window.navigator.standalone === true;
    const dismissed = localStorage.getItem('pwa-install-permanently-dismissed') === 'true';
    
    // Additional checks for installed state
    const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' :
                       window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' :
                       window.matchMedia('(display-mode: minimal-ui)').matches ? 'minimal-ui' : 'browser';
    
    // Check if running as installed app
    const isAppInstalled = isInStandaloneMode || isStandaloneIOS || displayMode !== 'browser';
    
    // Check if deferredPrompt was already captured globally
    if (window.deferredPrompt && !isAppInstalled) {
      console.log('✅ Using globally captured deferredPrompt');
      setDeferredPrompt(window.deferredPrompt);
    }
    
    console.log('🔍 InstallPrompt Debug:', {
      isIOSDevice,
      isInStandaloneMode,
      isStandaloneIOS,
      displayMode,
      isAppInstalled,
      isPermanentlyDismissed: dismissed,
      hasDeferredPrompt: !!window.deferredPrompt,
      windowLocation: window.location.href,
      userAgent: navigator.userAgent
    });
    
    setIsIOS(isIOSDevice);
    setIsInstalled(isAppInstalled);
    setIsPermanentlyDismissed(dismissed);

    if (isAppInstalled) {
      console.log('✅ האפליקציה כבר מותקנת');
      return;
    }

    if (dismissed) {
      console.log('🚫 המשתמש ביקש לא להציג יותר');
      return;
    }

    if (!isIOSDevice) {
      console.log('⏰ מציג prompt בעוד 3 שניות...');
      setTimeout(() => {
        setShowPrompt(true);
        console.log('✅ Prompt מוצג (אם יש deferredPrompt)');
      }, 3000);
    }

    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 beforeinstallprompt event fired in component!');
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPrompt = e;
      console.log('📱 PWA התקנה זמינה - deferredPrompt נשמר');
    };

    const handleAppInstalled = () => {
      console.log('🎉 האפליקציה הותקנה בהצלחה!');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      window.deferredPrompt = null;
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
    window.deferredPrompt = null;
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  const handlePermanentDismiss = () => {
    setShowPrompt(false);
    setIsPermanentlyDismissed(true);
    localStorage.setItem('pwa-install-permanently-dismissed', 'true');
    console.log('🚫 התקנה נדחתה לצמיתות');
  };

  if (isInstalled || isPermanentlyDismissed) {
    console.log('❌ Not showing install prompt:', { isInstalled, isPermanentlyDismissed });
    return null;
  }
  
  console.log('✅ Showing install prompt area:', { 
    isInstalled, 
    isPermanentlyDismissed, 
    showPrompt, 
    hasDeferredPrompt: !!deferredPrompt,
    isIOS 
  });

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

  if (showPrompt && !deferredPrompt) {
    console.warn('⚠️ showPrompt=true אבל אין deferredPrompt - הדפדפן עדיין לא אישר התקנה');
  }

  return (
    <>
      {showPrompt && (
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
              
              {deferredPrompt ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    גישה מהירה, עבודה אופליין, וחוויית אפליקציה מלאה
                  </p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleInstallClick}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      התקן עכשיו
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDismiss}
                        className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        מאוחר יותר
                      </button>
                      <button
                        onClick={handlePermanentDismiss}
                        className="flex-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                      >
                        אל תציג שוב
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    כדי להתקין את האפליקציה, בקר באתר שוב בעוד כמה דקות. הדפדפן צריך לאשר שהאתר בטוח להתקנה.
                  </p>
                  <button
                    onClick={handleDismiss}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    הבנתי
                  </button>
                </>
              )}
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

      {/* Permanent install button - shows always even without browser support */}
      {!showPrompt && !deferredPrompt && !isIOS && (
        <button
          onClick={() => setShowPrompt(true)}
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
