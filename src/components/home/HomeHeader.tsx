import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface HomeHeaderProps {
  style?: StyleProp<ViewStyle>;
  onPressNotifications?: () => void;
}

function HomeHeader({style, onPressNotifications}: HomeHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.brand}>
        <Icon
          name="local-fire-department"
          size={28}
          color={colors.primary_container}
        />
        <Text style={styles.wordmark}>STREAMLIST</Text>
      </View>
      <Pressable
        onPress={onPressNotifications}
        hitSlop={spacing.sm}
        accessibilityRole="button"
        accessibilityLabel="Notifications">
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.on_surface}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  wordmark: {
    ...typography.title_lg,
    color: colors.primary_container,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default React.memo(HomeHeader);
