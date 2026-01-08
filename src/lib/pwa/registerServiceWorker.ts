export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Service Worker registered:', registration);
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Service Worker registration failed:', error);
          }
        });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Service Worker registration error:', error);
      }
    }
  });
}

