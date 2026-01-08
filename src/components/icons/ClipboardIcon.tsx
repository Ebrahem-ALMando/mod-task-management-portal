import { IconGradient } from './IconGradient';

interface ClipboardIconProps {
  className?: string;
  gradientId: string;
}

export function ClipboardIcon({ className, gradientId }: ClipboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <IconGradient id={gradientId} />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={`url(#${gradientId})`} />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke={`url(#${gradientId})`} />
      <line x1="8" y1="10" x2="16" y2="10" stroke={`url(#${gradientId})`} />
      <line x1="8" y1="14" x2="16" y2="14" stroke={`url(#${gradientId})`} />
      <line x1="8" y1="18" x2="12" y2="18" stroke={`url(#${gradientId})`} />
    </svg>
  );
}

