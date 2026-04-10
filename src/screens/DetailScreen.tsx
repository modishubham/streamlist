import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useMovieDetail} from '../hooks/useMovieDetail';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Detail'>;

export default function DetailScreen({route}: Props) {
  const {movieId} = route.params;
  const {movie, loading, error} = useMovieDetail(movieId);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? 'Movie not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.tagline}>{movie.tagline}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
    </View>
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
  title: {
    ...typography.display_md,
    color: colors.on_surface,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.title_sm,
    color: colors.on_surface_variant,
    marginBottom: spacing.md,
  },
  overview: {
    ...typography.body_md,
    color: colors.on_surface,
  },
  errorText: {
    ...typography.body_md,
    color: colors.primary_container,
  },
});
