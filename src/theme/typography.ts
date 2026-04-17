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
} as const;

export type TypographyToken = keyof typeof typography;
