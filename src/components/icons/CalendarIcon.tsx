import { IconGradient } from './IconGradient';

interface CalendarIconProps {
  className?: string;
  gradientId: string;
}

export function CalendarIcon({ className, gradientId }: CalendarIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <IconGradient id={gradientId} />
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={`url(#${gradientId})`} />
      <line x1="16" y1="2" x2="16" y2="6" stroke={`url(#${gradientId})`} />
      <line x1="8" y1="2" x2="8" y2="6" stroke={`url(#${gradientId})`} />
      <line x1="3" y1="10" x2="21" y2="10" stroke={`url(#${gradientId})`} />
      <rect x="7" y="14" width="3" height="3" stroke={`url(#${gradientId})`} />
    </svg>
  );
}

