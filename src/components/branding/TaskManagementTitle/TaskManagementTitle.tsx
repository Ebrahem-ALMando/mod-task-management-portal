'use client';

interface TaskManagementTitleProps {
  className?: string;
}

/**
 * Task Management Title component.
 * Uses CSS variables for theme-aware fill colors:
 * - --color-brand-primary-alpha: The text color
 * - Same styling as MinistryTitle
 */
export default function TaskManagementTitle({ className = '' }: TaskManagementTitleProps) {
  return (
    <div className={`flex items-center justify-center ${className}`.trim()}>
      <h2 
        className="task-management-title text-base md:text-lg text-center leading-tight"
        aria-label="إدارة المهام"
        role="heading"
        aria-level={2}
      >
      إدارة المهام 
      </h2>
    </div>
  );
}
