export const colors = {
  // Surfaces — near-black with slight lift so UI reads vivid, not crushed
  surface: '#0C0C0C',
  surface_container_lowest: '#0F0F0F',
  surface_container_low: '#161616',
  surface_container: '#1F1F1F',
  surface_container_high: '#2E2E2E',
  surface_container_highest: '#3A3A3A',
  surface_bright: '#454545',

  // Primary accent (vibrant red + coral CTA)
  primary: '#E5484D',
  primary_container: '#E5484D',
  primary_cta: '#FF8A80',
  on_primary_cta: '#000000',
  secondary_container: '#B71C1C',

  // Text
  on_surface: '#FFFFFF',
  on_surface_muted: 'rgba(255,255,255,0.60)',
  on_surface_variant: '#C8C8C8',
  /** Placeholder text inside search fields — design uses a dimmer gray than on_surface_variant. */
  on_surface_placeholder: 'rgba(255,255,255,0.40)',

  // UI chrome
  see_all: '#C4A574',
  /** Search field and inactive genre chips — charcoal lift on near-black (design ~#2A2A2A). */
  search_field_background: '#2A2A2A',
  /** Selected genre chip — muted burgundy (less saturated than primary CTA). */
  genre_chip_active_background: '#5E2A2E',
  /** Inactive genre chip text — light red tint per design. */
  chip_inactive_text: '#D4787B',
  hero_scrim_strong: 'rgba(0,0,0,0.55)',
  hero_scrim_soft: 'transparent',
  details_button_background: 'rgba(255,255,255,0.18)',

  // Utility
  outline_variant: 'rgba(255,255,255,0.15)',
  /** Sticky home header fill at rest — slightly translucent so the screen feels less flat. */
  header_surface: 'rgba(12,12,12,0.94)',
  /** Tab bar translucent fill — replaces BlurView to avoid Android dimming. */
  tab_bar_surface: 'rgba(12,12,12,0.88)',
} as const;

export type ColorToken = keyof typeof colors;
