'use client';

import * as React from 'react';
import { XIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

const DialogContext = React.createContext<{ isClosing: boolean }>({ isClosing: false });

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [isClosing, setIsClosing] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
   
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
     
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }

  }, [open, shouldRender]);

  if (!shouldRender) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close dialog when clicking on backdrop (not on dialog content)
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <DialogContext.Provider value={{ isClosing }}>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
        }`}
      >
        {/* Backdrop - clickable to close */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${
            isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
          }`}
          onClick={handleBackdropClick}
        />
        
        {/* Dialog content */}
        <div 
          className="relative z-50 w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

function DialogContent({ className, children }: DialogContentProps) {
  const { isClosing } = React.useContext(DialogContext);

  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-2xl shadow-lg border-2 border-transparent',
        'p-6 relative',
        isClosing ? 'animate-out fade-out zoom-out-95' : 'animate-in fade-in zoom-in-95',
        className
      )}
      style={{
        background: 'linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(180deg, var(--icon-gradient-start) 25%, var(--icon-gradient-end) 75%) border-box',
        border: '2px solid transparent',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-right mb-4">
      {children}
    </div>
  );
}

function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h2 className="text-lg font-semibold leading-none tracking-tight">
      {children}
    </h2>
  );
}

function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <p className="text-sm text-muted-foreground mt-2">
      {children}
    </p>
  );
}

function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 mt-6">
      {children}
    </div>
  );
}

function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className=" absolute top-4 right-4 w-8 h-8 rounded-full bg-card border-2 border-transparent shadow-sm hover:shadow-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none transition-all duration-200 flex items-center justify-center"
      style={{
        background: 'linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(180deg, var(--icon-gradient-start) 25%, var(--icon-gradient-end) 75%) border-box',
        border: '2px solid transparent',
        cursor: 'pointer',
      }}
      aria-label="إغلاق"
    >
      <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
      <span className="sr-only">إغلاق</span>
    </button>
  );
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};

