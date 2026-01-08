import { IconGradient } from './IconGradient';

interface UserIconProps {
  className?: string;
  gradientId: string;
}

export function UserIcon({ className, gradientId }: UserIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <IconGradient id={gradientId} />
      <circle cx="12" cy="8" r="4" stroke={`url(#${gradientId})`} />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={`url(#${gradientId})`} />
    </svg>
  );
}

