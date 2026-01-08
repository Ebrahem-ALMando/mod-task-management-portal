'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ClockIcon,
  WiFiOfflineIcon,
  CopyIcon,
  ExternalLinkIcon,
} from '@/components/icons';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  onCopy?: () => void;
  onContinue?: () => void;
}

export function LinkDialog({
  open,
  onOpenChange,
  title,
  url,
  onCopy,
  onContinue,
}: LinkDialogProps) {
  const { isOnline } = useNetworkStatus();
  const isPlaceholder = url === '#' || url === '';

  const handleCopy = async () => {
    if (!url || url === '#') return;
    
    try {
      await navigator.clipboard.writeText(url);
      onCopy?.();
      onOpenChange(false);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleContinue = () => {
    if (!url || url === '#') return;
    
    if (onContinue) {
      onContinue();
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        
        <DialogHeader>
          {isPlaceholder ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center 
                
                ">
                  <ClockIcon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <DialogTitle>سيتم توفير الرابط قريباً</DialogTitle>
              <DialogDescription>
                الرابط الخاص بـ <strong>{title}</strong> قيد التطوير وسيتم توفيره قريباً.
              </DialogDescription>
            </>
          ) : !isOnline ? (
            <>
              <div className="flex justify-center mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(var(--status-offline-rgb), 0.1)' }}
                >
                  <div style={{ color: 'var(--status-offline)' }}>
                    <WiFiOfflineIcon className="w-8 h-8" />
                  </div>
                </div>
              </div>
              <DialogTitle>لا يوجد اتصال بالإنترنت</DialogTitle>
              <DialogDescription>
                لا يمكن الوصول إلى الرابط حالياً بسبب عدم توفر اتصال بالإنترنت.
              </DialogDescription>
            </>
          ) : null}
        </DialogHeader>

        {!isPlaceholder && !isOnline && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <CopyIcon className="w-4 h-4" />
              نسخ الرابط
            </Button>
            <Button
              variant="default"
              onClick={handleContinue}
              className="flex items-center gap-2"
            >
              <ExternalLinkIcon className="w-4 h-4" />
              متابعة على أي حال
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

