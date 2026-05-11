/**
 * QuantityInput — a controlled-with-draft number input.
 *
 * Why this exists:
 *   The simulator cart's `trySetQuantity` runs volume/weight validation on
 *   every commit. When a user typed "500" into a controlled input that
 *   wrote to cart state on every keystroke, "5" → "50" → "500" each
 *   triggered a validation pass — and the intermediate "500" might trip
 *   the limit, blocking the dispatch and leaving the field stuck at "5".
 *
 *   This component keeps a local `draft` string. `onChange` only updates
 *   the draft (if it's numeric) — no commits, no validation. `onBlur`
 *   parses the draft, asks the parent to commit, and the parent caps to
 *   what fits and toasts if needed. `Enter` triggers blur.
 *
 *   The parent is expected to call `commit(parsedValue)` and then update
 *   `value` to whatever was actually committed (cap-to-fit, etc.). When
 *   `value` changes externally (e.g. the +/− buttons or a fill-button),
 *   the draft re-syncs via the effect below.
 *
 * Treats `0` on blur as "remove this product" — the parent decides what
 * that means in practice (committing 0 to `trySetQuantity` already does
 * the right thing in the existing cart hook).
 */

import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface QuantityInputProps {
  /** Currently committed quantity. */
  value: number;
  /** Disable the input entirely. */
  disabled?: boolean;
  /** Called on blur / Enter with the parsed numeric value. */
  onCommit: (value: number) => void;
  /** Optional aria label. */
  ariaLabel?: string;
  className?: string;
  /** Same `onFocus` is internally wired to select-all. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
  function QuantityInput(
    { value, disabled, onCommit, ariaLabel, className, onFocus },
    ref,
  ) {
    const [draft, setDraft] = useState(() => String(value));
    const lastCommittedRef = useRef(value);

    // Sync the draft when the committed value changes externally
    // (e.g. + / - buttons, a fill-percentage button, or the parent
    // capping a requested value).
    useEffect(() => {
      if (value !== lastCommittedRef.current) {
        lastCommittedRef.current = value;
        setDraft(String(value));
      }
    }, [value]);

    function commitDraft() {
      const trimmed = draft.trim();
      if (trimmed === '') {
        // Empty → revert silently to last valid value.
        setDraft(String(value));
        return;
      }
      // Strip everything that isn't a digit (handles pasted "1,234" etc.)
      const digits = trimmed.replace(/[^0-9]/g, '');
      if (digits === '') {
        setDraft(String(value));
        return;
      }
      const parsed = parseInt(digits, 10);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setDraft(String(value));
        return;
      }
      lastCommittedRef.current = parsed;
      onCommit(parsed);
    }

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        spellCheck={false}
        value={draft}
        disabled={disabled}
        aria-label={ariaLabel}
        onFocus={(e) => {
          // Select-all on focus so users can type a replacement immediately.
          e.target.select();
          onFocus?.(e);
        }}
        onChange={(e) => {
          const raw = e.target.value;
          // Allow empty (so users can clear and retype) and any numeric input
          // — including pasted values with commas/spaces, which we'll
          // normalise on blur.
          if (raw === '' || /^[0-9 ,. ]*$/.test(raw)) {
            setDraft(raw);
          }
          // Anything else (e.g. letters) is silently rejected so the field
          // doesn't flicker.
        }}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            (e.currentTarget as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            setDraft(String(value));
            (e.currentTarget as HTMLInputElement).blur();
          }
        }}
        className={cn(
          'text-center font-mono tabular-nums focus:outline-none',
          className,
        )}
      />
    );
  },
);
