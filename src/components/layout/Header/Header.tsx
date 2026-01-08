'use client';

import Logo from '@/components/branding/Logo';
import MinistryTitle from '@/components/branding/MinistryTitle';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`flex flex-col items-center justify-center pt-8 pb-6 md:pt-12 md:pb-8 px-4 ${className}`.trim()}>
      <Logo size="lg" className="mb-4 md:mb-6" />
      <MinistryTitle />
    </header>
  );
}
