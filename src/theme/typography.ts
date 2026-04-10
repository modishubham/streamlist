import {TextStyle} from 'react-native';

export const typography = {
  display_lg: {
    fontFamily: 'ManropeExtraBold',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -0.02 * 56,
  } satisfies TextStyle,

  display_md: {
    fontFamily: 'ManropeExtraBold',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.02 * 40,
  } satisfies TextStyle,

  headline_md: {
    fontFamily: 'ManropeBold',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.01 * 28,
  } satisfies TextStyle,

  title_lg: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0,
  } satisfies TextStyle,

  title_sm: {
    fontFamily: 'InterSemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  } satisfies TextStyle,

  body_md: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
  } satisfies TextStyle,

  label_sm: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
  } satisfies TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
