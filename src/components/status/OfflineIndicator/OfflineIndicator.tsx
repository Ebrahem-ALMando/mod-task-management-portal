'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useEffect, useState } from 'react';
import {
  WiFiOfflineIcon,
  WiFiIcon,
  WiFiReconnectingIcon,
  ConnectionStableIcon,
} from '@/components/icons';

export default function OfflineIndicator() {
  const { isOnline, isKnown } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [showStable, setShowStable] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Default to online if status not yet known
  const online = isKnown ? isOnline : true;

  // Track when connection is restored
  useEffect(() => {
    if (!isKnown) return;

    if (!isOnline) {
      // Currently offline
      setWasOffline(true);
      setShowReconnected(false);
      setShowStable(false);
    } else if (wasOffline && isOnline) {
      // Connection just restored - show WiFi animation first
      setShowReconnected(true);
      setShowStable(false);
      
      // After 1.5 seconds, show stable icon
      const stableTimer = setTimeout(() => {
        setShowReconnected(false);
        setShowStable(true);
      }, 1500);
      
      // After 5 more seconds (total 6.5s), hide badge
      const hideTimer = setTimeout(() => {
        setShowStable(false);
        setWasOffline(false);
      }, 6500);
      
      return () => {
        clearTimeout(stableTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isOnline, isKnown, wasOffline]);

  // Don't show badge when online and stable (not in reconnected state and never was offline)
  if (online && !showReconnected && !showStable && !wasOffline) {
  return null;
}

  // Determine icon and status
  const getIcon = () => {
    if (showStable) {
      return <ConnectionStableIcon className="w-4 h-4 shrink-0" />;
    }
    if (showReconnected) {
      return <WiFiReconnectingIcon className="w-4 h-4 shrink-0" />;
    }
    if (!online) {
      return <WiFiOfflineIcon className="w-4 h-4 shrink-0" />;
    }
    return <WiFiIcon className="w-4 h-4 shrink-0" />;
  };

  const getStatusText = () => {
    if (showStable) {
      return 'متصل';
    }
    if (showReconnected) {
      return 'جاري الاتصال...';
    }
    if (!online) {
      return 'غير متصل';
    }
    return 'متصل';
  };

  return (
    <div
      className={`
        status-badge
        flex items-center gap-2
        px-2 py-2
        rounded-full
        text-xs
        font-medium
        border-2 border-transparent
        shadow-sm
        transition-all duration-300
        ${online 
          ? 'bg-card text-foreground' 
          : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        }
      `}
      data-status={online ? 'online' : 'offline'}
      role="status"
      aria-live="polite"
    >
      {getIcon()}
      <span className="hidden md:inline whitespace-nowrap">{getStatusText()}</span>
    </div>
  );
}
