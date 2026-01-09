'use client';

import OfflineIndicator from '@/components/status/OfflineIndicator';
import ThemeToggle from '@/components/status/ThemeToggle';

/**
 * StatusBar - Design component for status badges layout.
 * 
 * DESIGN RESPONSIBILITY:
 * - Positioning and layout of status badges
 * - Responsive design (desktop vs mobile)
 * - Visual styling and spacing
 * 
 * This component handles all visual/design concerns.
 * 
 * Note: ThemeToggle and OfflineIndicator are hidden in Dashboard pages (via CSS) 
 * because Header contains both ThemeToggle and OfflineIndicator.
 */
export default function StatusBar() {
  return (
    <>
      {/* Desktop: Status badges - positioned via fixed, no layout impact */}
      <div 
        className="hidden md:flex fixed bottom-4 right-4 flex-col items-start gap-2 z-50 status-bar-desktop"
        role="region"
        aria-label="شريط الحالة"
      >
        <div className="status-bar-theme-toggle">
          <ThemeToggle />
        </div>
        <div className="status-bar-offline-indicator">
          <OfflineIndicator />
        </div>
      </div>

      {/* Mobile: Status badges - positioned vertically at bottom corner */}
      <div 
        className="flex md:hidden absolute top-4 left-4 flex-row items-end gap-2 z-50 status-bar-mobile"
        role="region"
        aria-label="شريط الحالة"
      >
        <div className="status-bar-theme-toggle">
          <ThemeToggle />
        </div>
        <div className="status-bar-offline-indicator">
          <OfflineIndicator />
        </div>
      </div>
    </>
  );
}

