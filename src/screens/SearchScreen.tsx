import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSearch} from '../hooks/useSearch';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

export default function SearchScreen() {
  const {results, loading, error, query, setQuery} = useSearch();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TextInput
        style={styles.input}
        placeholder="Search movies…"
        placeholderTextColor={colors.on_surface_variant}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />

      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color={colors.primary}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && query.trim().length > 0 && (
        <Text style={styles.meta}>{results.length} results</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  input: {
    ...typography.body_md,
    color: colors.on_surface,
    backgroundColor: colors.surface_container_high,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  loader: {
    marginTop: spacing.lg,
  },
  meta: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.body_md,
    color: colors.primary_container,
    marginTop: spacing.sm,
  },
});
