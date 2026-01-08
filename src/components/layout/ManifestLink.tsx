'use client';

import { useEffect } from 'react';

export default function ManifestLink() {
  useEffect(() => {
    // Manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.webmanifest';
    document.head.appendChild(manifestLink);

    // Favicon - try favicon.ico first, fallback to logo_with_bg.png
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.href = '/favicon.ico';
    document.head.appendChild(faviconLink);
    
    // Additional favicon with PNG for better browser support
    const faviconPNG = document.createElement('link');
    faviconPNG.rel = 'icon';
    faviconPNG.type = 'image/png';
    faviconPNG.href = '/asset/img/logo_with_bg.png';
    faviconPNG.sizes = '32x32';
    document.head.appendChild(faviconPNG);

    // Apple Touch Icon (for iOS)
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/asset/img/logo_with_bg.png';
    appleTouchIcon.sizes = '180x180';
    document.head.appendChild(appleTouchIcon);

    // Theme color meta tag
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#054239';
    document.head.appendChild(themeColor);

    // Mobile web app capable
    const mobileWebApp = document.createElement('meta');
    mobileWebApp.name = 'mobile-web-app-capable';
    mobileWebApp.content = 'yes';
    document.head.appendChild(mobileWebApp);

    return () => {
      const existingManifest = document.querySelector('link[rel="manifest"]');
      if (existingManifest) {
        document.head.removeChild(existingManifest);
      }
      // Remove all favicon links
      const existingFavicons = document.querySelectorAll('link[rel="icon"]');
      existingFavicons.forEach((favicon) => {
        document.head.removeChild(favicon);
      });
      const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (existingAppleIcon) {
        document.head.removeChild(existingAppleIcon);
      }
      const existingThemeColor = document.querySelector('meta[name="theme-color"]');
      if (existingThemeColor) {
        document.head.removeChild(existingThemeColor);
      }
      const existingMobileWebApp = document.querySelector('meta[name="mobile-web-app-capable"]');
      if (existingMobileWebApp) {
        document.head.removeChild(existingMobileWebApp);
      }
    };
  }, []);

  return null;
}


