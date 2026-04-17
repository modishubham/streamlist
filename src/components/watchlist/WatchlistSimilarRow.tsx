import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import ContentCard from '../common/ContentCard';
import {useSimilarMovies} from '../../hooks/useSimilarMovies';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import type {Movie} from '../../api/types';

const SIMILAR_CARD_WIDTH = 120;

type Props = {
  seedMovie: Movie;
  genreNamesById: Map<number, string>;
  onOpenDetail: (movieId: number) => void;
};

/**
 * Isolated row so `useSimilarMovies` and horizontal list live outside WatchlistScreen's ScrollView,
 * avoiding VirtualizedList-inside-ScrollView (which can break hook reconciliation).
 */
function WatchlistSimilarRow({seedMovie, genreNamesById, onOpenDetail}: Props) {
  const {movies: similarMovies} = useSimilarMovies(seedMovie.id);

  if (similarMovies.length === 0) {
    return null;
  }

  return (
    <View style={styles.similarSection}>
      <View style={styles.similarHeader}>
        <Text style={styles.similarTitle} numberOfLines={2}>
          Because you saved{'\n'}
          <Text style={styles.similarTitleHighlight}>{seedMovie.title}</Text>
        </Text>
        <Pressable
          onPress={() => onOpenDetail(seedMovie.id)}
          hitSlop={spacing.xs}
          accessibilityRole="button">
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.similarList}>
        {similarMovies.map((item, index) => (
          <View
            key={item.id}
            style={index > 0 ? styles.similarCardGap : undefined}>
            <ContentCard
              posterPath={item.poster_path}
              title={item.title}
              subtitle={
                item.genre_ids.length > 0
                  ? (genreNamesById.get(item.genre_ids[0]) ?? '').toUpperCase()
                  : item.release_date?.slice(0, 4)
              }
              onPress={() => onOpenDetail(item.id)}
              style={{width: SIMILAR_CARD_WIDTH}}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  similarSection: {
    marginBottom: spacing.xl,
  },
  similarHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  similarTitle: {
    ...typography.headline_md,
    color: colors.on_surface,
    flex: 1,
    marginRight: spacing.sm,
  },
  similarTitleHighlight: {
    color: colors.on_surface,
  },
  viewAll: {
    ...typography.title_sm,
    color: colors.primary_container,
    marginTop: spacing.xxs,
  },
  similarList: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  similarCardGap: {
    marginLeft: spacing.md,
  },
});

export default React.memo(WatchlistSimilarRow);
