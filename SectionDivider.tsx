import { cn } from '@/lib/utils';

interface Props {
  /** Background color of the section ABOVE the divider. */
  fromColor?: string;
  /** Background color of the section BELOW the divider (the wave fills this). */
  toColor?: string;
  /** Flip vertically — useful when the colors are reversed. */
  flip?: boolean;
  className?: string;
}

/**
 * Subtle SVG wave divider between two same- or near-same-colored sections.
 * Pure SVG — no animation, just a visual seam to break up content blocks.
 */
export function SectionDivider({
  fromColor = '#FFFFFF',
  toColor = '#F8FAFC',
  flip = false,
  className,
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn('w-full leading-none -mb-px', className)}
      style={{ backgroundColor: fromColor }}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className={cn('block w-full h-[40px] sm:h-[60px]', flip && 'scale-y-[-1]')}
      >
        <path
          d="M0 30 C 240 60, 480 0, 720 20 C 960 40, 1200 50, 1440 20 L1440 60 L0 60 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}

export default SectionDivider;
