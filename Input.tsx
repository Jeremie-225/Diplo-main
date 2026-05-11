import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BaseProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  className?: string;
  id?: string;
}

const fieldBase =
  'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent disabled:bg-neutral-50';

function fieldClasses(hasError: boolean, withLeftIcon: boolean): string {
  return cn(
    fieldBase,
    hasError ? 'border-error' : 'border-neutral-100',
    withLeftIcon && 'pl-10',
  );
}

function FieldShell({
  label,
  error,
  hint,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-neutral-900">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-neutral-700/70">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, className, id, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={id} className={className}>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700/60 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          className={fieldClasses(!!error, !!leftIcon)}
          {...rest}
        />
      </div>
    </FieldShell>
  );
});

type TextAreaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, className, id, rows = 4, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={id} className={className}>
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        aria-invalid={!!error}
        className={fieldClasses(!!error, false)}
        {...rest}
      />
    </FieldShell>
  );
});

type SelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, id, children, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={id} className={className}>
      <select
        id={id}
        ref={ref}
        aria-invalid={!!error}
        className={fieldClasses(!!error, false)}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
});
