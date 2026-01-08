import { IconGradient } from './IconGradient';

interface ShieldIconProps {
  className?: string;
  gradientId: string;
}

export function ShieldIcon({ className, gradientId }: ShieldIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <IconGradient id={gradientId} />
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={`url(#${gradientId})`} />
    </svg>
  );
}

