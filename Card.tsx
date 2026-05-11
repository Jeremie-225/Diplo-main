import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { hoverable, padded = true, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-2xl border border-neutral-100 shadow-soft',
        padded && 'p-6',
        hoverable && 'hover-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
