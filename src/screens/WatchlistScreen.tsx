import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useWatchlistStore} from '../store/watchlistStore';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

export default function WatchlistScreen() {
  const items = useWatchlistStore(state => state.items);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Watchlist</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>
          Your watchlist is empty. Start adding movies!
        </Text>
      ) : (
        <Text style={styles.meta}>{items.length} titles saved</Text>
      )}
    </View>
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
  empty: {
    ...typography.body_md,
    color: colors.on_surface_variant,
  },
  meta: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
  },
});
