'use client';

import { useState } from 'react';
import type { LinkCardProps } from './LinkCard.types';
import type { IconType } from '@/types/link';
import {
  ShieldIcon,
  UserIcon,
  DocumentIcon,
  BuildingIcon,
  BriefcaseIcon,
  MedalIcon,
  CalendarIcon,
  ClipboardIcon,
  EnvelopeIcon,
  PhoneIcon,
  BellIcon,
  SettingsIcon,
} from '@/components/icons';
import { LinkDialog } from '@/components/dialogs/LinkDialog';
import { Toast } from '@/components/ui/toast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface IconProps {
  className?: string;
  gradientId: string;
}

const IconComponents: Record<IconType, React.FC<IconProps>> = {
  shield: ({ className, gradientId }) => (
    <ShieldIcon className={className} gradientId={gradientId} />
  ),
  user: ({ className, gradientId }) => (
    <UserIcon className={className} gradientId={gradientId} />
  ),
  document: ({ className, gradientId }) => (
    <DocumentIcon className={className} gradientId={gradientId} />
  ),
  building: ({ className, gradientId }) => (
    <BuildingIcon className={className} gradientId={gradientId} />
  ),
  briefcase: ({ className, gradientId }) => (
    <BriefcaseIcon className={className} gradientId={gradientId} />
  ),
  medal: ({ className, gradientId }) => (
    <MedalIcon className={className} gradientId={gradientId} />
  ),
  calendar: ({ className, gradientId }) => (
    <CalendarIcon className={className} gradientId={gradientId} />
  ),
  clipboard: ({ className, gradientId }) => (
    <ClipboardIcon className={className} gradientId={gradientId} />
  ),
  envelope: ({ className, gradientId }) => (
    <EnvelopeIcon className={className} gradientId={gradientId} />
  ),
  phone: ({ className, gradientId }) => (
    <PhoneIcon className={className} gradientId={gradientId} />
  ),
  bell: ({ className, gradientId }) => (
    <BellIcon className={className} gradientId={gradientId} />
  ),
  settings: ({ className, gradientId }) => (
    <SettingsIcon className={className} gradientId={gradientId} />
  ),
};

export default function LinkCard({ id, title, url, icon }: LinkCardProps) {
  const IconComponent = IconComponents[icon];
  const gradientId = `icon-gradient-${id}`;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const { isOnline } = useNetworkStatus();
  const isPlaceholder = url === '#' || url === '';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Show dialog if placeholder or offline
    if (isPlaceholder || !isOnline) {
      e.preventDefault();
      setDialogOpen(true);
    }
  };

  const handleCopy = () => {
    setToastOpen(true);
  };

  const handleContinue = () => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <a
        href={url}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="link-card flex flex-col items-center justify-center bg-card rounded-2xl px-4 py-6 md:px-6 md:py-8 shadow-sm min-h-[120px] md:min-h-[140px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none"
        data-link-id={id}
      >
        <div className="mb-3 md:mb-4">
          <IconComponent className="w-8 h-8 md:w-10 md:h-10" gradientId={gradientId} />
        </div>
        <span className="link-card-title text-sm md:text-base text-center leading-relaxed">
          {title}
        </span>
      </a>

      <LinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        url={url}
        onCopy={handleCopy}
        onContinue={handleContinue}
      />

      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        message="تم نسخ الرابط بنجاح"
        type="success"
      />
    </>
  );
}
