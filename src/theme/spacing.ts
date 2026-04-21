export const spacing = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Sizes from Stitch project `18386357471434296476` (Home HTML).
 * Tailwind: `px-8`, `gap-8`, `w-[160px]` `h-[240px]`, hero `h-[450px]`.
 */
export const stitchLayout = {
  screenGutter: 32,
  posterWidth: 160,
  posterHeight: 240,
  heroBandHeight: 450,
  /** Horizontal gap between carousel cards (`gap-8`). */
  posterRowGap: 32,
} as const;

/**
 * Corner radii from Stitch tailwind extend:
 * `DEFAULT` 4px, `lg` 8px, `xl` 12px, `full` pill.
 * Legacy `sm`/`md` kept for non–Stitch-parity screens (e.g. watchlist).
 */
export const radius = {
  pill: 9999,
  /** Legacy — 12px (watchlist cards, etc.). */
  sm: 12,
  /** Legacy — 16px. */
  md: 16,
  /** Stitch `rounded` — badges, tiny surfaces (4px). */
  stitchXs: 4,
  /** Stitch `rounded-lg` — CTAs, tab bar top (`rounded-t-lg`). */
  stitchLg: 8,
  /** Stitch `rounded-xl` — poster frames, hero shell (12px). */
  stitchXl: 12,
} as const;
