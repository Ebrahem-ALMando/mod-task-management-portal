'use client';

import * as React from 'react';
import { CheckIcon, XIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  type?: 'success' | 'error';
}

export function Toast({ open, onOpenChange, message, type = 'success' }: ToastProps) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[100]',
        'bg-card text-card-foreground',
        'rounded-xl shadow-lg border-2 border-transparent',
        'px-4 py-3',
        'flex items-center gap-3',
        'min-w-[220px] max-w-md',
        'animate-in slide-in-from-top-5 fade-in duration-300',
      )}
      style={{
        background: type === 'success'
          ? 'linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(180deg, var(--status-online) 25%, var(--status-online) 75%) border-box'
          : 'linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(180deg, var(--status-offline) 25%, var(--status-offline) 75%) border-box',
        border: '2px solid transparent',
      }}
    >
      {type === 'success' ? (
        <CheckIcon className="h-5 w-5 text-[var(--status-online)] shrink-0" />
      ) : (
        <XIcon className="h-5 w-5 text-[var(--status-offline)] shrink-0" />
      )}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onOpenChange(false)}
        className="opacity-70 hover:opacity-100 transition-opacity"
        aria-label="إغلاق"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

