'use client';

import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LOGO_SIZES = {
  sm: { width: 80, height: 80 },
  md: { width: 120, height: 120 },
  lg: { width: 200, height: 200 },
} as const;

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const dimensions = LOGO_SIZES[size];

  return (
    <div className={`logo-container flex items-center justify-center ${className}`}>
      <Image
        src="/asset/img/logo.svg"
        alt="وزارة الدفاع السورية"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="w-auto h-auto max-w-[100px] md:max-w-[140px] lg:max-w-[200px]"
      />
    </div>
  );
}
