import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.placeholder}>Coming soon</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  heading: {
    ...typography.display_md,
    color: colors.on_surface,
    marginBottom: spacing.md,
  },
  placeholder: {
    ...typography.body_md,
    color: colors.on_surface_variant,
  },
});
