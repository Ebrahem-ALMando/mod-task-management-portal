import { IconGradient } from './IconGradient';

interface BuildingIconProps {
  className?: string;
  gradientId: string;
}

export function BuildingIcon({ className, gradientId }: BuildingIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <IconGradient id={gradientId} />
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" stroke={`url(#${gradientId})`} />
      <line x1="9" y1="6" x2="9" y2="6.01" stroke={`url(#${gradientId})`} />
      <line x1="15" y1="6" x2="15" y2="6.01" stroke={`url(#${gradientId})`} />
      <line x1="9" y1="10" x2="9" y2="10.01" stroke={`url(#${gradientId})`} />
      <line x1="15" y1="10" x2="15" y2="10.01" stroke={`url(#${gradientId})`} />
      <line x1="9" y1="14" x2="9" y2="14.01" stroke={`url(#${gradientId})`} />
      <line x1="15" y1="14" x2="15" y2="14.01" stroke={`url(#${gradientId})`} />
      <path d="M9 18h6v4H9z" stroke={`url(#${gradientId})`} />
    </svg>
  );
}

