import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 shadow-soft hover:shadow-lift',
  secondary:
    'bg-white text-primary hover:bg-neutral-50 border border-neutral-100 shadow-soft hover:shadow-lift hover:-translate-y-0.5',
  outline:
    'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-primary',
  accent:
    'bg-accent text-primary hover:bg-accent-warm shadow-soft hover:shadow-lift hover:-translate-y-0.5',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-7 py-3.5',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorButtonProps = CommonProps & {
  as: 'a';
  href: string;
  target?: string;
  rel?: string;
};
type LinkButtonProps = CommonProps & Omit<LinkProps, 'children' | 'className'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {isLoading ? (
        <span
          className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
});

export function LinkButton(props: LinkButtonProps) {
  const { variant = 'primary', size = 'md', leftIcon, rightIcon, className, children, ...rest } = props;
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </Link>
  );
}

export function AnchorButton(props: AnchorButtonProps) {
  const { variant = 'primary', size = 'md', leftIcon, rightIcon, className, children, href, target, rel } = props;
  return (
    <a
      href={href}
      target={target}
      rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </a>
  );
}
