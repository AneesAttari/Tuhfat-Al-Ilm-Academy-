export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          // Immediately check for updates
          reg.update().catch(() => {});

          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Tell worker to skip waiting and take over
                    installingWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                }
              };
            }
          };
        })
        .catch(() => {});
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      register();
    } else {
      window.addEventListener('load', register);
    }
  }
}
