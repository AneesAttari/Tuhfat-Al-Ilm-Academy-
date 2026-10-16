/**
 * PWA Service Worker Registration & Live Update Engine
 * 
 * Guarantees that updates made in production immediately reach installed PWAs
 * without requiring the user to uninstall and reinstall the application.
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  let refreshing = false;

  // When a new service worker takes control, seamlessly reload the page to apply new assets
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  // Listen for activation messages from the service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && (event.data.type === 'SW_ACTIVATED' || event.data.type === 'SW_UPDATED')) {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    }
  });

  const register = () => {
    // updateViaCache: 'none' tells the browser to ALWAYS bypass HTTP cache when querying sw.js
    navigator.serviceWorker
      .register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      })
      .then((reg) => {
        // 1. If a new service worker is already waiting, tell it to skip waiting immediately
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // 2. Check for updates on every install state transition
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update is installed in background; activate it immediately
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              }
            };
          }
        };

        // 3. Force check for updates on startup
        reg.update().catch(() => {});

        // 4. In installed PWAs (standalone), the user returns by opening/switching apps.
        // Check for updates whenever the PWA becomes visible or focused:
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            reg.update().catch(() => {});
          }
        });

        window.addEventListener('focus', () => {
          reg.update().catch(() => {});
        });

        // 5. Periodic background update check every 10 minutes
        setInterval(() => {
          reg.update().catch(() => {});
        }, 10 * 60 * 1000);
      })
      .catch((err) => {
        console.info('[PWA Service Worker] Registration note:', err?.message || err);
      });
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    register();
  } else {
    window.addEventListener('load', register);
  }
}
