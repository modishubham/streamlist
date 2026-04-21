import {TextStyle} from 'react-native';

export const typography = {
  display_lg: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -0.02 * 56,
  } satisfies TextStyle,

  display_md: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.02 * 40,
  } satisfies TextStyle,

  headline_md: {
    fontFamily: 'Manrope-Bold',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.01 * 28,
  } satisfies TextStyle,

  title_lg: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0,
  } satisfies TextStyle,

  title_sm: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  } satisfies TextStyle,

  body_md: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
  } satisfies TextStyle,

  /** Search field input — slightly larger than body for tap targets and design parity. */
  search_input: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
  } satisfies TextStyle,

  label_sm: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
  } satisfies TextStyle,

  chip_label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  } satisfies TextStyle,

  /**
   * Stitch “Home (Updated Nav)” — `font-headline` / `font-body` from HTML.
   * Headlines: Manrope; chips, CTAs, metadata: Inter.
   */
  home_wordmark: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
  } satisfies TextStyle,

  /** Hero movie title (`text-5xl` Manrope extrabold, tight tracking). */
  home_hero_title: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -0.03 * 48,
    lineHeight: 52,
  } satisfies TextStyle,

  /** Hero synopsis (`text-base` Inter). */
  home_hero_synopsis: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 22,
  } satisfies TextStyle,

  /** Hero badge (`text-[10px]` bold caps, wide tracking). */
  home_hero_badge: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  } satisfies TextStyle,

  /**
   * Hero CTAs — Stitch `font-bold` + default body scale on buttons (~15–16px).
   * Inter-SemiBold is the heaviest Inter shipped in the app (closest to `font-bold`).
   */
  home_hero_cta: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.15,
    lineHeight: 20,
  } satisfies TextStyle,

  /** Genre pills (`text-sm font-semibold tracking-wide`). */
  home_genre_chip: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.35,
  } satisfies TextStyle,

  /** Row headings (`font-headline text-2xl font-bold tracking-tight`). */
  home_row_title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.01 * 24,
  } satisfies TextStyle,

  /** “See All” link (`text-sm font-semibold`). */
  home_row_see_all: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  } satisfies TextStyle,

  /** Poster row title (`font-semibold text-sm`). */
  home_card_title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  } satisfies TextStyle,

  /** Poster row subtitle (`text-xs`). */
  home_card_meta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
  } satisfies TextStyle,

  /** Bottom load row (`text-xs uppercase` wide tracking, semibold). */
  home_load_more: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2.4,
  } satisfies TextStyle,

  /**
   * Tab labels (`text-[10px]` uppercase wide tracking).
   * Uses Inter-SemiBold (only Inter weights linked in the app).
   */
  home_tab_label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
  } satisfies TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
