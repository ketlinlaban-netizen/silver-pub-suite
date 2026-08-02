import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isIos = () => {
      return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream
      );
    };

    const isAndroid = () => {
      return /Android/.test(navigator.userAgent);
    };

    const isInStandaloneMode = () => {
      return (window.navigator as any).standalone === true;
    };

    if (isInStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(beforeInstallPromptEvent);
      setShowBanner(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setShowBanner(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check for iOS
    if (isIos() && !isInStandaloneMode()) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary to-primary/80 shadow-lg"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Download className="size-5 shrink-0 text-white" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Install Silver Pub POS</p>
                <p className="text-xs text-white/90 truncate">
                  Install on your device for quick access and offline functionality
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-white text-primary hover:bg-white/90 rounded-lg"
              >
                Install
              </Button>
              <button
                onClick={handleDismiss}
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Dismiss"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
