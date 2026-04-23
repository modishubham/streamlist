import React, {useCallback} from 'react';
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
import {homeRowCardDimensions, spacing, stitchLayout} from '../../theme/spacing';
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
  const {width: cardWidth, height: cardPosterHeight} =
    homeRowCardDimensions(windowWidth);

  const itemSpan = cardWidth + stitchLayout.posterRowGap;

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
            layoutVariant="stitch"
            posterPath={item.poster_path}
            title={item.title}
            subtitle={formatMovieSubtitle(item, genreNamesById)}
            onPress={() => onSelectMovie(item.id)}
            stitchImageHeight={cardPosterHeight}
            style={[styles.poster, {width: cardWidth}]}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing['3xl'] + spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: stitchLayout.screenGutter,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.home_row_title,
    color: colors.on_surface,
  },
  seeAll: {
    ...typography.home_row_see_all,
    color: colors.on_surface_variant,
  },
  listContent: {
    paddingHorizontal: stitchLayout.screenGutter,
  },
  itemSeparator: {
    width: stitchLayout.posterRowGap,
  },
  poster: {
    flexShrink: 0,
  },
});

export default React.memo(MovieRow);
