import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useHome} from '../hooks/useHome';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

export default function HomeScreen() {
  const {trending, topRated, loading, error} = useHome();

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Trending Now</Text>
      <Text style={styles.meta}>
        {trending.length} titles · {topRated.length} top rated
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    ...typography.headline_md,
    color: colors.on_surface,
    marginBottom: spacing.sm,
  },
  meta: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
  },
  errorText: {
    ...typography.body_md,
    color: colors.primary_container,
  },
});
