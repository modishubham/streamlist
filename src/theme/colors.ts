export const colors = {
  /** Stitch: logo wordmark + active tab accent (theme seed). */
  brand_accent:              '#E5383B',

  // Surfaces
  surface:                   '#131313',
  surface_container_lowest:  '#0E0E0E',
  surface_container_low:     '#1C1B1B',
  surface_container:         '#232323',
  surface_container_high:    '#2A2A2A',
  surface_container_highest: '#353534',
  surface_bright:            '#3A3939',

  // Primary accent (Coral-Red)
  primary:                   '#FFB3AE',
  /** Text on solid `primary` (Stitch hero “Watch Now”). */
  on_primary:                '#68000B',
  primary_container:         '#FF5351',
  /** Text on `primary_container` (e.g. hero “New release” badge). */
  on_primary_container:      '#5C0008',
  primary_cta:               '#FF5351',
  on_primary_cta:            '#1A0000',
  secondary_container:       '#822625',

  // Text
  on_surface:                '#E5E2E1',
  on_surface_muted:          'rgba(229,226,225,0.60)',
  on_surface_variant:        '#E4BDBA',
  /** Placeholder text inside search fields — dimmer than on_surface_variant. */
  on_surface_placeholder:    'rgba(229,226,225,0.40)',

  // UI chrome
  see_all:                   '#E4BDBA',
  /** Search field and inactive genre chips — maps to surface_container_high. */
  search_field_background:   '#2A2A2A',
  /** Selected genre chip — secondary_container deep red. */
  genre_chip_active_background: '#822625',
  /** Inactive genre chip text — primary light tint. */
  chip_inactive_text:        '#FFB3AE',
  /** Stitch inactive chip border (`border-outline-variant/10`). */
  chip_inactive_border:      'rgba(91, 64, 62, 0.12)',
  hero_scrim_strong:         'rgba(0,0,0,0.55)',
  hero_scrim_soft:           'transparent',
  details_button_background: 'rgba(255,255,255,0.18)',

  /** Rating chip — secondary_container at 30% opacity. */
  rating_chip_bg:            'rgba(130,38,37,0.30)',

  /** Placeholder blocks for skeleton loading UI. */
  skeleton_base:             '#2A2A2A',
  skeleton_shimmer:          '#3A3939',

  // Utility
  outline_variant:           'rgba(255,255,255,0.15)',
  /** Sticky home header fill at rest — translucent surface. */
  header_surface:            'rgba(19,19,19,0.94)',
  /** Tab bar translucent fill. */
  tab_bar_surface:           'rgba(19,19,19,0.88)',
} as const;

export type ColorToken = keyof typeof colors;
