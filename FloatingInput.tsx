import { forwardRef, useState, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Floating-label inputs — the label sits inside the field at rest, and
 * lifts + shrinks when the field is focused or has a value. We use the
 * `peer` Tailwind utility on the input so the label can react to its
 * focus / placeholder-shown state with pure CSS (no JS state needed).
 *
 * Errors animate in with a small horizontal shake to grab attention.
 */

const fieldBase =
  'peer block w-full rounded-lg border bg-white px-4 pt-5 pb-2 text-sm text-neutral-900 transition-all focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent placeholder-transparent';

const labelBase =
  'absolute left-4 top-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-700/70 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-neutral-700/60 peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-[11px] peer-focus:text-primary peer-focus:tracking-wider peer-focus:uppercase pointer-events-none';

function ErrorText({ error }: { error?: string }) {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          key={error}
          role="alert"
          // Horizontal shake to draw attention without being annoying.
          initial={{ opacity: 0, x: -6 }}
          animate={{
            opacity: 1,
            x: [0, -4, 4, -3, 3, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ x: { duration: 0.4 }, opacity: { duration: 0.2 } }}
          className="mt-1.5 text-xs text-error"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

export const FloatingInput = forwardRef<HTMLInputElement, InputProps>(function FloatingInput(
  { label, error, hint, leftIcon, className, id, ...rest },
  ref,
) {
  const [hasIcon] = useState(!!leftIcon);
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {hasIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700/60 z-10 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          placeholder={label}
          className={cn(
            fieldBase,
            error ? 'border-error' : 'border-neutral-100',
            hasIcon && 'pl-10',
          )}
          {...rest}
        />
        <label
          htmlFor={id}
          className={cn(labelBase, hasIcon && 'left-10 peer-placeholder-shown:left-10')}
        >
          {label}
        </label>
      </div>
      {error ? (
        <ErrorText error={error} />
      ) : hint ? (
        <p className="mt-1 text-xs text-neutral-700/70">{hint}</p>
      ) : null}
    </div>
  );
});

type TextAreaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const FloatingTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function FloatingTextArea(
  { label, error, hint, className, id, rows = 4, ...rest },
  ref,
) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          placeholder={label}
          className={cn(
            fieldBase,
            'pt-6',
            error ? 'border-error' : 'border-neutral-100',
          )}
          {...rest}
        />
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
      </div>
      {error ? (
        <ErrorText error={error} />
      ) : hint ? (
        <p className="mt-1 text-xs text-neutral-700/70">{hint}</p>
      ) : null}
    </div>
  );
});

type SelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement>;

export const FloatingSelect = forwardRef<HTMLSelectElement, SelectProps>(function FloatingSelect(
  { label, error, hint, className, id, children, ...rest },
  ref,
) {
  // Selects always have a value (even an empty one), so the label sits at
  // the top permanently — no peer-placeholder-shown trick available.
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        <label
          htmlFor={id}
          className="absolute left-4 top-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-700/70 z-10 pointer-events-none"
        >
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            'block w-full rounded-lg border bg-white px-4 pt-5 pb-2 text-sm text-neutral-900 transition-all focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent appearance-none',
            error ? 'border-error' : 'border-neutral-100',
          )}
          {...rest}
        >
          {children}
        </select>
        {/* Custom chevron so the floating label has room */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error ? (
        <ErrorText error={error} />
      ) : hint ? (
        <p className="mt-1 text-xs text-neutral-700/70">{hint}</p>
      ) : null}
    </div>
  );
});
