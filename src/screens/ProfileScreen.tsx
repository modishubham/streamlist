import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppBrandedHeader from '../components/common/AppBrandedHeader';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, stitchLayout} from '../theme/spacing';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBrandedHeader rightSlot={<View style={styles.headerSpacer} />} />
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.placeholder}>Coming soon</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  heading: {
    ...typography.display_md,
    color: colors.on_surface,
    marginBottom: spacing.md,
    paddingHorizontal: stitchLayout.screenGutter,
    marginTop: spacing.md,
  },
  placeholder: {
    ...typography.body_md,
    color: colors.on_surface_variant,
    paddingHorizontal: stitchLayout.screenGutter,
  },
});
