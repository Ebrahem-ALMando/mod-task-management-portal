'use client';

import LinkCard from '@/components/cards/LinkCard';
import { MINISTRY_LINKS } from '@/config/links.config';

interface LinksGridProps {
  className?: string;
}

export default function LinksGrid({ className = '' }: LinksGridProps) {
  return (
    <section className={`w-full ${className}`.trim()}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
        {MINISTRY_LINKS.map((link) => (
          <LinkCard
            key={link.id}
            id={link.id}
            title={link.title}
            url={link.url}
            icon={link.icon}
          />
        ))}
      </div>
    </section>
  );
}
