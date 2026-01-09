'use client';

import { useState, useEffect } from 'react';
import { isOnline, onOnline, onOffline } from '@/lib/network';

interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
  isKnown: boolean;
}

/**
 * React hook for network status
 * 
 * This is a React wrapper around lib/network/networkStatus.
 * It provides state management and effect handling.
 * 
 * All network detection logic is delegated to lib/network/networkStatus.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    isOffline: false,
    isKnown: false,
  });

  useEffect(() => {
    // Update status function using network layer
    const updateStatus = () => {
      const online = isOnline();
      setStatus({
        isOnline: online,
        isOffline: !online,
        isKnown: true,
      });
    };

    // Set initial status
    updateStatus();

    // Subscribe to network changes using network layer
    const unsubscribeOnline = onOnline(updateStatus);
    const unsubscribeOffline = onOffline(updateStatus);

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
    };
  }, []);

  return status;
}
