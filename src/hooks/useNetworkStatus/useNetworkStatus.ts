'use client';

import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
  isKnown: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    isOffline: false,
    isKnown: false,
  });

  useEffect(() => {
    // Only runs on client side
    const updateStatus = () => {
      const online = navigator.onLine;
      setStatus({
        isOnline:online,
        isOffline: !online,
        isKnown: true,
      });
    };

    // Set initial status
    updateStatus();

    // Listen for network changes
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return status;
}
