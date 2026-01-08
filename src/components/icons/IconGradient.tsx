/**
 * Icon gradient component using CSS variables for theme-aware colors.
 * Colors switch automatically between light and dark modes via --icon-gradient-start and --icon-gradient-end.
 */
export function IconGradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="25%" stopColor="var(--icon-gradient-start)" />
        <stop offset="75%" stopColor="var(--icon-gradient-end)" />
      </linearGradient>
    </defs>
  );
}

