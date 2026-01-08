import { IconGradient } from './IconGradient';

interface MedalIconProps {
  className?: string;
  gradientId: string;
}

export function MedalIcon({ className, gradientId }: MedalIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <IconGradient id={gradientId} />
      <circle cx="12" cy="15" r="6" stroke={`url(#${gradientId})`} />
      <path d="M8.5 8.5L7 2h2l1.5 3L12 2l1.5 3L15 2h2l-1.5 6.5" stroke={`url(#${gradientId})`} />
      <circle cx="12" cy="15" r="2" stroke={`url(#${gradientId})`} />
    </svg>
  );
}

