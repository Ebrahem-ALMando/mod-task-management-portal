import { IconGradient } from './IconGradient';

interface EnvelopeIconProps {
  className?: string;
  gradientId: string;
}

export function EnvelopeIcon({ className, gradientId }: EnvelopeIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <IconGradient id={gradientId} />
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={`url(#${gradientId})`} />
      <path d="M22 6l-10 7L2 6" stroke={`url(#${gradientId})`} />
    </svg>
  );
}

