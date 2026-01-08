'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa/registerServiceWorker';

/**
 * AppShell - Technical wrapper component.
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * - Registering the Service Worker
 * 
 * DOES NOT:
 * - Render any UI elements
 * - Impose visual layout
 * - Affect spacing or alignment of page content
 * - Add backgrounds, padding, or design containers
 * - Contain any CSS classes or styling
 * - Import or use any design components
 * 
 * This component is purely technical and has zero visual impact.
 * All design concerns are handled in layout.tsx or dedicated design components.
 */
export default function AppShell() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
