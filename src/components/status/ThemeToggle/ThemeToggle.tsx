'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@/components/icons';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [initialTheme, setInitialTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    // Check theme from DOM before hydration (next-themes applies it via script)
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setInitialTheme(isDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Use initialTheme during SSR/hydration, then switch to resolvedTheme
  const isDark = mounted && resolvedTheme !== undefined
    ? resolvedTheme === 'dark'
    : initialTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="
        theme-toggle-badge
        flex items-center justify-center gap-1.5
        px-3 py-1.5 md:px-3 md:py-1.5
        w-9 h-9 md:w-auto md:h-auto
        rounded-full
        bg-card
        text-foreground
        border-2 border-transparent
        shadow-sm
        hover:shadow-md
        hover:bg-secondary
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
        cursor-pointer
        transition-all duration-200
      "
      type="button"
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      suppressHydrationWarning
    >
      {isDark ? (
        <>
          <SunIcon className="w-4 h-4 shrink-0" />
          {mounted && resolvedTheme !== undefined && (
            <span className="hidden md:inline text-xs font-medium whitespace-nowrap">ليـــلي</span>
          )}
        </>
      ) : (
        <>
          <MoonIcon className="w-4 h-4 shrink-0" />
          {mounted && resolvedTheme !== undefined && (
            <span className="hidden md:inline text-xs font-medium whitespace-nowrap">نهاري</span>
          )}
        </>
      )}
    </button>
  );
}
