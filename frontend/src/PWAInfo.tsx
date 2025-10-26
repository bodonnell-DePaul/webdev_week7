import { useEffect, useState } from 'react';
import './PWAInfo.css';

export default function PWAInfo() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWA(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isPWA) {
    return (
      <div className="pwa-badge pwa-running">
        ✓ Running as PWA
      </div>
    );
  }

  if (isInstallable) {
    return (
      <div className="pwa-install-prompt">
        <div className="pwa-install-content">
          <span>📱 Install this app for a better experience</span>
          <button onClick={handleInstallClick} className="pwa-install-button">
            Install
          </button>
        </div>
      </div>
    );
  }

  return null;
}
