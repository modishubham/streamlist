import React, {useCallback, useMemo} from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type {Movie} from '../../api/types';
import ContentCard from '../common/ContentCard';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatMovieSubtitle} from '../../utils/movieDisplay';

function RowItemSeparator() {
  return <View style={styles.itemSeparator} />;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  genreNamesById: Map<number, string>;
  onSeeAll: () => void;
  onSelectMovie: (movieId: number) => void;
  onNearEnd: () => void;
  listKey: string;
}

function MovieRow({
  title,
  movies,
  genreNamesById,
  onSeeAll,
  onSelectMovie,
  onNearEnd,
  listKey,
}: MovieRowProps) {
  const {width: windowWidth} = useWindowDimensions();

  const cardWidth = useMemo(() => {
    const gap = spacing.md;
    const pad = spacing.md * 2;
    return (windowWidth - pad - gap) / 2;
  }, [windowWidth]);

  const itemSpan = cardWidth + spacing.md;

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {contentOffset, layoutMeasurement, contentSize} = e.nativeEvent;
      const visibleEndX = contentOffset.x + layoutMeasurement.width;
      const remaining = contentSize.width - visibleEndX;
      if (remaining <= 3 * itemSpan) {
        onNearEnd();
      }
    },
    [itemSpan, onNearEnd],
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={onSeeAll} hitSlop={spacing.xs}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>
      <FlatList
        key={listKey}
        horizontal
        data={movies}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={RowItemSeparator}
        renderItem={({item}) => (
          <ContentCard
            posterPath={item.poster_path}
            title={item.title}
            subtitle={formatMovieSubtitle(item, genreNamesById)}
            onPress={() => onSelectMovie(item.id)}
            style={{width: cardWidth}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.headline_md,
    color: colors.on_surface,
  },
  seeAll: {
    ...typography.title_sm,
    color: colors.see_all,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  itemSeparator: {
    width: spacing.md,
  },
});

export default React.memo(MovieRow);
