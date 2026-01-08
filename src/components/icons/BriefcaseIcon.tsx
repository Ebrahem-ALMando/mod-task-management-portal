import { IconGradient } from './IconGradient';

interface BriefcaseIconProps {
  className?: string;
  gradientId: string;
}

export function BriefcaseIcon({ className, gradientId }: BriefcaseIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <IconGradient id={gradientId} />
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke={`url(#${gradientId})`} />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke={`url(#${gradientId})`} />
      <line x1="2" y1="12" x2="22" y2="12" stroke={`url(#${gradientId})`} />
    </svg>
  );
}

