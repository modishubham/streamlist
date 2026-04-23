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
 * Sizes from Stitch project `18386357471434296476` — "Home (Updated Nav)".
 * HTML: `px-8`, `gap-8`, `w-[160px]` `h-[240px]`, hero `h-[450px]`.
 *
 * On device, row posters use `homeRowCardDimensions()` so two full cards
 * (plus one gap) fit the visible area between screen gutters, matching
 * the Stitch horizontal row intent at a larger touch size.
 */
export const stitchLayout = {
  screenGutter: 32,
  /** Reference poster width in Stitch HTML (160px at design width). */
  posterWidth: 160,
  /** Reference poster height in Stitch HTML (240px). */
  posterHeight: 240,
  heroBandHeight: 450,
  /** Horizontal gap between carousel cards (`gap-8`). */
  posterRowGap: 32,
} as const;

/** Two full poster cards + one `posterRowGap` between screen gutters. */
export function homeRowCardDimensions(
  windowWidth: number,
): {width: number; height: number} {
  const g = stitchLayout.screenGutter;
  const gap = stitchLayout.posterRowGap;
  const w = Math.max(
    0,
    Math.floor((windowWidth - 2 * g - gap) / 2),
  );
  const h = Math.round(
    (w * stitchLayout.posterHeight) / stitchLayout.posterWidth,
  );
  return {width: w, height: h};
}

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
