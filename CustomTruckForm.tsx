/**
 * CustomTruckForm — inline form rendered when the user picks the
 * "Custom" chip in truck mode. Captures internal cargo-bay dimensions
 * (cm) and an optional payload limit (kg).
 *
 * Validation runs on **blur**, not on every keystroke — typing while a
 * red error sits next to the field is uncomfortable. The Apply button
 * is disabled until the schema validates clean.
 */

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Check, Truck } from 'lucide-react';
import type { TruckCustom } from '@/hooks/useSimulationCart';

const customTruckSchema = z.object({
  length_cm: z.coerce
    .number()
    .min(100, 'Min 100 cm')
    .max(2000, 'Max 2000 cm'),
  width_cm: z.coerce
    .number()
    .min(100, 'Min 100 cm')
    .max(400, 'Max 400 cm'),
  height_cm: z.coerce
    .number()
    .min(80, 'Min 80 cm')
    .max(400, 'Max 400 cm'),
  max_payload_kg: z.coerce
    .number()
    .min(100, 'Min 100 kg')
    .max(50_000, 'Max 50 000 kg')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

type FormValues = z.infer<typeof customTruckSchema>;

interface Props {
  /** Initial values (used to round-trip persisted custom dimensions). */
  initial?: TruckCustom;
  onApply: (custom: TruckCustom) => void;
}

export function CustomTruckForm({ initial, onApply }: Props) {
  const [appliedSummary, setAppliedSummary] = useState<string | null>(() =>
    initial
      ? buildSummary(initial)
      : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(customTruckSchema),
    mode: 'onBlur',
    defaultValues: {
      length_cm: initial?.length_cm ?? 600,
      width_cm: initial?.width_cm ?? 220,
      height_cm: initial?.height_cm ?? 240,
      max_payload_kg: initial?.max_payload_kg,
    },
  });

  // Live preview of dimensions while the user types (purely cosmetic)
  const live = watch();
  const livePreview = useMemo(() => {
    const l = Number(live.length_cm);
    const w = Number(live.width_cm);
    const h = Number(live.height_cm);
    if (!Number.isFinite(l) || !Number.isFinite(w) || !Number.isFinite(h)) return null;
    if (l <= 0 || w <= 0 || h <= 0) return null;
    const vol = (l * w * h) / 1_000_000;
    return `${l} × ${w} × ${h} cm  ·  ~${vol.toFixed(2)} m³`;
  }, [live.length_cm, live.width_cm, live.height_cm]);

  // Reset summary if the initial prop changes (e.g. round-trip from another tab)
  useEffect(() => {
    if (initial) setAppliedSummary(buildSummary(initial));
  }, [initial]);

  function onSubmit(values: FormValues) {
    const payload = {
      length_cm: values.length_cm,
      width_cm: values.width_cm,
      height_cm: values.height_cm,
      max_payload_kg:
        typeof values.max_payload_kg === 'number'
          ? values.max_payload_kg
          : undefined,
    };
    onApply(payload);
    setAppliedSummary(buildSummary(payload));
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border-2 border-dashed p-3 sm:p-4"
      style={{
        borderColor: 'var(--sim-primary-light)',
        background: 'var(--sim-primary-soft)',
      }}
      aria-label="Custom truck dimensions"
    >
      <div className="flex items-start gap-2 mb-3">
        <Truck
          className="w-4 h-4 mt-0.5"
          style={{ color: 'var(--sim-primary)' }}
          aria-hidden="true"
        />
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-widest leading-tight"
            style={{ color: 'var(--sim-primary)' }}
          >
            Custom truck size
          </p>
          <p
            className="text-[11px] leading-tight mt-0.5"
            style={{ color: 'var(--sim-text-secondary)' }}
          >
            Enter your truck's internal cargo-bay dimensions. Not sure?
            Check your vehicle manual.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Field
          label="Length (cm)"
          register={register('length_cm', { valueAsNumber: true })}
          error={errors.length_cm?.message}
        />
        <Field
          label="Width (cm)"
          register={register('width_cm', { valueAsNumber: true })}
          error={errors.width_cm?.message}
        />
        <Field
          label="Height (cm)"
          register={register('height_cm', { valueAsNumber: true })}
          error={errors.height_cm?.message}
        />
        <Field
          label="Max load (kg)"
          register={register('max_payload_kg')}
          error={errors.max_payload_kg?.message}
          optional
        />
      </div>

      {livePreview && !appliedSummary && (
        <p
          className="mt-2 text-[10px] font-mono tabular-nums"
          style={{ color: 'var(--sim-text-secondary)' }}
        >
          {livePreview}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={!isValid}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
          style={{
            background: isValid ? 'var(--sim-gold)' : 'var(--sim-surface-2)',
            color: isValid ? '#0A1628' : 'var(--sim-text-muted)',
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}
        >
          <Check className="w-3 h-3" />
          Apply dimensions
        </button>
        {appliedSummary && (
          <p
            className="text-[11px] font-semibold font-mono"
            style={{ color: 'var(--sim-ok)' }}
          >
            ✓ {appliedSummary}
          </p>
        )}
      </div>
    </motion.form>
  );
}

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

function buildSummary(c: TruckCustom): string {
  const vol = (c.length_cm * c.width_cm * c.height_cm) / 1_000_000;
  const payload = c.max_payload_kg
    ? `${c.max_payload_kg.toLocaleString()} kg capacity`
    : 'no weight limit';
  return `${c.length_cm} × ${c.width_cm} × ${c.height_cm} cm · ${vol.toFixed(2)} m³ · ${payload}`;
}

interface FieldProps {
  label: string;
  register: ReturnType<ReturnType<typeof useForm<FormValues>>['register']>;
  error?: string;
  optional?: boolean;
}

function Field({ label, register: reg, error, optional }: FieldProps) {
  return (
    <label className="block">
      <span
        className="text-[10px] font-semibold uppercase tracking-wider leading-none"
        style={{ color: 'var(--sim-text-secondary)' }}
      >
        {label}
        {optional && (
          <span className="font-normal" style={{ color: 'var(--sim-text-muted)' }}>
            {' '}· opt
          </span>
        )}
      </span>
      <input
        type="number"
        step="1"
        min="0"
        {...reg}
        className="mt-1 w-full px-2 py-1.5 text-sm font-semibold tabular-nums rounded-md focus:outline-none focus:ring-2"
        style={{
          background: 'var(--sim-surface-2)',
          color: 'var(--sim-text-primary)',
          border: `1px solid ${error ? 'var(--sim-danger)' : 'var(--sim-border)'}`,
        }}
        aria-invalid={!!error}
      />
      {error && (
        <span
          className="text-[10px] font-medium"
          style={{ color: 'var(--sim-danger)' }}
        >
          {error}
        </span>
      )}
    </label>
  );
}
