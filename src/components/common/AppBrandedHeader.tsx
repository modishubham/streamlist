import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';
import {HOME_HEADER_CONTENT_HEIGHT} from '../home/homeLayout';
import {spacing, stitchLayout} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export interface AppBrandedHeaderProps {
  style?: StyleProp<ViewStyle>;
  /** Right side of the bar (search profile, actions, etc.). */
  rightSlot?: React.ReactNode;
  /** Shown when `rightSlot` is omitted — home / default. */
  onPressNotifications?: () => void;
}

/**
 * Stitch top bar: `movie` + “StreamList” (Manrope 24 / `#E5383B`), `px-8`, `h-20` band.
 */
function AppBrandedHeader({
  style,
  rightSlot,
  onPressNotifications,
}: AppBrandedHeaderProps) {
  const trailing =
    rightSlot ??
    (
      <Pressable
        onPress={onPressNotifications}
        hitSlop={spacing.sm}
        accessibilityRole="button"
        accessibilityLabel="Notifications">
        <Icon
          name="notifications"
          size={24}
          color={colors.on_surface_variant}
        />
      </Pressable>
    );

  return (
    <View style={[styles.row, style]}>
      <View style={styles.brand}>
        <Icon name="movie" size={24} color={colors.brand_accent} />
        <Text style={styles.wordmark}>StreamList</Text>
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: HOME_HEADER_CONTENT_HEIGHT,
    paddingHorizontal: stitchLayout.screenGutter,
    paddingVertical: spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordmark: {
    ...typography.home_wordmark,
    color: colors.brand_accent,
    textTransform: 'uppercase',
  },
});

export default React.memo(AppBrandedHeader);
