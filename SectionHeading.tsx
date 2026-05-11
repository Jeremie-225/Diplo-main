import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/** Standard section heading: small eyebrow label + big title + optional description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: Props) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={cn('max-w-2xl', alignClass, className)}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-widest font-semibold text-primary-light mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-neutral-700 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
