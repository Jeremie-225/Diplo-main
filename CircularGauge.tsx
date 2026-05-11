/**
 * CircularGauge — pure-SVG progress ring used by the Load Status card.
 *
 * Behaviour:
 *   - Background "track" ring in `--sim-border`.
 *   - Foreground "progress" ring whose `stroke-dashoffset` animates
 *     between 0 and `CIRCUMFERENCE` based on the percentage.
 *   - Stroke colour shifts at 75 / 90 / 100 % thresholds (green → amber →
 *     orange → red), with a CSS pulse at 100 %.
 *   - Center shows the percentage (big, mono) and a label (small caps).
 *
 * Accessibility:
 *   - `role="meter"` with `aria-valuenow / valuemin / valuemax / aria-label`.
 *
 * Empty state:
 *   - When `percentage === 0`, the progress ring is hidden and the centre
 *     reads "—" so we don't show a bright green-at-zero indicator.
 */

interface Props {
  /** 0–100. Values outside the range clamp at 0 or 100 visually but the
   *  text honours whatever you pass (so >100 shows as "104%"). */
  percentage: number;
  /** Top label inside the ring (e.g. "VOLUME"). */
  label: string;
  /** Optional readout displayed below the ring. e.g. "51 m³". */
  value?: string;
  /** Optional max for the readout. e.g. "67 m³". */
  maxValue?: string;
  /** Outer pixel size — ring + label. Defaults to 120. */
  size?: number;
  /** Override the aria-label. Defaults to `${label}: ${percentage}%`. */
  ariaLabel?: string;
}

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~282.7

function colorFor(pct: number): string {
  if (pct >= 100) return 'var(--sim-danger)';
  if (pct >= 90) return 'var(--sim-danger-light)';
  if (pct >= 75) return 'var(--sim-warn)';
  return 'var(--sim-ok)';
}

export function CircularGauge({
  percentage,
  label,
  value,
  maxValue,
  size = 120,
  ariaLabel,
}: Props) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const isEmpty = percentage <= 0;
  const isFull = percentage >= 100;
  const stroke = isEmpty ? 'var(--sim-text-muted)' : colorFor(percentage);

  return (
    <div
      className="flex flex-col items-center"
      role="meter"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel ?? `${label}: ${Math.round(percentage)}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="block"
      >
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--sim-border)"
          strokeWidth="6"
        />
        {/* Progress (hidden when empty) */}
        {!isEmpty && (
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            className={isFull ? 'sim-ring-pulse' : undefined}
            style={{
              transition:
                'stroke-dashoffset 400ms ease, stroke 300ms ease',
            }}
          />
        )}
        {/* Center text */}
        <text
          x="50"
          y="48"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="22"
          fontWeight="800"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fill={isEmpty ? 'var(--sim-text-muted)' : 'var(--sim-text-primary)'}
        >
          {isEmpty ? '—' : `${Math.round(percentage)}%`}
        </text>
        <text
          x="50"
          y="64"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          letterSpacing="2"
          fontWeight="700"
          fill="var(--sim-text-secondary)"
        >
          {label.toUpperCase()}
        </text>
      </svg>
      {(value !== undefined || maxValue !== undefined) && (
        <p
          className="mt-1.5 text-[11px] font-mono tabular-nums"
          style={{ color: 'var(--sim-text-secondary)' }}
        >
          <span style={{ color: 'var(--sim-text-primary)' }}>{value ?? '—'}</span>
          {maxValue !== undefined && (
            <>
              <span className="opacity-60"> / </span>
              <span>{maxValue}</span>
            </>
          )}
        </p>
      )}
    </div>
  );
}

/**
 * Mobile fallback — horizontal bar with the same color rules + percentage.
 * Used inside the Load Status card on viewports too narrow for two rings.
 */
export function HorizontalGauge({
  percentage,
  label,
  value,
  maxValue,
}: Props) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const isEmpty = percentage <= 0;
  const isFull = percentage >= 100;
  const stroke = isEmpty ? 'var(--sim-text-muted)' : colorFor(percentage);

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-[11px]">
        <span
          className="font-bold uppercase tracking-widest"
          style={{ color: 'var(--sim-text-secondary)' }}
        >
          {label}
        </span>
        <span
          className="font-mono tabular-nums font-bold"
          style={{ color: isEmpty ? 'var(--sim-text-muted)' : 'var(--sim-text-primary)' }}
        >
          {isEmpty ? '—' : `${Math.round(percentage)}%`}
          {(value || maxValue) && (
            <span
              className="ml-2 font-normal"
              style={{ color: 'var(--sim-text-secondary)' }}
            >
              {value}
              {maxValue && (
                <span className="opacity-60"> / {maxValue}</span>
              )}
            </span>
          )}
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: 'var(--sim-border)' }}
        role="meter"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${Math.round(percentage)}%`}
      >
        <div
          className={isFull ? 'sim-ring-pulse h-full rounded-full' : 'h-full rounded-full'}
          style={{
            width: `${clamped}%`,
            background: stroke,
            transition: 'width 400ms ease, background-color 300ms ease',
          }}
        />
      </div>
    </div>
  );
}
