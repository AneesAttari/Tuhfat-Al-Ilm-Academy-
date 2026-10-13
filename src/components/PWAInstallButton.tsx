import React, { useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';
import { Download, Smartphone, X, Share, PlusSquare, Monitor, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'mobile-header' | 'drawer' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install, deferredPrompt } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone PWA mode, don't show prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
      } else {
        setShowGuide(true);
      }
    } else {
      // If browser hasn't fired beforeinstallprompt yet or iOS Safari, show the manual guided install helper
      setShowGuide(true);
    }
  };

  // Mobile Header icon button (shows directly in mobile top bar)
  if (variant === 'mobile-header') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 min-h-[44px] min-w-[44px] text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] active:bg-[#A7F3D0] border border-[#A7F3D0] rounded-xl transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] ${className}`}
          title="Download Tuhfat Al-Ilm Academy to Home Screen"
          aria-label="Download Tuhfat Al-Ilm Academy app to home screen"
        >
          <Download className="w-4 h-4 text-[#059669] shrink-0" />
          <span className="font-bold text-[11px]">Install</span>
        </button>

        {showGuide && (
          <InstallGuideModal
            isIOS={isIOS}
            isAndroid={isAndroid}
            onClose={() => setShowGuide(false)}
          />
        )}
      </>
    );
  }

  // Header compact button for desktop navigation
  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] ${className}`}
          title="Install Tuhfat Al-Ilm Academy as an app"
          aria-label="Install Tuhfat Al-Ilm Academy as an app on your home screen"
        >
          <Download className="w-3.5 h-3.5 text-[#059669]" />
          <span>Install App</span>
        </button>

        {showGuide && (
          <InstallGuideModal
            isIOS={isIOS}
            isAndroid={isAndroid}
            onClose={() => setShowGuide(false)}
          />
        )}
      </>
    );
  }

  // Mobile Drawer navigation item
  if (variant === 'drawer') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] ${className}`}
        >
          <span className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-[#059669]" />
            <span>Install Web App</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#064E3B] text-white">
            App
          </span>
        </button>

        {showGuide && (
          <InstallGuideModal
            isIOS={isIOS}
            isAndroid={isAndroid}
            onClose={() => setShowGuide(false)}
          />
        )}
      </>
    );
  }

  // Floating banner
  return (
    <>
      <div className={`p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#064E3B] truncate">Install on Your Phone</p>
            <p className="text-[11px] text-[#047857] truncate">Fast home screen access &amp; offline support</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-[#064E3B] hover:bg-[#043D2E] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          Install
        </button>
      </div>

      {showGuide && (
        <InstallGuideModal
          isIOS={isIOS}
          isAndroid={isAndroid}
          onClose={() => setShowGuide(false)}
        />
      )}
    </>
  );
};

// Guide modal with tabs for Android (Chrome), iOS (Safari), and Desktop
interface InstallGuideModalProps {
  isIOS: boolean;
  isAndroid: boolean;
  onClose: () => void;
}

const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isIOS, isAndroid, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chrome' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : isAndroid ? 'chrome' : 'chrome'
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E2D9] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
          <div className="flex items-center gap-2 text-[#064E3B] font-bold text-sm">
            <Smartphone className="w-5 h-5 text-[#059669]" />
            <span>Install Tuhfat-Al-Ilm App</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close install instructions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device selector tabs */}
        <div className="flex items-center p-1 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('chrome')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'chrome'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Android Chrome
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'ios'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            iPhone (Safari)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'desktop'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Computer
          </button>
        </div>

        {activeTab === 'ios' && (
          // iOS Safari instructions
          <div className="space-y-3 text-xs text-[#374151]">
            <p className="font-semibold text-sm text-[#0F172A]">
              Add to iPhone Home Screen:
            </p>
            <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
              <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <p>
                Tap the <strong className="text-[#064E3B]">Share</strong> icon at the bottom of Safari (<Share className="w-3.5 h-3.5 inline text-[#064E3B]" />).
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
              <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </span>
              <p>
                Scroll down and tap <strong className="text-[#064E3B]">Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-[#064E3B]" />).
              </p>
            </div>
          </div>
        )}

        {activeTab === 'chrome' && (
          // Chrome Android instructions
          <div className="space-y-3 text-xs text-[#374151]">
            <p className="font-semibold text-sm text-[#0F172A]">
              Install on Google Chrome:
            </p>
            <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
              <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <p>
                Tap the <strong className="text-[#064E3B]">Three Dots (⋮)</strong> menu in the top-right corner of Chrome.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
              <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </span>
              <p>
                Select <strong className="text-[#064E3B]">Install app</strong> or <strong className="text-[#064E3B]">Add to Home screen</strong>.
              </p>
            </div>
            <div className="p-2.5 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-[11px] text-[#047857]">
              ✓ An app icon will appear directly on your home screen for instant full-screen access.
            </div>
          </div>
        )}

        {activeTab === 'desktop' && (
          // Desktop Chrome/Edge
          <div className="space-y-3 text-xs text-[#374151]">
            <p className="font-semibold text-sm text-[#0F172A]">
              Install on Chrome or Edge (PC/Mac):
            </p>
            <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
              <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <p>
                Look for the <strong className="text-[#064E3B]">Install Icon (⊕ or ⬇)</strong> on the right side of Chrome’s address bar.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E2D9]">
              <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </span>
              <p>
                Click it and choose <strong className="text-[#064E3B]">Install</strong>.
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-[#064E3B] hover:bg-[#043D2E] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Global Floating PWA Install Prompt Banner for Mobile / Non-standalone Web App Visitors
export const PWAInstallPromptBanner: React.FC = () => {
  const { isInstalled, install, deferredPrompt, isIOS, isAndroid } = usePWAInstall();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('pwa_banner_dismissed') === 'true';
    }
    return false;
  });
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled || dismissed) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      const ok = await install();
      if (!ok) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa_banner_dismissed', 'true');
    }
  };

  return (
    <>
      <aside
        aria-label="Install App"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#A7F3D0] shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone className="w-5 h-5 text-[#34D399]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
              Install Tuhfat-Al-Ilm App
            </p>
            <p className="text-[11px] text-[#475569] truncate">
              Download to home screen for 1-tap learning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstall}
            className="px-3.5 py-2 min-h-[40px] bg-[#064E3B] hover:bg-[#043D2E] active:bg-[#022C22] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss app installation prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {showGuide && (
        <InstallGuideModal
          isIOS={isIOS}
          isAndroid={isAndroid}
          onClose={() => setShowGuide(false)}
        />
      )}
    </>
  );
};
